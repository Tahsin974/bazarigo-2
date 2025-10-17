import { useEffect, useState } from "react";

export default function UseFlashSaleCountdown(totalDuration) {
  const storedEndTime = localStorage.getItem("flashSaleEndTime");
  let initialTimeLeft = totalDuration;

  if (storedEndTime) {
    // 2. যদি endTime সেট করা থাকে, তাহলে এখনকার সময়ের সাথে মিলিয়ে
    //    কত সময় বাকি আছে, তা বের করছি।
    const nowInSeconds = Math.floor(Date.now() / 1000); // বর্তমান সময় (সেকেন্ডে)
    const remainingTime = parseInt(storedEndTime) - nowInSeconds;

    if (remainingTime > 0) {
      initialTimeLeft = remainingTime;
    } else {
      // 3. যদি সময় শেষ হয়ে যায় (remainingTime <= 0), তাহলে Local Storage ক্লিয়ার করে দিচ্ছি।
      localStorage.removeItem("flashSaleEndTime");
      initialTimeLeft = 0; // সময় ০ সেট করছি
    }
  } else {
    // 4. যদি Local Storage এ কিছু না থাকে (প্রথমবার লোড),
    //    তাহলে নতুন endTime সেট করছি।
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const endTime = nowInSeconds + totalDuration;
    localStorage.setItem("flashSaleEndTime", endTime.toString());
  }
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);
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
