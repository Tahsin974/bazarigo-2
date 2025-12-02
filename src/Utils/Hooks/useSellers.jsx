import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosPublic";

export default function useSellers() {
  const axiosSecure = useAxiosSecure();
  const {
    data: sellers = [],
    isPending: loading,
    refetch,
  } = useQuery({
    queryKey: ["sellers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/sellers");
      return res.data.sellers;
    },
  });
  return { sellers, loading, refetch };
}
