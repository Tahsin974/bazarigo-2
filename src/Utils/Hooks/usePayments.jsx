import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

export default function usePayments() {
  const axiosSecure = useAxiosSecure();
  const {
    data: payments = [],
    isPending: loading,
    refetch,
  } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments");
      return res.data.payments;
    },
  });
  return { payments, loading, refetch };
}
