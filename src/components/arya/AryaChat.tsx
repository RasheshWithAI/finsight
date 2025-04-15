
import { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AryaMessage from './AryaMessage';
import { getAryaResponse, isPremiumTopic } from '@/utils/aryaUtils';
import { AnimatePresence, motion } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isPremium?: boolean;
}

interface AryaChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const AryaChat = ({ isOpen, onClose }: AryaChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showPremiumBadge, setShowPremiumBadge] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Add initial greeting when chat is first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialGreeting: Message = {
        id: crypto.randomUUID(),
        content: "Hi, I'm Arya! How can I assist with your finances or investments today?",
        isUser: false,
        timestamp: new Date()
      };
      setMessages([initialGreeting]);
    }
    
    // Focus input when chat is opened
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!input.trim()) return;
    
    // Check if message contains premium topics
    const isRequestingPremium = isPremiumTopic(input);
    
    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: input,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Get Arya's response
      const response = await getAryaResponse(input, messages);
      
      // Add Arya's response
      const aryaMessage: Message = {
        id: crypto.randomUUID(),
        content: response,
        isUser: false,
        timestamp: new Date(),
        isPremium: isRequestingPremium
      };
      
      setMessages(prev => [...prev, aryaMessage]);
      
      // Show premium badge if premium topic detected
      if (isRequestingPremium) {
        setShowPremiumBadge(true);
        
        // Add premium upsell message after a short delay
        setTimeout(() => {
          const premiumMessage: Message = {
            id: crypto.randomUUID(),
            content: "I see you're interested in advanced financial insights! Upgrade to Arya Pro for access to detailed portfolio analysis, tax optimization strategies, and personalized financial planning.",
            isUser: false,
            timestamp: new Date(),
            isPremium: true
          };
          
          setMessages(prev => [...prev, premiumMessage]);
        }, 2000);
      }
    } catch (error) {
      console.error('Error getting response from Arya:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: "I'm having trouble processing that request. Please try again later.",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-0 right-0 z-40 w-full sm:w-96 h-[70vh] sm:h-[600px] sm:bottom-20 sm:right-4 
                    flex flex-col rounded-t-xl sm:rounded-xl shadow-2xl bg-[#1A1D21] border border-gray-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-[#3F51B5] flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <h3 className="font-medium text-white">Arya</h3>
                  {showPremiumBadge && (
                    <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold flex items-center">
                      <Sparkles className="h-3 w-3 mr-0.5" />
                      PRO
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">Financial Assistant</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <AryaMessage
                key={message.id}
                message={message.content}
                isUser={message.isUser}
                timestamp={message.timestamp}
                isPremium={message.isPremium}
              />
            ))}
            
            {isTyping && (
              <div className="flex items-center space-x-2 p-3 max-w-[80%] rounded-lg bg-[#3F51B5] text-white">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800">
            <div className="flex items-center space-x-2">
              <Input
                ref={inputRef}
                className="flex-1 bg-[#2C3036] border-gray-700 text-white placeholder-gray-400"
                placeholder="Ask Arya about finances or investments..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!input.trim() || isTyping}
                className={cn(
                  "bg-[#3F51B5] hover:bg-[#3949AB] text-white",
                  (!input.trim() || isTyping) && "opacity-50 cursor-not-allowed"
                )}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="mt-2 text-xs text-gray-500 text-center">
              Arya provides general financial information, not personalized financial advice.
            </p>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AryaChat;

// Import MessageSquare icon at the top
import { MessageSquare } from 'lucide-react';
