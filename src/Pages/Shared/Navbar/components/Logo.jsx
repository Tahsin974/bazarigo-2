import logo from "../../../../assets/Bazarigo.svg";
export default function Logo() {
  return (
    <div className="text-2xl font-bold text-[#FF0055]">
      <a href="/" aria-label="E-commerce Home">
        <img src={logo} className="h-10 w-auto" alt="logo" />
      </a>
    </div>
  );
}
