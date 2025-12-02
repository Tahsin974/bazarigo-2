import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

export default function useFlashSaleProducts() {
  const axiosPublic = useAxiosPublic();
  const {
    data: flashSaleProducts = {},
    isPending: loading,
    refetch,
  } = useQuery({
    queryKey: ["flashSaleProducts"],
    queryFn: async () => {
      const res = await axiosPublic.get("/flash-sale/active");
      return res.data;
    },
  });
  return { flashSaleProducts, loading, refetch };
}
