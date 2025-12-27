import { createContext } from "react";
import useAxiosSecure from "../Utils/Hooks/useAxiosSecure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPublic from "../Utils/Hooks/useAxiosPublic";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["authenticated-user"],
    queryFn: async () => {
      const res = await axiosSecure.get("/user");

      return res.data.user;
    },
    retry: false,

    staleTime: 5 * 60 * 1000, // 5 মিনিট পর্যন্ত fresh data
    cacheTime: 15 * 60 * 1000, // cache 15 মিনিট রাখবে
    refetchOnWindowFocus: false, // window focus এ fetch না হবে
  });

  const refreshUser = () =>
    queryClient.invalidateQueries(["authenticated-user"]);
  const userLogOut = async () => {
    try {
      await axiosPublic.post("/logout"); // সার্ভার কল
      return true;
    } catch (error) {
      console.error("Logout failed:", error);
      return false;
    }
  };

  const authInfo = { user, isLoading, refreshUser, userLogOut };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
}

export { AuthContext };
