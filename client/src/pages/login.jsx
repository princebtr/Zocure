// src/pages/Login.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import {
  FaHeartbeat,
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCrown,
  FaUserMd,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await login(form.email, form.password, "user");
      if (result.success) {
        toast.success("Login Successful");
        navigate("/");
      } else {
        toast.error(result.error || "Login Failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Left: Brand & Image */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="flex items-center mb-8">
          <FaHeartbeat className="text-white text-4xl" />
          <h1 className="text-4xl font-bold text-white ml-2">
            Zoc<span className="text-red-300">ure</span>
          </h1>
        </div>

        <div className="relative mb-8">
          <div className="w-64 h-64 bg-blue-400 rounded-full absolute -top-6 -left-6 opacity-20"></div>
          <div className="w-64 h-64 bg-blue-600 rounded-full absolute -bottom-6 -right-6 opacity-20"></div>
          <div className="relative bg-white p-4 rounded-xl shadow-xl transform rotate-3">
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-dashed border-blue-200 rounded-xl w-full h-64 flex items-center justify-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-full w-32 h-32" />
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-4">
          Your Health, <span className="text-blue-100">Our Priority</span>
        </h2>
        <p className="text-blue-100 max-w-md">
          Connect with trusted healthcare professionals for seamless appointment
          booking and personalized care.
        </p>
      </div>

      {/* Right: Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12 py-12 bg-white">
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600 mb-8">
            Sign in to continue your healthcare journey
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-blue-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                required
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-blue-500">
                <FaLock />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-blue-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-white font-medium transition-all ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
          <div className="mt-6 text-center">
            <span className="text-gray-600">Don't have an account?</span>
            <button
              onClick={() => navigate("/signup")}
              className="ml-2 inline-block px-4 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold shadow-md hover:from-blue-700 hover:to-indigo-800 transition-all"
            >
              Sign up
            </button>
          </div>
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Other login options
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                onClick={() => navigate("/admin/login")}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <FaCrown className="mr-2 text-blue-500" />
                Login as Admin
              </button>
              <button
                onClick={() => navigate("/doctor/login")}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <FaUserMd className="mr-2 text-blue-500" />
                Login as Doctor
              </button>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© 2023 Zocure. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
