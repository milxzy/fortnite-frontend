"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { useRouter } from "next/navigation";

interface AuthContextType {
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter();
      

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
            document.cookie = `token=${token}; path=/; secure; httponly; samesite=strict`;
            router.push('/search')
        } catch (error){
            console.error(error);
            setError("Invalid email or password")
        }
    };
    const logout = () => {
        setToken(null);
        document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
        router.push('/login')
    };
    return (
        <AuthContext.Provider value={{ token, login, logout, error }}>
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