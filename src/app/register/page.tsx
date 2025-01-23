"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/utils/AuthContext";
import { useRouter } from "next/navigation";

const Register = () => {
  const { register, error: authError, token } = useAuth(); // Assuming `token` is part of the context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("regular"); // Default to 'regular' user
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("")
  const [error, setError] = useState<string | null>(null);

  const router = useRouter()

    useEffect(() => {
    if (token) {
      router.push("/search");
    }
  }, [token, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      console.log(apiUrl)

      if (!apiUrl) {
        throw new Error("API base URL is not defined");
      }

      if (role === "admin") {
        setRole('regular')
        await register(email, password, username, role)

        const response = await fetch(`${apiUrl}/api/FortnitePlayers/actions/request-admin-access`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            message: "I need admin access for managing Fortnite players.",
          }),
        });
        if (!response.ok) {
          throw new Error(`Failed to send admin access request: ${response.status}`);
        }

        setMessage("Admin access request sent successfully!");
        return; // Avoid proceeding to `register` call
      } if (role !== "admin") {
        register(email, password, username, role)
      }
        



      // Register the user in your auth system
      
      setMessage("Registration successful!");
      setError(null); // Clear any previous errors
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        console.error("Error during registration:", err.message);
      } else {
        setError("An unexpected error occurred.");
        console.error("Unknown error:", err);
      }
    }
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col p-4 max-w-md mx-auto">

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 rounded mb-2 text-black"
        required
      />
      <input

        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded mb-2 text-black"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded mb-2 text-black"
        required
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border p-2 rounded mb-2 text-black"
      >
        <option value="regular">Regular User</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Register
      </button>
      {/* Display error messages */}
      {authError && <p className="text-red-500">{authError}</p>}
      {error && <p className="text-red-500">{error}</p>}
      {/* Display success messages */}
      {message && <p className="text-green-500">{message}</p>}
    </form>
  );
};

export default Register;
