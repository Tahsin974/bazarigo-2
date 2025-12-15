import { MoveRight } from "lucide-react";
import { HashLink } from "react-router-hash-link";

export default function SectionTitle({ title, link = "/" }) {
  return (
    <div className="flex justify-between items-center ">
      <h2 className="sm:text-2xl text-xl md:text-3xl lg:text-4xl  text-center text-gray-800 ">
        {title}
      </h2>
      <HashLink to={link} className="hover:text-[#FF0055] transition-colors  ">
        <button className="flex items-center gap-1 ">
          <span>View All</span>{" "}
          <span>
            <MoveRight size={20} />
          </span>
        </button>
      </HashLink>
    </div>
  );
}
