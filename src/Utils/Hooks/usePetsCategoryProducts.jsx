import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

export default function usePetsCategoryProducts() {
  const axiosPublic = useAxiosPublic();

  const { data, isPending } = useQuery({
    queryKey: ["pets-pet-care"],
    queryFn: async () => {
      const res = await axiosPublic.get("/pets-pet-care");
      return res.data.products;
    },
  });
  return { data, isPending };
}
