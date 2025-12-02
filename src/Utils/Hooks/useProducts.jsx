import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

export default function useProducts() {
  const axiosPublic = useAxiosPublic();
  const {
    data: products = [],
    isPending: loading,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axiosPublic.get("/products");
      return res.data.products;
    },
  });
  return { products, loading, refetch };
}
