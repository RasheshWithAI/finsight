
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { PricingDemo } from "./PricingDemo";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingModal = ({ isOpen, onClose }: PricingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogOverlay className="backdrop-blur-sm" />
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto bg-card p-0">
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 rounded-sm p-1 bg-card-foreground/10 hover:bg-card-foreground/20 transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>
        <PricingDemo />
      </DialogContent>
    </Dialog>
  );
};
