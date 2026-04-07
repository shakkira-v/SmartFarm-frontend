const Topbar = () => {
  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          Admin
        </span>
        <button className="bg-red-500 text-white px-3 py-1 rounded">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;
