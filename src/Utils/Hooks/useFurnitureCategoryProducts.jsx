import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

export default function useFurnitureCategoryProducts() {
  const axiosPublic = useAxiosPublic();

  const { data, isPending } = useQuery({
    queryKey: ["furniture-home-decor"],
    queryFn: async () => {
      const res = await axiosPublic.get("/furniture-home-decor");
      return res.data.products;
    },
  });
  return { data, isPending };
}
