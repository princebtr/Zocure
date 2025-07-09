export default function RoleSwitch({ role, setRole }) {
  return (
    <div className="flex justify-center gap-4 my-4">
      <button
        onClick={() => setRole("user")}
        className={`px-4 py-2 rounded ${
          role === "user" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        User
      </button>
      <button
        onClick={() => setRole("doctor")}
        className={`px-4 py-2 rounded ${
          role === "doctor" ? "bg-purple-500 text-white" : "bg-gray-200"
        }`}
      >
        Doctor
      </button>
    </div>
  );
}
