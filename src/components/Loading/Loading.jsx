export default function Loading() {
  return (
    <div className="h-screen flex justify-center items-center">
      <span
        className="loading loading-spinner loading-xl"
        style={{ color: "#FF0055" }}
      ></span>
    </div>
  );
}
