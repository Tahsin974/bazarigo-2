import useAxiosPublic from "./useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

export default function useAutomotiveCategoryProducts() {
  const axiosPublic = useAxiosPublic();

  const { data, isPending } = useQuery({
    queryKey: ["automotive-industrial"],
    queryFn: async () => {
      const res = await axiosPublic.get("/automotive-industrial");
      return res.data.products;
    },
  });

  return { data, isPending };
}
