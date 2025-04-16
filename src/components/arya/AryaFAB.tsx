
import { useState, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import AryaChat from './AryaChat';

const AryaFAB = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Add subtle entrance animation after mounting
  const fabClasses = cn(
    "fixed bottom-20 right-4 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg",
    "bg-[#3F51B5] hover:bg-[#3949AB] text-white transition-all duration-300 ease-in-out",
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3F51B5] focus:ring-offset-background",
    isMounted ? "scale-100 opacity-100" : "scale-90 opacity-0",
    isOpen ? "rotate-45" : "animate-pulse-subtle"
  );

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button 
        className={fabClasses}
        onClick={toggleChat}
        aria-label={isOpen ? "Close Arya assistant" : "Open Arya assistant"}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </button>

      <AryaChat isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default AryaFAB;
