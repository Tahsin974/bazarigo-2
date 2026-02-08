import React from "react";
import useAxiosPublic from "./useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

export default function useToysCategoryProducts() {
  const axiosPublic = useAxiosPublic();

  const { data, isPending } = useQuery({
    queryKey: ["toys-kids"],
    queryFn: async () => {
      const res = await axiosPublic.get("/toys-kids");
      return res.data.products;
    },
  });
  return { data, isPending };
}
