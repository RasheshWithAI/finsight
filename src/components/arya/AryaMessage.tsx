
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AryaMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

const AryaMessage = ({ message, isUser, timestamp }: AryaMessageProps) => {
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
            : "bg-[#3F51B5] text-white"
        )}
      >
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
