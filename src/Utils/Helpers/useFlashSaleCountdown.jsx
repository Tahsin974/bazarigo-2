import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import useAxiosPublic from "../Hooks/useAxiosPublic";

export default function useFlashSaleCountdown() {
  const axiosPublic = useAxiosPublic();
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const fetchFlashSale = async () => {
      try {
        const res = await axiosPublic.get("/flash-sale/active");
        const flashSale = res.data;

        if (!flashSale || !flashSale.end_time || !flashSale.start_time) {
          setTimeLeft(0);
          setStartTime(0);
          setEndTime(0);
          return;
        }

        const now = Math.floor(Date.now() / 1000);
        setStartTime(flashSale.start_time);
        setEndTime(flashSale.end_time);
        setTimeLeft(Math.max(flashSale.end_time - now, 0));
      } catch (error) {
        console.error("Failed to fetch flash sale data:", error);
        setTimeLeft(0);
        setStartTime(0);
        setEndTime(0);
      }
    };

    fetchFlashSale();
  }, [location.pathname]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => Math.max(t - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return { h, m, s };
  };

  const { h, m, s } = formatTime(timeLeft);

  const progress =
    endTime && startTime
      ? ((endTime - Math.max(timeLeft, 0) - startTime) /
          (endTime - startTime)) *
        100
      : 0;

  const getProgressColor = () => {
    if (progress < 50) return "bg-green-400";
    if (progress < 80) return "bg-yellow-400";
    return "bg-[#f72c2c]";
  };

  return { h, m, s, timeLeft, progress, getProgressColor };
}
