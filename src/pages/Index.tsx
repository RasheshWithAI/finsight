
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleDollarSign } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Add a small delay for the animation to be visible
    const redirectTimer = setTimeout(() => {
      // Redirect to the welcome page (or dashboard if user is already logged in)
      navigate('/');
    }, 1500);
    
    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-aura-white to-aura-light-gray">
      <div className="relative animate-pulse-subtle">
        <CircleDollarSign className="h-20 w-20 text-aura-teal" />
        <span className="absolute inset-0 rounded-full bg-primary-gradient opacity-20 animate-pulse-glow"></span>
      </div>
      <h1 className="mt-6 text-3xl font-bold aura-gradient-text animate-fade-in">Aura Finance</h1>
      <p className="mt-2 text-aura-medium-gray animate-fade-in animate-stagger-1">Redirecting...</p>
    </div>
  );
};

export default Index;
