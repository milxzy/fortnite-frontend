
"use client";
import { useState } from "react";
//import { useRouter } from "next/router"
import { useAuth } from "@/utils/AuthContext";
import { useRouter } from "next/navigation";



const Login = () => {
  const { login, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 // const [error, setError] = useState("");
  const router = useRouter();


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error){
     // setError("Invalid email or password")
      console.error(error)
    }
  };

  const goToRegister = () => {
    router.push('/register')
  }

  return (
    <>

<form onSubmit={handleLogin} className="flex flex-col p-4 max-w-md mx-auto">
  <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="border p-2 rounded mb-2 text-black"
  />
  <input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="border p-2 rounded mb-2 text-black"
  />
  <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full h-12 mb-2">
    Login
  </button>
  {error && <p className="text-red-500">{error}</p>}
  
  <button onClick={goToRegister} className="bg-green-500 text-white p-2 rounded w-full h-12">
    Register
  </button>
</form>




    </>
    
  );
};

export default Login;