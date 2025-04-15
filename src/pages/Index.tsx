
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Add a small delay for the animation to be visible
    const redirectTimer = setTimeout(() => {
      // Redirect to the welcome page
      navigate('/welcome');
    }, 1500);
    
    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1E1E2F] to-[#3A3A5B]">
      <div className="relative animate-pulse-subtle">
        <img 
          src="/lovable-uploads/40ddd2e1-237b-497c-a073-39fe0af7b02a.png" 
          alt="FinSight Logo" 
          className="h-24 w-24 object-contain"
        />
        <span className="absolute inset-0 rounded-full bg-primary-gradient opacity-20 animate-pulse-glow"></span>
      </div>
      <h1 className="mt-6 text-3xl font-bold text-white animate-fade-in">FinSight</h1>
      <p className="mt-2 text-[#A0A0B8] animate-fade-in animate-stagger-1">Redirecting...</p>
    </div>
  );
};

export default Index;
