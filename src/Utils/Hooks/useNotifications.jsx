import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

export default function useNotifications() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data: notifications = [], refetch: refetchNotifications } = useQuery({
    queryKey: ["seller-notifications"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/notifications`);
      return res.data.notifications;
    },
    enabled: !!user?.id, // only fetch if user exists
    refetchInterval: 30000, // optional: refresh every 30s
  });
  return { notifications, refetchNotifications };
}
