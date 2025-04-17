
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
    // Check if API key is available
    if (!GOOGLE_API_KEY) {
      console.error('GOOGLE_API_KEY environment variable is not set');
      return new Response(JSON.stringify({ 
        error: 'API configuration error', 
        message: 'The Google API key is not configured properly'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Google API Key is configured:', GOOGLE_API_KEY.substring(0, 3) + '...');

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

    console.log('Calling Google Gemini API with messages:', JSON.stringify(formattedMessages.slice(0, 1)));

    try {
      // Call the Google AI API with additional logging
      const apiUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';
      console.log(`Calling Gemini API at: ${apiUrl}`);
      
      const payload = {
        contents: formattedMessages.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.content }]
        })),
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
      };
      
      console.log('Request payload (first part):', JSON.stringify(payload).substring(0, 200) + '...');
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GOOGLE_API_KEY,
        },
        body: JSON.stringify(payload),
      });

      console.log('Gemini API response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Gemini API error:', response.status, errorData);
        throw new Error(`Gemini API error: ${response.status} ${errorData}`);
      }
      
      // Process the API response
      const data = await response.json();
      console.log('Gemini API response received, processing...');
      
      if (data.error) {
        console.error('Error in Gemini API response:', data.error);
        throw new Error(data.error.message || "Error from Google API");
      }
      
      let responseText = "";
      
      if (data.candidates && data.candidates.length > 0 && 
          data.candidates[0].content && 
          data.candidates[0].content.parts && 
          data.candidates[0].content.parts.length > 0) {
        responseText = data.candidates[0].content.parts[0].text;
        console.log('Successfully extracted response text');
      } else {
        console.warn('Unexpected response format from Gemini API:', JSON.stringify(data).substring(0, 300));
        responseText = "I'm sorry, but I couldn't generate a helpful response at the moment.";
      }

      console.log('Gemini API response received successfully');

      return new Response(JSON.stringify({ 
        response: responseText, 
        topic: topic || "general"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (apiError) {
      console.error('Error calling Gemini API:', apiError);
      
      // Fallback to using mock responses
      const mockResponse = "I apologize, but I'm currently unable to access my knowledge base due to connectivity issues. Please try again later for personalized financial advice. In the meantime, consider reviewing your budget allocation and ensuring you have an emergency fund covering 3-6 months of expenses.";
      
      return new Response(JSON.stringify({ 
        response: mockResponse, 
        topic: topic || "general",
        fallback: true
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
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
