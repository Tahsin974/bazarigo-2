export default function TopBar({ active }) {
  return (
    <div>
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h1 className="text-2xl font-bold capitalize">{active}</h1>
        <div className="text-sm text-gray-500">
          Logged in as <strong>Seller</strong>
        </div>
      </header>
    </div>
  );
}
