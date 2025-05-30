
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

// Enhanced mock responses for different financial topics with premium-style insights
const mockResponses = {
  budgeting: [
    "Based on your spending patterns, I recommend allocating 50% of your income to necessities, 30% to wants, and 20% to savings.",
    "I notice your food expenses are 15% higher than last month. Consider meal planning to reduce costs.",
    "Creating a zero-based budget could help you account for every dollar of your income.",
    "Have you considered using the 50/30/20 rule for budgeting? It's a simple framework to allocate your income."
  ],
  investing: [
    "Diversification is key to reducing investment risk. Consider spreading your investments across different asset classes.",
    "Dollar-cost averaging can help reduce the impact of volatility on your investment portfolio.",
    "Based on your conservative risk profile, you might want to consider bond ETFs or dividend-paying stocks.",
    "IMPORTANT DISCLAIMER: This information is for educational purposes only and not financial advice. Always consult with a financial advisor before making investment decisions."
  ],
  savings: [
    "Setting up automatic transfers to your savings account can help you build your emergency fund faster.",
    "Great progress! Your savings rate improved to 22% this month, up from 18% last month.",
    "An emergency fund covering 3-6 months of expenses is recommended before investing aggressively.",
    "Consider high-yield savings accounts for your emergency fund to beat inflation."
  ],
  appFeatures: [
    "You can set up budget alerts in the Finance section of the app.",
    "To add stocks to your watchlist, visit the Market section and tap the bookmark icon.",
    "The Insights section provides AI-powered recommendations based on your financial data.",
    "You can customize your notifications in the Profile section under Preferences."
  ],
  // New premium-style advanced financial analysis responses
  advancedAnalysis: [
    "I've analyzed your investment portfolio and found that your sector allocation is heavily weighted towards technology (42%). Consider diversifying to reduce sector-specific risk.",
    "Your current debt-to-income ratio is 28%, which is within the recommended range. You have capacity to take on additional strategic debt if needed for wealth building.",
    "Based on your retirement goals and current savings rate, you're on track to reach your target of $1.2M by age 62. Consider increasing contributions by 2% to provide an additional safety margin.",
    "I've identified that your emergency fund covers 2.4 months of expenses. This is below the recommended 3-6 months. Prioritizing this could be beneficial before increasing investment allocations."
  ],
  taxStrategies: [
    "Based on your investment activity, you could benefit from tax-loss harvesting. Consider selling positions with unrealized losses to offset capital gains, potentially saving up to $1,500 in taxes.",
    "Your current tax efficiency score is 82/100. Consider moving high-yield investments to tax-advantaged accounts to improve this score.",
    "You might qualify for the Saver's Credit based on your income and retirement contributions. This could reduce your tax liability by up to $1,000.",
    "I notice you're not currently maximizing your HSA contributions. This triple-tax-advantaged account could save you approximately $840 in taxes this year."
  ],
  marketInsights: [
    "Recent Fed statements suggest a shift toward a more accommodative monetary policy, which historically has supported equity valuations, particularly in growth sectors.",
    "The yield curve is currently inverted at -0.42%, which has historically preceded economic slowdowns. Consider increasing allocation to defensive sectors like utilities and consumer staples.",
    "Corporate earnings for Q1 2025 have exceeded expectations by 4.2% on average, with technology and healthcare showing the strongest performance.",
    "Current market volatility (VIX at 22.4) is slightly elevated compared to historical averages. This may present opportunities for strategic entry points in quality stocks."
  ]
};

// Function to get response from Arya using Google AI API
export const getAryaResponse = async (
  userInput: string, 
  conversationHistory: Message[]
): Promise<string> => {
  // Lower the fallback chance significantly - try to use the API most of the time
  if (Math.random() < 0.01) { // Only 1% chance to use mock responses
    await new Promise(resolve => setTimeout(resolve, 300)); // Quick response time
    const input = userInput.toLowerCase();
    
    // Enhanced categorization of questions for premium-style responses
    if (input.includes('portfolio') || input.includes('allocation') || input.includes('risk analysis') || input.includes('retirement') || input.includes('debt')) {
      return getRandomResponse('advancedAnalysis');
    } else if (input.includes('tax') || input.includes('harvest') || input.includes('deduction') || input.includes('credit')) {
      return getRandomResponse('taxStrategies');
    } else if (input.includes('fed') || input.includes('market') || input.includes('earnings') || input.includes('volatility') || input.includes('trend')) {
      return getRandomResponse('marketInsights');
    } else if (input.includes('budget') || input.includes('spend') || input.includes('expense')) {
      return getRandomResponse('budgeting');
    } else if (input.includes('invest') || input.includes('stock') || input.includes('etf')) {
      return getRandomResponse('investing');
    } else if (input.includes('save') || input.includes('saving') || input.includes('emergency fund')) {
      return getRandomResponse('savings');
    } else if (input.includes('app') || input.includes('feature') || input.includes('how do i')) {
      return getRandomResponse('appFeatures');
    } else {
      // Default mock response
      return "I'm focused on helping with finances, investments, tax strategies, and market insights. Could you ask something related to these topics?";
    }
  }

  try {
    console.log('Preparing to call Arya Assistant API...');
    
    // Format conversation history for API
    const formattedMessages = conversationHistory.slice(-5).map(msg => ({
      role: msg.isUser ? "user" : "model",
      content: msg.content
    }));

    // Add the latest user input
    formattedMessages.push({
      role: "user",
      content: userInput
    });

    // Determine topic based on user input
    let topic = determineTopic(userInput);
    console.log(`Determined topic: ${topic} for input: ${userInput.substring(0, 30)}...`);

    console.log(`Calling arya-assistant with topic: ${topic} and ${formattedMessages.length} messages`);

    // Call the Supabase Edge Function that interfaces with Google AI
    const { data, error } = await supabase.functions.invoke('arya-assistant', {
      body: { 
        messages: formattedMessages,
        topic 
      }
    });

    console.log('Response received from arya-assistant function:', data ? Object.keys(data).join(', ') : 'No data');

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(error.message || "Failed to get response from assistant");
    }

    if (data.fallback) {
      console.warn('Received fallback response from API');
      toast.warning("Using AI fallback response due to connectivity issues.", {
        description: "Some features may be limited."
      });
    }

    if (!data.response) {
      console.error('Missing response in API data:', data);
      throw new Error("Missing response from assistant");
    }

    return data.response;

  } catch (error) {
    console.error('Error getting AI response:', error);
    toast.error("Failed to get AI response. Falling back to generic advice.");
    
    // Determine the best fallback response based on the user's input
    return generateFallbackResponse(userInput);
  }
};

