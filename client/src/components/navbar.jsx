// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  FaHeartbeat,
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaUserMd,
  FaHome,
  FaStethoscope,
  FaInfoCircle,
  FaEnvelope,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUser(decoded);
      } catch {
        localStorage.removeItem("token");
      }
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleProtectedClick = () => {
    if (!user) {
      toast.error("Please login to access this feature.");
      navigate("/login");
    } else {
      navigate("/doctors");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully");
    setDropdownOpen(false);
    navigate("/");
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case "doctor":
        return <FaUserMd className="text-blue-500 text-sm" />;
      default:
        return <FaUser className="text-blue-500 text-sm" />;
    }
  };

  const navItems = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "Services", action: handleProtectedClick, icon: <FaStethoscope /> },
    { name: "Doctors", action: handleProtectedClick, icon: <FaUserMd /> },
    { name: "About", path: "/about", icon: <FaInfoCircle /> },
    { name: "Contact", path: "/contact", icon: <FaEnvelope /> },
  ];

  return (
    <header className="bg-white shadow-sm fixed w-full z-50 border-b border-blue-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <FaHeartbeat className="text-blue-500 text-3xl" />
            <h1 className="text-2xl font-bold text-blue-600 ml-2">
              Zoc<span className="text-red-500">ure</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) =>
              item.path ? (
                <Link
                  key={index}
                  to={item.path}
                  className="flex items-center text-gray-700 font-medium hover:text-blue-600 transition-all duration-300 group"
                >
                  <span className="mr-2 text-blue-500 opacity-80 group-hover:opacity-100">
                    {item.icon}
                  </span>
                  <span className="border-b-2 border-transparent group-hover:border-blue-500 pb-1">
                    {item.name}
                  </span>
                </Link>
              ) : (
                <button
                  key={index}
                  onClick={item.action}
                  className="flex items-center text-gray-700 font-medium hover:text-blue-600 transition-all duration-300 group"
                >
                  <span className="mr-2 text-blue-500 opacity-80 group-hover:opacity-100">
                    {item.icon}
                  </span>
                  <span className="border-b-2 border-transparent group-hover:border-blue-500 pb-1">
                    {item.name}
                  </span>
                </button>
              )
            )}

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 text-sm text-gray-700 hover:text-blue-600 transition-all group"
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 group-hover:from-blue-200 group-hover:to-indigo-200 transition-all">
                      {user.name
                        ? user.name.charAt(0).toUpperCase()
                        : user.role.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 border border-blue-100">
                      <div className="bg-blue-500 rounded-full p-1 text-white flex items-center justify-center w-5 h-5">
                        {getRoleIcon()}
                      </div>
                    </div>
                  </div>
                  <span className="hidden lg:inline text-gray-600 group-hover:text-blue-600">
                    {user.name ? user.name.split(" ")[0] : "Account"}
                  </span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-lg py-2 z-10 border border-gray-200 animate-fadeIn">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.name || user.email}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user.role}
                      </p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setDropdownOpen(false);
                        }}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                      >
                        <FaUser className="mr-3 text-gray-500" />
                        <span>My Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate("/appointments");
                          setDropdownOpen(false);
                        }}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-3 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>My Appointments</span>
                      </button>
                    </div>
                    <div className="py-1 border-t">
                      <button
                        onClick={logout}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-700 transition-all"
                      >
                        <FaSignOutAlt className="mr-3" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link
                  to="/login"
                  className="flex items-center px-4 py-2 border-2 border-blue-500 text-blue-500 rounded-full font-medium hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:shadow-sm"
                >
                  <FaUser className="mr-2" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg shadow-blue-200"
                >
                  <FaUser className="mr-2 text-white" />
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <FaTimes className="text-red-500" size={24} />
            ) : (
              <FaBars className="text-blue-500" size={24} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white py-4 px-4 mt-4 rounded-lg shadow-xl border border-blue-50 animate-slideDown">
            {user && (
              <div className="flex items-center mb-6 px-3 py-3 bg-blue-50 rounded-lg">
                <div className="relative mr-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                    {user.name
                      ? user.name.charAt(0).toUpperCase()
                      : user.role.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 border border-blue-100">
                    <div className="bg-blue-500 rounded-full p-1 text-white flex items-center justify-center w-5 h-5">
                      {getRoleIcon()}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name || user.email}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col space-y-3">
              {navItems.map((item, index) =>
                item.path ? (
                  <Link
                    key={index}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center text-gray-700 font-medium hover:text-blue-600 transition px-3 py-3 rounded-lg hover:bg-blue-50 group"
                  >
                    <span className="mr-3 text-blue-500 group-hover:text-blue-600">
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </Link>
                ) : (
                  <button
                    key={index}
                    onClick={() => {
                      item.action();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center text-left text-gray-700 font-medium hover:text-blue-600 transition px-3 py-3 rounded-lg hover:bg-blue-50 w-full group"
                  >
                    <span className="mr-3 text-blue-500 group-hover:text-blue-600">
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </button>
                )
              )}

              {user ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center text-gray-700 font-medium hover:text-blue-600 transition px-3 py-3 rounded-lg hover:bg-blue-50"
                  >
                    <FaUser className="mr-3 text-blue-500" />
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate("/appointments");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center text-gray-700 font-medium hover:text-blue-600 transition px-3 py-3 rounded-lg hover:bg-blue-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    My Appointments
                  </button>
                  <button
                    onClick={logout}
                    className="flex items-center text-red-500 font-medium hover:text-red-700 transition px-3 py-3 rounded-lg hover:bg-red-50 mt-4"
                  >
                    <FaSignOutAlt className="mr-3" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <Link
                    to="/login"
                    className="flex items-center justify-center px-4 py-3 border-2 border-blue-500 text-blue-500 rounded-xl font-medium hover:bg-blue-50 transition"
                  >
                    <FaUser className="mr-2" />
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition"
                  >
                    <FaUser className="mr-2 text-white" />
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
