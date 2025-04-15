
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface AryaMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  isPremium?: boolean;
}

const AryaMessage = ({ message, isUser, timestamp, isPremium = false }: AryaMessageProps) => {
  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={messageVariants}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div 
        className={cn(
          "p-3 rounded-lg max-w-[80%]",
          isUser 
            ? "bg-[#3A3F4B] text-white" 
            : isPremium 
              ? "bg-gradient-to-r from-[#5B4EBD] to-[#3F51B5] text-white shadow-lg" 
              : "bg-[#3F51B5] text-white"
        )}
      >
        {isPremium && !isUser && (
          <div className="flex items-center mb-1">
            <Sparkles className="h-3 w-3 text-amber-300 mr-1" />
            <span className="text-xs font-semibold text-amber-300">Premium Insight</span>
          </div>
        )}
        <p className="whitespace-pre-wrap">{message}</p>
        <p className="text-xs mt-1 opacity-70">
          {formatMessageTime(timestamp)}
        </p>
      </div>
    </motion.div>
  );
};

const formatMessageTime = (timestamp: Date) => {
  return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default AryaMessage;
