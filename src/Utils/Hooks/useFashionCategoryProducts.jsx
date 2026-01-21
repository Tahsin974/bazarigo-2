import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

export default function useFashionCategoryProducts() {
  const axiosPublic = useAxiosPublic();

  const { data, isPending } = useQuery({
    queryKey: ["fashion"],
    queryFn: async () => {
      const res = await axiosPublic.get("/fashion");
      return res.data.products;
    },
  });
  return { data, isPending };
}
