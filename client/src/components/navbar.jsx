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
  FaCalendarCheck,
  FaCrown,
  FaChevronDown,
  FaTachometerAlt,
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUser(decoded);
        fetchUserProfile(decoded.id);
      } catch {
        localStorage.removeItem("token");
      }
    }

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const fetchUserProfile = async (id) => {
    try {
      const res = await axiosInstance.get(`/auth/profile/${id}`);
      setUserProfile(res.data);
    } catch (err) {
      console.error("Profile fetch failed:", err);
    }
  };

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
  const handleProtectedClick2 = () => {
    if (!user) {
      toast.error("Please login to access this feature.");
      navigate("/login");
    } else {
      navigate("/services");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setUserProfile(null);
    toast.success("Logged out successfully");
    navigate("/");
    navigate(0); // refresh page
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case "doctor":
        return <FaUserMd className="text-emerald-500" />;
      case "admin":
        return <FaCrown className="text-amber-500" />;
      default:
        return <FaUser className="text-blue-500" />;
    }
  };

  const getUserDisplayName = () =>
    userProfile?.name || user?.name || user?.email?.split("@")[0] || "User";

  const getUserAvatar = () => userProfile?.avatar || null;

  const navItems = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "About", path: "/about", icon: <FaInfoCircle /> },
    { name: "Contact", path: "/contact", icon: <FaEnvelope /> },
  ];

  // 👇 Updated logic to hide navbar
  const dashboardPaths = [
    "/dashboard",
    "/doctor/dashboard",
    "/admin/dashboard",
    "/profile",
    "/admin",
    "/doctor",
    "/user",
  ];
  const isDashboardPage = dashboardPaths.some((p) =>
    location.pathname.startsWith(p)
  );
  // Only show navbar on landing, about, contact
  const allowedPaths = ["/", "/about", "/contact"];
  if (!allowedPaths.includes(location.pathname)) return null;

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50"
          : "bg-white shadow-sm border-b border-gray-100"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center cursor-pointer group"
          >
            <div className="relative">
              <FaHeartbeat className="text-blue-500 text-3xl transition-all duration-300 group-hover:text-blue-600 group-hover:scale-110" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            <h1 className="text-2xl font-bold text-blue-600 ml-3 transition-colors duration-300 group-hover:text-blue-700">
              Zoc<span className="text-red-500">ure</span>
            </h1>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item, i) =>
              item.path ? (
                <Link
                  key={i}
                  to={item.path}
                  className="flex items-center px-4 py-2 text-gray-700 font-medium hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                >
                  <span className="text-gray-500 group-hover:text-blue-500 transition-colors duration-200">
                    {item.icon}
                  </span>
                  <span className="ml-2">{item.name}</span>
                </Link>
              ) : (
                <button
                  key={i}
                  onClick={item.action}
                  className="flex items-center px-4 py-2 text-gray-700 font-medium hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                >
                  <span className="text-gray-500 group-hover:text-blue-500 transition-colors duration-200">
                    {item.icon}
                  </span>
                  <span className="ml-2">{item.name}</span>
                </button>
              )
            )}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Dashboard Icon */}
            <button
              onClick={() => {
                if (!user) {
                  navigate("/login");
                } else if (user.role === "admin") {
                  navigate("/admin/dashboard");
                } else if (user.role === "doctor") {
                  navigate("/doctor/dashboard");
                } else if (user.role === "test") {
                  navigate("/test");
                } else {
                  navigate("/dashboard");
                }
              }}
              className="flex items-center px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-800 transition-all text-base ml-2"
              title="Go to Dashboard"
            >
              <FaTachometerAlt className="text-xl mr-2" />
              Dashboard
            </button>
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center hover:bg-gray-50 bg-gradient-to-r from-blue-100 to-indigo-50 space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group"
                >
                  <div className="relative">
                    {getUserAvatar() ? (
                      <img
                        src={getUserAvatar()}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-300 transition-all duration-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold flex items-center justify-center border-2 border-gray-200 group-hover:border-blue-300 transition-all duration-200 shadow-sm">
                        {getUserDisplayName().charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="hidden md:flex items-center space-x-1">
                    <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                      {getUserDisplayName()}
                    </span>
                    <FaChevronDown
                      className={`text-gray-400 text-sm transition-transform duration-200 ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white shadow-xl rounded-xl border border-gray-200 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                    <div className="px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                      <div className="flex items-center space-x-4">
                        {getUserAvatar() ? (
                          <img
                            src={getUserAvatar()}
                            alt="avatar"
                            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold flex items-center justify-center border-2 border-white shadow-sm">
                            {getUserDisplayName().charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {getUserDisplayName()}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            {getRoleIcon()}
                            <span className="text-sm text-gray-600 capitalize font-medium">
                              {user.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <button
                        onClick={() => {
                          if (!user) {
                            navigate("/login");
                          } else if (user.role === "admin") {
                            navigate("/admin/dashboard");
                          } else if (user.role === "doctor") {
                            navigate("/doctor/dashboard");
                          } else if (user.role === "test") {
                            navigate("/test");
                          } else {
                            navigate("/dashboard");
                          }
                        }}
                        className="w-full text-left px-6 py-3 hover:bg-blue-50 text-sm text-gray-700 flex items-center transition-colors duration-200 group"
                      >
                        <FaCalendarCheck className="mr-3 text-blue-500 group-hover:text-blue-600 transition-colors duration-200" />
                        <span className="font-medium">My Dashboard</span>
                      </button>
                      {/* <button
                        onClick={() => {
                          navigate("/profile");
                          setDropdownOpen(false);
                          navigate(0);
                        }}
                        className="w-full text-left px-6 py-3 hover:bg-emerald-50 text-sm text-gray-700 flex items-center transition-colors duration-200 group"
                      >
                        <FaUser className="mr-3 text-emerald-500 group-hover:text-emerald-600 transition-colors duration-200" />
                        <span className="font-medium">My Profile</span>
                      </button> */}
                    </div>

                    <div className="border-t border-gray-100">
                      <button
                        onClick={logout}
                        className="w-full text-left px-6 py-3 hover:bg-red-50 text-sm text-red-600 flex items-center transition-colors duration-200 group"
                      >
                        <FaSignOutAlt className="mr-3 group-hover:text-red-700 transition-colors duration-200" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-5 py-2 border-2 border-blue-500 text-blue-500 rounded-full font-medium hover:bg-blue-50 hover:border-blue-600 hover:text-blue-600 transition-all duration-200 hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <FaTimes className="text-red-500 text-xl" />
              ) : (
                <FaBars className="text-blue-500 text-xl" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 animate-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item, i) =>
                item.path ? (
                  <Link
                    key={i}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                  >
                    <span className="text-gray-500 group-hover:text-blue-500 transition-colors duration-200">
                      {item.icon}
                    </span>
                    <span className="ml-3 font-medium">{item.name}</span>
                  </Link>
                ) : (
                  <button
                    key={i}
                    onClick={() => {
                      item.action();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                  >
                    <span className="text-gray-500 group-hover:text-blue-500 transition-colors duration-200">
                      {item.icon}
                    </span>
                    <span className="ml-3 font-medium">{item.name}</span>
                  </button>
                )
              )}
              {!user && (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center px-4 py-3 border-2 border-blue-500 text-blue-500 rounded-lg font-medium hover:bg-blue-50 transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                  >
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
