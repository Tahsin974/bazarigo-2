import React from "react";
import useAxiosPublic from "./useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

export default function useElectronicsCategoryProducts() {
  const axiosPublic = useAxiosPublic();

  const { data, isPending } = useQuery({
    queryKey: ["electronics"],
    queryFn: async () => {
      const res = await axiosPublic.get("/electronics");
      return res.data.products;
    },
  });
  return { data, isPending };
}
