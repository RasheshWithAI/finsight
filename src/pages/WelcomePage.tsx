
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ChevronRight, CircleDollarSign, Mail, Lock, UserPlus, LogIn } from "lucide-react";

const WelcomePage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast.success("Login successful!");
      } else {
        await signUp(email, password, name);
        toast.success("Account created successfully!");
      }
      navigate("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-finance-background to-gray-50">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <CircleDollarSign className="h-16 w-16 text-finance-primary" />
        </div>
        <h1 className="text-3xl font-bold text-finance-primary mb-2">FinanceGrowth</h1>
        <p className="text-finance-text-secondary text-lg">Track, Manage, Grow Your Money</p>
      </div>

      <Card className="w-full max-w-md p-6 shadow-md">
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-100 rounded-lg">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                isLogin ? "bg-finance-primary text-white" : "text-finance-text-secondary"
              }`}
            >
              <LogIn size={18} />
              <span>Log In</span>
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                !isLogin ? "bg-finance-primary text-white" : "text-finance-text-secondary"
              }`}
            >
              <UserPlus size={18} />
              <span>Sign Up</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="mt-1"
              />
            </div>
          )}

          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <Label htmlFor="password">Password</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-finance-primary hover:bg-finance-secondary flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Processing..."
            ) : (
              <>
                {isLogin ? "Log In" : "Create Account"}
                <ChevronRight size={18} />
              </>
            )}
          </Button>
          
          {isLogin && (
            <div className="mt-4 text-center">
              <a href="#" className="text-finance-secondary text-sm hover:underline">
                Forgot your password?
              </a>
            </div>
          )}
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-finance-text-secondary text-sm hover:text-finance-primary"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Log in"}
          </button>
        </div>
      </Card>

      <p className="mt-8 text-xs text-finance-text-tertiary text-center max-w-md">
        By continuing, you agree to our Terms of Service and Privacy Policy.
        This demo app is for illustration purposes only.
      </p>
    </div>
  );
};

export default WelcomePage;
