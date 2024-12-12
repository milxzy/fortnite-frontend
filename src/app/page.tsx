// Add "use client" directive at the top to indicate client-side rendering
"use client"; 

import Login from "./login/page";
import { useAuth } from "../utils/AuthContext";
import Search from "./search/page";

export default function Home() {
  // You can safely call useAuth() here, as it's now a client-side component
  const { token } = useAuth();

  // Render login page if the user is not authenticated
  if (!token) {
    return <Login />;
  }

  // Render content for authenticated users
  return (
    <Search />
  );
}
