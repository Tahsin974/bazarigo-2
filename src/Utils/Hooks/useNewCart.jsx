import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useNewCart() {
  const {
    data: carts = [],
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await axios.get(
        "http://localhost:3000/carts?email=tahsinislam974@gmail.com"
      );
      return res.data.carts;
    },
  });
  return { carts, isPending, refetch };
}
