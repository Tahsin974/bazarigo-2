import { useContext } from "react";
import { AuthContext } from "../../Provider/AuthProvider";

export default function useAuth() {
  return useContext(AuthContext);
}
