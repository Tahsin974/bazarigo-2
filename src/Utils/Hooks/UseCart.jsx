import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

export default function useCart() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const {
    data: carts = [],
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/carts?email=${user.email}`);
      return res.data.carts;
    },
  });
  return { carts, isPending, refetch };
}
