// src/pages/Signup.jsx
import { useState } from "react";
import axios from "../utils/axiosInstance";
import {
  FaHeartbeat,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("/auth/signup", form);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Left: Signup Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12 py-12 bg-white">
        <div className="max-w-md mx-auto w-full">
          {/* <div className="flex items-center mb-8">
            <FaHeartbeat className="text-blue-500 text-3xl" />
            <h1 className="text-3xl font-bold text-blue-600 ml-2">
              Zoc<span className="text-red-500">ure</span>
            </h1>
          </div> */}

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Create Your Account
          </h2>
          <p className="text-gray-600 mb-8">
            Join thousands of patients who trust Zocure for their healthcare
            needs
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-blue-500">
                <FaUser />
              </div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Email Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-blue-500">
                <FaEnvelope />
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

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-700"
              >
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </label>
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
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-3 px-4 border border-blue-600 rounded-lg shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 transition"
              >
                Login to your account
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© 2023 Zocure. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right: Branding */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <FaHeartbeat className="text-white text-4xl" />
            <h1 className="text-4xl font-bold text-white ml-2">
              Zoc<span className="text-red-300">ure</span>
            </h1>
          </div>
          <p className="mt-4 text-blue-100 max-w-md">
            Your trusted partner in healthcare management
          </p>
        </div>

        <div className="relative mb-8">
          <div className="w-64 h-64 bg-blue-400 rounded-full absolute -top-6 -left-6 opacity-20"></div>
          <div className="w-64 h-64 bg-blue-600 rounded-full absolute -bottom-6 -right-6 opacity-20"></div>
          <div className="relative bg-white p-4 rounded-xl shadow-xl transform rotate-3">
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-dashed border-blue-200 rounded-xl w-full h-64 flex flex-col items-center justify-center p-6">
              <div className="bg-gray-200 border-2 border-dashed rounded-full w-24 h-24 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-4">
          Join Our <span className="text-blue-100">Healthcare Community</span>
        </h2>
        <ul className="text-blue-100 max-w-md text-left space-y-2">
          <li className="flex items-start">
            <svg
              className="w-5 h-5 text-green-300 mr-2 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <span>Book appointments with verified doctors</span>
          </li>
          <li className="flex items-start">
            <svg
              className="w-5 h-5 text-green-300 mr-2 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <span>Manage your health records securely</span>
          </li>
          <li className="flex items-start">
            <svg
              className="w-5 h-5 text-green-300 mr-2 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <span>Receive personalized health insights</span>
          </li>
          <li className="flex items-start">
            <svg
              className="w-5 h-5 text-green-300 mr-2 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <span>Get medication reminders and health tips</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