// Helper function to determine topic from user input
function determineTopic(userInput: string): string {
  const input = userInput.toLowerCase();
  
  if (input.includes('budget') || input.includes('spend') || input.includes('expense')) {
    return "budgeting";
  } else if (input.includes('invest') || input.includes('stock') || input.includes('etf') || input.includes('portfolio')) {
    return "investing";
  } else if (input.includes('save') || input.includes('saving') || input.includes('emergency fund')) {
    return "savings";
  } else if (input.includes('market') || input.includes('index') || input.includes('trend')) {
    return "market";
  } else if (input.includes('tax') || input.includes('deduction')) {
    return "tax";
  }
  
  return "general";
}

// Generate context-aware fallback responses based on user input
function generateFallbackResponse(userInput: string): string {
  const input = userInput.toLowerCase();
  
  if (input.includes('portfolio') || input.includes('allocation')) {
    return "I notice you're asking about portfolio allocation. A well-diversified portfolio typically includes a mix of stocks, bonds, and other assets based on your risk tolerance and time horizon. For example, a moderate risk profile might include 60% stocks and 40% bonds. This is educational content, not personalized financial advice.";
  } else if (input.includes('tax')) {
    return "Regarding tax strategies, consider tax-advantaged accounts like 401(k)s and IRAs to reduce your taxable income. Tax-loss harvesting can also offset capital gains. Remember that this is general educational content, not personalized tax advice.";
  } else if (input.includes('market')) {
    return "Market analysis suggests diversification across sectors is crucial. Consider dollar-cost averaging to reduce timing risk when investing. Economic indicators like interest rates and inflation trends can help inform investment decisions. This is educational content, not personalized investment advice.";
  } else if (input.includes('budget')) {
    return "For effective budgeting, consider the 50/30/20 rule: allocate 50% of income to necessities, 30% to discretionary spending, and 20% to savings and debt repayment. Tracking expenses can help identify areas to optimize. This is educational content, not personalized financial advice.";
  } else if (input.includes('invest')) {
    return "For investing strategies, consider your time horizon and risk tolerance. Long-term investors might favor low-cost index funds, while those seeking income might consider dividend stocks or bonds. Always diversify to manage risk. This is educational content, not personalized investment advice.";
  } else if (input.includes('save')) {
    return "For savings goals, aim to build an emergency fund covering 3-6 months of expenses in a high-yield savings account. Once established, consider additional savings for specific goals like home purchase or retirement. This is educational content, not personalized financial advice.";
  } else {
    return "I'm here to help with financial topics including budgeting, investing, saving, taxes, and market insights. Please ask a question in these areas, and I'll provide educational information to assist you. Note that all information is educational and not personalized financial advice.";
  }
}

// Helper function to get a random response from a category
const getRandomResponse = (category: 'budgeting' | 'investing' | 'savings' | 'appFeatures' | 'advancedAnalysis' | 'taxStrategies' | 'marketInsights'): string => {
  const responses = mockResponses[category];
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
};

// Function to send notification from Arya
export const sendAryaNotification = (
  message: string,
  type: 'info' | 'success' | 'warning' = 'info'
) => {
  toast(message, {
    description: "Message from Arya",
    action: {
      label: "View",
      onClick: () => {
        // This would normally open the Arya chat
        console.log("Opening Arya chat from notification");
      }
    }
  });
};

// Function to detect premium topics and suggest upgrade
export const isPremiumTopic = (userInput: string): boolean => {
  const premiumKeywords = [
    'portfolio analysis', 
    'tax strategy', 
    'retirement planning',
    'detailed forecast',
    'sector allocation',
    'risk analysis',
    'yield curve',
    'advanced metrics',
    'tax-loss harvesting',
    'correlation analysis'
  ];
  
  return premiumKeywords.some(keyword => userInput.toLowerCase().includes(keyword));
};
