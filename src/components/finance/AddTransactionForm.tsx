
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
}

interface AddTransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
}

// Define categories and their types
const CATEGORIES = [
  { name: "Income", type: "income" as const },
  { name: "Utilities", type: "expense" as const },
  { name: "Food & Dining", type: "expense" as const },
  { name: "Education", type: "expense" as const },
  { name: "Transportation", type: "expense" as const },
  { name: "Gym memberships", type: "expense" as const },
  { name: "Debt", type: "expense" as const },
  { name: "Maintenance and repairs", type: "expense" as const },
  { name: "Others", type: "expense" as const },
];

const AddTransactionForm = ({ isOpen, onClose, onSave }: AddTransactionFormProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredCategories = CATEGORIES.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    if (!description || !category || !amount || isNaN(parseFloat(amount))) {
      return;
    }

    const selectedCategory = CATEGORIES.find(cat => cat.name === category);
    if (!selectedCategory) return;

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: format(date, "yyyy-MM-dd"),
      description,
      category,
      amount: parseFloat(amount),
      type: selectedCategory.type, // Now correctly typed as "income" | "expense"
    };

    onSave(newTransaction);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setDate(new Date());
    setDescription("");
    setCategory("");
    setAmount("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-aura-primary-text">Add Transaction</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Date Picker */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="transaction-date" className="text-right">
              Date
            </Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-gray-700"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {/* Description */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3 bg-gray-700 border-gray-600"
            />
          </div>
          
          {/* Category Selection */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <div className="col-span-3">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <div className="sticky top-0 p-2 bg-gray-700 z-10">
                    <div className="flex items-center rounded-md bg-gray-600 px-3">
                      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                      <Input
                        placeholder="Search categories..."
                        className="h-9 bg-transparent border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className={cn("max-h-[200px] overflow-y-auto")}>
                    {filteredCategories.map((cat) => (
                      <SelectItem key={cat.name} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </div>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Amount */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3 bg-gray-700 border-gray-600"
              step="0.01"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="bg-gray-700 hover:bg-gray-600">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-accent-gradient hover:brightness-105"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionForm;
