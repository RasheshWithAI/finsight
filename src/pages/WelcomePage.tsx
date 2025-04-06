
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-aura-white to-aura-light-gray">
      <div className="mb-8 text-center animate-fade-in">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <CircleDollarSign className="h-20 w-20 text-aura-teal animate-pulse-subtle" />
            <span className="absolute inset-0 rounded-full bg-primary-gradient opacity-20 animate-pulse-glow"></span>
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2 aura-gradient-text">Aura Finance</h1>
        <p className="text-aura-medium-gray text-lg">Track, Manage, Grow Your Money</p>
      </div>

      <Card className="w-full max-w-md p-6 shadow-lg bg-white/80 backdrop-blur-sm border border-white animate-scale-in rounded-2xl">
        <div className="flex justify-center mb-8">
          <div className="flex bg-aura-light-gray rounded-lg overflow-hidden">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-4 py-2.5 flex items-center gap-2 transition-all duration-300 ${
                isLogin ? "bg-primary-gradient text-white shadow" : "text-aura-medium-gray"
              }`}
            >
              <LogIn size={18} />
              <span>Log In</span>
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-4 py-2.5 flex items-center gap-2 transition-all duration-300 ${
                !isLogin ? "bg-primary-gradient text-white shadow" : "text-aura-medium-gray"
              }`}
            >
              <UserPlus size={18} />
              <span>Sign Up</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="animate-slide-in-up">
              <Label htmlFor="name" className="text-aura-charcoal font-medium">Name</Label>
              <div className="relative mt-1">
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="aura-input"
                />
                <div className="absolute bottom-0 left-0 h-0.5 bg-primary-gradient transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-300"></div>
              </div>
            </div>
          )}

          <div className={isLogin ? "" : "animate-slide-in-up animate-stagger-1"}>
            <Label htmlFor="email" className="text-aura-charcoal font-medium">Email</Label>
            <div className="relative mt-1 group">
              <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-aura-medium-gray group-focus-within:text-aura-teal transition-colors" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="aura-input pl-9"
                required
              />
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary-gradient group-focus-within:w-full transition-all duration-300"></div>
            </div>
          </div>

          <div className={isLogin ? "" : "animate-slide-in-up animate-stagger-2"}>
            <Label htmlFor="password" className="text-aura-charcoal font-medium">Password</Label>
            <div className="relative mt-1 group">
              <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-aura-medium-gray group-focus-within:text-aura-teal transition-colors" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="aura-input pl-9"
                required
              />
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary-gradient group-focus-within:w-full transition-all duration-300"></div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-accent-gradient hover:bg-accent-gradient/90 shadow hover:shadow-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] rounded-xl"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Processing..."
            ) : (
              <>
                {isLogin ? "Log In" : "Create Account"}
                <ChevronRight size={18} className="animate-pulse-subtle" />
              </>
            )}
          </Button>
          
          {isLogin && (
            <div className="mt-4 text-center">
              <a href="#" className="text-aura-teal text-sm hover:underline transition-colors hover:text-aura-sea-green">
                Forgot your password?
              </a>
            </div>
          )}
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-aura-medium-gray text-sm hover:text-aura-teal transition-colors"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Log in"}
          </button>
        </div>
      </Card>

      <p className="mt-8 text-xs text-aura-soft-gray text-center max-w-md">
        By continuing, you agree to our Terms of Service and Privacy Policy.
        This demo app is for illustration purposes only.
      </p>
    </div>
  );
};

export default WelcomePage;
