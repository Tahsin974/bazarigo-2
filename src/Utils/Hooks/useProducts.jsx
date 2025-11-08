import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useProducts() {
  const {
    data: products = [],
    isPending: loading,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/products");
      return res.data.products;
    },
  });
  return { products, loading, refetch };
}
