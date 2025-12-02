import { Outlet } from "react-router";
import Footer from "../Pages/Shared/Footer/Footer";
import Navbar from "../Pages/Shared/Navbar/Navbar";
import useAuth from "../Utils/Hooks/useAuth";
import Loading from "../components/Loading/Loading";

export default function MainLayOut() {
  const { isLoading } = useAuth();
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
