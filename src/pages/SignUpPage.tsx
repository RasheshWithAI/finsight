
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    setIsLoading(true);
    try {
      // Pass the name if provided
      const userData = name ? { name } : undefined;
      await signUp(email, password, userData);
      
      // Navigate to dashboard (if email verification is disabled)
      // or show message (if email verification is enabled)
      navigate("/dashboard");
    } catch (error) {
      // Error is handled in the signUp function and toast is already shown
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1E1E2F] to-[#3A3A5B] px-4">
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center mb-4">
          <img src="/lovable-uploads/40ddd2e1-237b-497c-a073-39fe0af7b02a.png" alt="FinSight Logo" className="h-12 w-12 object-contain" />
        </div>
        <h1 className="text-3xl font-bold aura-gradient-text">FinSight</h1>
        <p className="mt-2 text-[#A0A0B8]">Create your account</p>
      </div>

      <Card className="w-full max-w-md bg-[#1A1D21] border-[#2C3036] shadow-xl">
        <form onSubmit={handleSubmit}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  type="text" 
                  placeholder="Name (Optional)" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="pl-10 bg-[#2C3036] border-gray-700 rounded-2xl" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  type="email" 
                  placeholder="Email Address" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="pl-10 bg-[#2C3036] border-gray-700 rounded-2xl" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="pl-10 bg-[#2C3036] border-gray-700 rounded-2xl" 
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-3 text-gray-400 hover:text-white" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Confirm Password" 
                  required 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  className="pl-10 bg-[#2C3036] border-gray-700 rounded-2xl" 
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-3 text-gray-400 hover:text-white" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full gradient-button-primary font-medium rounded-2xl"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="flex items-center justify-center w-full">
              <hr className="flex-grow border-gray-700" />
              <span className="px-3 text-sm text-gray-400">or</span>
              <hr className="flex-grow border-gray-700" />
            </div>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full bg-transparent border-[#2C3036] hover:bg-[#2C3036]/30 rounded-2xl"
              onClick={() => {
                toast.info("Google authentication coming soon");
              }}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign up with Google
            </Button>
            
            <div className="text-center text-sm">
              <span className="text-gray-400">Already have an account?</span>{" "}
              <Link to="/welcome" className="text-aura-purple hover:underline">
                Sign In
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignUpPage;
