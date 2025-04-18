
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface SubscriptionCardProps {
  name: string;
  description: string;
  price: number;
  features: string[];
  isCurrentPlan?: boolean;
  onSelect: () => void;
}

export function SubscriptionCard({
  name,
  description,
  price,
  features,
  isCurrentPlan,
  onSelect
}: SubscriptionCardProps) {
  return (
    <Card className={`w-full max-w-sm transition-all duration-300 ${isCurrentPlan ? 'border-primary shadow-lg scale-105' : 'hover:border-primary/50'}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold">{name}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {isCurrentPlan && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Current Plan
            </Badge>
          )}
        </div>
        <div className="mt-4">
          <span className="text-4xl font-bold">${price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={onSelect}
          className={`w-full mt-6 py-2 px-4 rounded-lg transition-colors ${
            isCurrentPlan
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary/90'
          }`}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? 'Current Plan' : 'Upgrade Now'}
        </button>
      </CardContent>
    </Card>
  );
}
