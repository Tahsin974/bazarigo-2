import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

export default function useHomeLivingCategoryProducts() {
  const axiosPublic = useAxiosPublic();

  const { data, isPending } = useQuery({
    queryKey: ["home-living"],
    queryFn: async () => {
      const res = await axiosPublic.get("/home-living");
      return res.data.products;
    },
  });
  return { data, isPending };
}
