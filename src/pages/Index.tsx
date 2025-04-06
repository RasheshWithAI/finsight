
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the welcome page (or dashboard if user is already logged in)
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-finance-background">
      <div className="animate-pulse">
        <p className="text-finance-primary">Redirecting...</p>
      </div>
    </div>
  );
};

export default Index;
