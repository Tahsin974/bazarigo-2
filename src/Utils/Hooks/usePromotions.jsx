import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

export default function usePromotions() {
  const axiosSecure = useAxiosSecure();
  const {
    data: promotions = [],
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["promotions"],
    queryFn: async () => {
      const res = await axiosSecure.get("/promotions");
      return res.data.promotions;
    },
  });
  return { promotions, isPending, refetch };
}
