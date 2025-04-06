
import React, { createContext, useState, useContext, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in (from localStorage in this demo)
  useEffect(() => {
    const storedUser = localStorage.getItem("financeAppUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("financeAppUser");
      }
    }
    setIsLoading(false);
  }, []);

  // Mock login function (replace with actual auth in production)
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, simple validation
      if (password.length < 6) {
        throw new Error("Invalid credentials");
      }
      
      // Create mock user
      const newUser = {
        id: crypto.randomUUID(),
        email,
        name: email.split("@")[0]
      };
      
      setUser(newUser);
      localStorage.setItem("financeAppUser", JSON.stringify(newUser));
      
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock signup function (replace with actual auth in production)
  const signUp = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, simple validation
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      
      // Create mock user
      const newUser = {
        id: crypto.randomUUID(),
        email,
        name: name || email.split("@")[0]
      };
      
      setUser(newUser);
      localStorage.setItem("financeAppUser", JSON.stringify(newUser));
      
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("financeAppUser");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signUp,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
