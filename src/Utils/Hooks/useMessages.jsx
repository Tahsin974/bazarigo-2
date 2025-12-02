import React from "react";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

export default function useMessages() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const {
    data: myMessages = [],
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["user-messages"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-messages/${user.id}`);
      return res.data.messages;
    },
  });
  return { myMessages, isPending, refetch };
}
