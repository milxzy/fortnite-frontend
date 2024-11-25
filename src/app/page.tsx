import Login from "./login/page";
import { AuthProvider } from "../utils/AuthContext";

export default function Home(  ) {
  return (
    <AuthProvider>


 <Login />
    </AuthProvider>
  );
}
