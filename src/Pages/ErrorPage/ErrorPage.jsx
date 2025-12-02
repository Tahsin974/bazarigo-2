import { Home } from "lucide-react";
import img from "../../assets/Error/404.gif";
import { Link } from "react-router";
const ErrorPage = () => {
  return (
    <div className="hero bg-white min-h-screen">
      <div className="hero-content text-center ">
        <div className="max-w-lg space-y-7">
          <img src={img} alt="" />
          <Link to="/">
            <button className="btn rounded-md bg-gradient-to-r from-[#FF7B7B] to-[#FF0055] shadow-none text-white border-0">
              Back To Home <Home size={20} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
