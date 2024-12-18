"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthContextType {
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    error: string | null;
      register: (email: string, password: string, username: string, role: string) => Promise<void>;
}



const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);
      

    const login = async (email: string, password: string) => {
        try{
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            if(!apiUrl) {
                throw new Error("Api base url is not defined")
            }
            const response = await fetch(`${apiUrl}/Auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({ email, password }),
            })
            if(!response.ok){
                throw new Error("Login failed")
            }
            const { token } = await response.json();
            setToken(token)
            localStorage.setItem("authToken", token);
            console.log(token)
            document.cookie = `token=${token}; path=/; secure; httponly; samesite=strict`;
            router.push('/search')
        } catch (error){
            console.error(error);
            setError("Invalid email or password")
        }
    };

    const register = async (email: string, password: string, username: string, role: string) => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiUrl) {
      throw new Error("API base URL is not defined");
    }

    // Log the data for debugging
    console.log("Registering with data:", { username, email, password, role });

    // Send the POST request
    const response = await fetch(`${apiUrl}/Auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, role }),
    });

    // Log the raw response for debugging
    const responseText = await response.text();
    console.log("Raw response from server:", responseText); // Log the raw response text

    // Check if response is not OK
    if (!response.ok) {
      // If response isn't OK, show the raw response text for more details
      throw new Error(`Registration failed. Server responded with: ${responseText}`);
    }

    // Try parsing the JSON if the response is successful
    const data = JSON.parse(responseText);
    console.log("Registration successful, token:", data.token);

    // Store the token in localStorage and set it as a cookie
    setToken(data.token);
    localStorage.setItem("authToken", data.token);
    document.cookie = `token=${data.token}; path=/; secure; httponly; samesite=strict`;

    // Redirect the user based on their role
    if (role === "admin") {
      router.push("/search");
    } else {
      router.push("/search");
    }
  } catch (error) {
    console.error("Error in registration:", error);
    setError("Registration failed. Please try again.");
  }
};

    
    const logout = () => {
        setToken(null);
        localStorage.removeItem("authToken");
        document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
        router.push('/login')
    };
    return (
        <AuthContext.Provider value={{ token, login, logout, register, error }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context;
}