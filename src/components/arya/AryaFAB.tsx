
import { useState, useEffect } from 'react';
import { MessageSquare, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import AryaChat from './AryaChat';

const AryaFAB = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    
    // Occasionally show the premium sparkle to encourage upgrades
    const sparkleTimer = setTimeout(() => {
      setShowSparkle(true);
      
      // Hide sparkle after 10 seconds if not clicked
      setTimeout(() => {
        if (!isOpen) {
          setShowSparkle(false);
        }
      }, 10000);
    }, 30000);
    
    return () => {
      setIsMounted(false);
      clearTimeout(sparkleTimer);
    };
  }, [isOpen]);

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
    if (!isOpen) {
      setShowSparkle(false);
    }
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
        
        {/* Premium sparkle indicator */}
        {showSparkle && !isOpen && (
          <div className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
            <Sparkles className="h-3.5 w-3.5 text-black" />
          </div>
        )}
      </button>

      <AryaChat isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default AryaFAB;
