import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

export default function useHealthCategoryProducts() {
  const axiosPublic = useAxiosPublic();

  const { data, isPending } = useQuery({
    queryKey: ["health-beauty"],
    queryFn: async () => {
      const res = await axiosPublic.get("/health-beauty");
      return res.data.products;
    },
  });
  return { data, isPending };
}
