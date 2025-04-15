
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

// Mock responses for different financial topics
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
  ]
};

// Function to get response from Arya (mock implementation)
export const getAryaResponse = async (
  userInput: string, 
  conversationHistory: Message[]
): Promise<string> => {
  // In a real implementation, this would call the Gemini API
  // For now, we'll simulate a response based on the user input
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const input = userInput.toLowerCase();
  
  // Determine which category the question falls into
  if (input.includes('budget') || input.includes('spend') || input.includes('expense')) {
    return getRandomResponse('budgeting');
  } else if (input.includes('invest') || input.includes('stock') || input.includes('market')) {
    return getRandomResponse('investing');
  } else if (input.includes('save') || input.includes('saving') || input.includes('emergency fund')) {
    return getRandomResponse('savings');
  } else if (input.includes('app') || input.includes('feature') || input.includes('how do i')) {
    return getRandomResponse('appFeatures');
  } else {
    // Default response
    return "I'm focused on helping with finances, investments, and app features. Could you ask something related to these topics?";
  }
};

// Helper function to get a random response from a category
const getRandomResponse = (category: 'budgeting' | 'investing' | 'savings' | 'appFeatures'): string => {
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
