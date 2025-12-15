import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

export default function useJustArrivedProducts() {
  const axiosPublic = useAxiosPublic();

  const { data, isPending } = useQuery({
    queryKey: ["just-arrived"],
    queryFn: async () => {
      const res = await axiosPublic.get("/just-arrived");
      return res.data.products;
    },
  });
  return { data, isPending };
}
