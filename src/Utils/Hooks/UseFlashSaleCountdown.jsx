import { useEffect, useState } from "react";

export default function UseFlashSaleCountdown(totalDuration) {
  const [timeLeft, setTimeLeft] = useState(totalDuration);
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);
  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return { h, m, s };
  };
  const { h, m, s } = formatTime(timeLeft);
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;
  const getProgressColor = () => {
    if (progress < 50) return "bg-green-400";
    if (progress < 80) return "bg-yellow-400";
    return "bg-red-500";
  };
  return { h, m, s, progress, getProgressColor };
}
