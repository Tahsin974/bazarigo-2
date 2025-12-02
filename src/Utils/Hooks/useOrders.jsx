import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

export default function useOrders() {
  const axiosSecure = useAxiosSecure();
  const {
    data: orders = [],
    isPending: loading,
    refetch,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/orders");
      return res.data.orders;
    },
  });
  return { orders, loading, refetch };
}
