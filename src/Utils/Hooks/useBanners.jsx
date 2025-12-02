import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

export default function useBanners() {
  const axiosPublic = useAxiosPublic();
  const {
    data: banners = [],
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["banner"],
    queryFn: async () => {
      const res = await axiosPublic.get("/banner");
      return res.data.banners;
    },
  });
  return { banners, isPending, refetch };
}
