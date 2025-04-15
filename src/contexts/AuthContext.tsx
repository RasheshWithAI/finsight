import React, { createContext, useState, useContext, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name?: string;
  photoURL?: string;
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

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (password.length < 6) {
        throw new Error("Invalid credentials");
      }
      
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

  const signUp = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      
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
