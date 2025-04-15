
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Apple, Twitter } from "lucide-react";

const WelcomePage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(email, password);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#1E1E2F] to-[#3A3A5B]">
      {/* Logo - Small and subtle at the top */}
      <div className="mb-12 mt-8">
        <img 
          src="/lovable-uploads/40ddd2e1-237b-497c-a073-39fe0af7b02a.png" 
          alt="FinSight Logo" 
          className="h-10 w-10 object-contain"
        />
      </div>
      
      {/* Title */}
      <h1 className="text-3xl font-medium text-white mb-10">Welcome Back</h1>
      
      <div className="w-full max-w-sm">
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full h-12 bg-[#3A3A5B] border-none rounded-xl text-white placeholder:text-[#A0A0B8]"
              required
            />
          </div>
          
          {/* Password Input */}
          <div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full h-12 bg-[#3A3A5B] border-none rounded-xl text-white placeholder:text-[#A0A0B8]"
              required
            />
          </div>
          
          {/* Sign In Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-[#EAEAEF] hover:bg-[#FFFFFF] text-[#1E1E2F] font-medium rounded-xl"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        
        {/* Separator */}
        <div className="flex items-center my-8">
          <div className="flex-grow h-px bg-[#A0A0B8]"></div>
          <span className="px-4 text-sm text-[#A0A0B8]">or</span>
          <div className="flex-grow h-px bg-[#A0A0B8]"></div>
        </div>
        
        {/* Social Login Buttons */}
        <div className="flex justify-center space-x-6">
          {/* Google Button */}
          <button className="w-12 h-12 rounded-xl bg-[#3A3A5B] flex items-center justify-center text-white">
            <span className="text-xl font-medium">G</span>
          </button>
          
          {/* Apple Button */}
          <button className="w-12 h-12 rounded-xl bg-[#3A3A5B] flex items-center justify-center text-white">
            <Apple size={22} />
          </button>
          
          {/* Twitter Button */}
          <button className="w-12 h-12 rounded-xl bg-[#3A3A5B] flex items-center justify-center text-white">
            <Twitter size={22} />
          </button>
        </div>
        
        {/* Footer Text */}
        <div className="text-center text-[#A0A0B8] text-xs mt-8">
          By continuing, you agree to our{" "}
          <a href="#" className="text-[#A0A0B8] hover:text-white underline">Terms</a>
          {" "}and{" "}
          <a href="#" className="text-[#A0A0B8] hover:text-white underline">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
