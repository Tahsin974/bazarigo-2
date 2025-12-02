import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

export default function useSuperAdmin() {
  const axiosSecure = useAxiosSecure();
  const {
    data: bazarigo = {},
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["bazarigo"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/bazarigo");
      return res.data.admin;
    },
  });
  return { bazarigo, isPending, refetch };
}
