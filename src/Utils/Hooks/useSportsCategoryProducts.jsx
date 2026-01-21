import React from "react";
import useAxiosPublic from "./useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

export default function useSportsCategoryProducts() {
  const axiosPublic = useAxiosPublic();

  const { data, isPending } = useQuery({
    queryKey: ["sports-outdoors"],
    queryFn: async () => {
      const res = await axiosPublic.get("/sports-outdoors");
      return res.data.products;
    },
  });
  return { data, isPending };
}
