import { Outlet } from "react-router";
import Footer from "../Pages/Shared/Footer/Footer";
import Navbar from "../Pages/Shared/Navbar/Navbar";
import useAuth from "../Utils/Hooks/useAuth";
import Loading from "../components/Loading/Loading";
import { useEffect } from "react";

export default function MainLayOut() {
  const { user, isLoading } = useAuth();
  const sessionKey = `activeMenu_${user?.id}`;
  useEffect(() => {
    if (window.location.pathname !== "/dashboard") {
      sessionStorage.removeItem(sessionKey);
    }
  }, [sessionKey]);

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Navbar />
          <Outlet />
          <Footer />
        </>
      )}
    </div>
  );
}
