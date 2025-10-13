import { MoveRight } from "lucide-react";
import { HashLink } from "react-router-hash-link";

export default function SectionTitle({ title, link = "/" }) {
  return (
    <div className="flex justify-between items-center ">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 ">
        {title}
      </h2>
      <HashLink
        to={link}
        className="hover:text-[#FF0055] transition-colors flex items-center gap-1 font-bold"
      >
        <span>View All</span>{" "}
        <span>
          <MoveRight size={20} />
        </span>
      </HashLink>
    </div>
  );
}
