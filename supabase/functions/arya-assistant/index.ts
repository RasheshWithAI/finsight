
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Get the Google API key from environment variables
const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, topic } = await req.json();
    
    // Define system prompts based on financial topics
    let systemPrompt = "You are Arya, an AI financial assistant. You help users understand finance, investments, budgeting, and provide insights about the stock market.";
    
    if (topic) {
      switch(topic.toLowerCase()) {
        case "budgeting":
          systemPrompt += " You're currently focusing on helping the user with budgeting strategies and expense management.";
          break;
        case "investing":
          systemPrompt += " You're currently focusing on investment strategies, stock analysis, and portfolio management.";
          break;
        case "savings":
          systemPrompt += " You're currently focusing on savings strategies, emergency funds, and financial planning.";
          break;
        case "market":
          systemPrompt += " You're currently focusing on stock market trends, analysis, and investment opportunities.";
          break;
        case "tax":
          systemPrompt += " You're currently focusing on tax strategies, tax planning, and potential deductions.";
          break;
      }
    }
    
    // Add financial expertise details to make responses more credible
    systemPrompt += " Provide specific, actionable advice based on financial best practices. Use numbers, percentages, and concrete examples when appropriate. Always include a brief disclaimer that you're providing educational content, not financial advice.";

    // Prepare the conversation history including system prompt
    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    // Call the Google API
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GOOGLE_API_KEY,
      },
      body: JSON.stringify({
        contents: formattedMessages,
        generationConfig: {
          temperature: 0.4,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    // Process the API response
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || "Error from Google API");
    }
    
    let responseText = "";
    
    if (data.candidates && data.candidates.length > 0 && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts.length > 0) {
      responseText = data.candidates[0].content.parts[0].text;
    } else {
      responseText = "I'm sorry, but I couldn't generate a helpful response at the moment.";
    }

    return new Response(JSON.stringify({ 
      response: responseText, 
      topic: topic || "general"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in arya-assistant function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message || "An error occurred while processing your request.",
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
