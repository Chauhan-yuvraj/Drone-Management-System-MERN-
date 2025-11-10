import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center bg-linear-to-r from-blue-900 to-blue-500 text-white">
      <h1 className="text-4xl font-bold mb-2">Welcome to Netra</h1>
      <p className="text-sm mb-8 px-4">Smart Drone Management System</p>
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/login")}
          className="bg-green-500 px-6 py-2 rounded-lg text-white font-medium hover:bg-green-600 transition"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="bg-blue-600 px-6 py-2 rounded-lg text-white font-medium hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
