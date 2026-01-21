import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

export default function useGroceriesCategoryProducts() {
  const axiosPublic = useAxiosPublic();

  const { data, isPending } = useQuery({
    queryKey: ["grocery-food-items"],
    queryFn: async () => {
      const res = await axiosPublic.get("/grocery-food-items");
      return res.data.products;
    },
  });
  return { data, isPending };
}
