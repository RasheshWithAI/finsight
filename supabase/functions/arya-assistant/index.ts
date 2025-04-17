
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
        message: 'The Google API key is not configured properly',
        fallback: true
      }), {
        status: 200, // Using 200 to prevent client-side errors
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Google API Key is configured:', GOOGLE_API_KEY.substring(0, 3) + '...');

    const { messages, topic } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      console.error('Invalid or missing messages array in request');
      return new Response(JSON.stringify({ 
        error: 'Invalid request format', 
        message: 'Messages must be provided as an array'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    console.log(`Received ${messages.length} messages with topic: ${topic || 'general'}`);
    
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

    console.log('System prompt:', systemPrompt.substring(0, 100) + '...');

    try {
      // Prepare the formatted messages for Gemini API
      const formattedMessages = [
        { role: "user", parts: [{ text: systemPrompt }] }
      ];
      
      // Add user-bot conversation history
      messages.forEach(msg => {
        formattedMessages.push({
          role: msg.role === "model" ? "model" : "user",
          parts: [{ text: msg.content }]
        });
      });
      
      // Call the Google AI API with additional logging
      const apiUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';
      console.log(`Calling Gemini API at: ${apiUrl}`);
      
      const payload = {
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
      
      const responseText = await response.text();
      console.log('Gemini API raw response:', responseText.substring(0, 200) + '...');
      
      if (!response.ok) {
        console.error('Gemini API error:', response.status, responseText);
        throw new Error(`Gemini API error: ${response.status} ${responseText}`);
      }
      
      // Process the API response
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing Gemini API response:', parseError);
        throw new Error('Failed to parse Gemini API response');
      }
      
      if (data.error) {
        console.error('Error in Gemini API response:', data.error);
        throw new Error(data.error.message || "Error from Google API");
      }
      
      let responseContent = "";
      
      if (data.candidates && data.candidates.length > 0 && 
          data.candidates[0].content && 
          data.candidates[0].content.parts && 
          data.candidates[0].content.parts.length > 0) {
        responseContent = data.candidates[0].content.parts[0].text;
        console.log('Successfully extracted response text');
      } else {
        console.warn('Unexpected response format from Gemini API:', JSON.stringify(data).substring(0, 300));
        throw new Error('Unexpected response format from Gemini API');
      }

      console.log('Gemini API response received successfully');

      return new Response(JSON.stringify({ 
        response: responseContent, 
        topic: topic || "general"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (apiError) {
      console.error('Error calling Gemini API:', apiError);
      
      // Fallback to using mock responses
      const mockResponse = "I apologize for the connectivity issue. Based on financial best practices, I recommend allocating 50-30-20 of your income to needs, wants, and savings respectively. Consider automating your savings to build an emergency fund covering 3-6 months of expenses. Note: This is educational content, not personalized financial advice.";
      
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
      fallback: true,
      response: "I apologize for the technical difficulty. As a financial assistant, I recommend reviewing your budget regularly and ensuring you have an emergency fund of 3-6 months of expenses. This is educational content, not financial advice."
    }), {
      status: 200, // Using 200 to prevent client-side errors
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
