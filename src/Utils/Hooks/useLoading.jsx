import { useEffect, useState } from "react";
import { useLocation } from "react-router";

const useLoading = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500); // Simulate 1s loading
    return () => clearTimeout(timer);
  }, [location.pathname]);
  return { loading };
};

export default useLoading;
