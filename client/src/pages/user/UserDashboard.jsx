import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosInstance";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarCheck,
  FaUser,
  FaClock,
  FaMapMarkerAlt,
  FaUserMd,
  FaStethoscope,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaSignOutAlt,
  FaBars,
  FaHome,
  FaUserCircle,
  FaListUl,
  FaPlus,
  FaLock,
  FaAmbulance,
  FaPhone,
  FaHeartbeat,
  FaBell,
  FaCog,
  FaEnvelope,
} from "react-icons/fa";
import MyProfile from "./MyProfile";
import DoctorsList from "../DoctorsList";
import BookAppointment from "./BookAppointment";
import Services from "../Services";

const UserDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
    if (activeSection === "dashboard") fetchAppointments();
  }, [activeSection]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const decoded = JSON.parse(atob(token.split(".")[1]));
      const response = await axios.get(`/auth/profile/${decoded.id}`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/appointments/my-appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(response.data);
    } catch (error) {
      toast.error("Error fetching appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `/appointments/${appointmentId}/cancel`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Appointment cancelled successfully");
        fetchAppointments();
      } catch (error) {
        toast.error("Error cancelling appointment");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <FaCheck className="text-green-600" />;
      case "pending":
        return <FaClock className="text-yellow-600" />;
      case "cancelled":
        return <FaTimes className="text-red-600" />;
      case "completed":
        return <FaCheck className="text-blue-600" />;
      default:
        return <FaExclamationTriangle className="text-gray-600" />;
    }
  };

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === "confirmed" || apt.status === "pending"
  );
  const pastAppointments = appointments.filter(
    (apt) => apt.status === "completed" || apt.status === "cancelled"
  );
  const currentAppointments =
    activeTab === "upcoming" ? upcomingAppointments : pastAppointments;

  const sidebarItems = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      key: "dashboard",
      color: "text-blue-600",
    },
    {
      name: "Profile",
      icon: <FaUserCircle />,
      key: "profile",
      color: "text-emerald-600",
    },
    {
      name: "Doctors",
      icon: <FaListUl />,
      key: "doctors",
      color: "text-purple-600",
    },
    // {
    //   name: "Book Appointment",
    //   icon: <FaPlus />,
    //   key: "book",
    //   color: "text-indigo-600",
    // },
    {
      name: "Services",
      icon: <FaStethoscope />,
      key: "services",
      color: "text-pink-600",
    },
    {
      name: "Call Ambulance",
      icon: <FaAmbulance />,
      key: "ambulance",
      color: "text-red-600",
    },
    {
      name: "Settings",
      icon: <FaLock />,
      key: "settings",
      color: "text-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 border-r border-gray-200`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-green-100">
          <div className="flex items-center group">
            <div className="relative">
              <FaHeartbeat className="text-blue-500 text-3xl transition-all duration-300 group-hover:text-blue-600 group-hover:scale-110" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            <div className="ml-3">
              <h1 className="text-2xl font-bold text-blue-800 ml-0 transition-colors duration-300 group-hover:text-blue-900">
                Zoc<span className="text-red-600">ure</span>
              </h1>
              <p className="text-sm text-blue-700 font-medium">
                User Dashboard
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white hover:text-blue-200 transition-colors"
          >
            <FaTimes />
          </button>
        </div>
        {/* User Profile */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            {user?.image ? (
              <img
                src={user.image}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                <FaUser className="text-2xl" />
              </div>
            )}
            <div className="ml-3">
              <p className="font-semibold text-gray-800">
                {user?.name || "User"}
              </p>
              <p className="text-sm text-gray-600">
                {user?.email || "Welcome!"}
              </p>
            </div>
          </div>
        </div>
        {/* Navigation */}
        <nav className="mt-6 px-3">
          {sidebarItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveSection(item.key)}
              className={`w-full flex items-center px-4 py-3 mx-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white ${
                activeSection === item.key
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 shadow-sm"
                  : "hover:scale-105"
              }`}
            >
              <span className={`mr-4 ${item.color}`}>{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
        {/* Logout Button */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <FaSignOutAlt className="mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
      {/* Main Content */}
      <div className="md:ml-72">
        {/* Top Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden text-gray-500 hover:text-gray-700 mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FaBars />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {sidebarItems.find((i) => i.key === activeSection)?.name ||
                    "Dashboard"}
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome to your dashboard!
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <FaBell className="text-xl" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
              </div>

              {/* Messages */}
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <FaEnvelope className="text-xl" />
              </button>

              {/* Settings */}
              <button
                onClick={() => setActiveSection("settings")}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaCog className="text-xl" />
              </button>
            </div>
          </div>
        </div>
        {/* Main Content Area */}
        <div className="p-6">
          {activeSection === "dashboard" && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Total Appointments
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {appointments.length}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-xl shadow-sm">
                      <FaCalendarCheck className="text-blue-600 text-2xl" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Confirmed
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {
                          appointments.filter(
                            (apt) => apt.status === "confirmed"
                          ).length
                        }
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-xl shadow-sm">
                      <FaCheck className="text-green-600 text-2xl" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Pending
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {
                          appointments.filter((apt) => apt.status === "pending")
                            .length
                        }
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-xl shadow-sm">
                      <FaClock className="text-yellow-600 text-2xl" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Doctors Visited
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {
                          new Set(appointments.map((apt) => apt.doctorId?._id))
                            .size
                        }
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-xl shadow-sm">
                      <FaUserMd className="text-purple-600 text-2xl" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Appointments Section */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="border-b border-gray-200 p-4 mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">
                    Appointments
                  </h2>
                  <nav className="flex space-x-8">
                    <button
                      onClick={() => setActiveTab("upcoming")}
                      className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === "upcoming"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Upcoming ({upcomingAppointments.length})
                    </button>
                    <button
                      onClick={() => setActiveTab("past")}
                      className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === "past"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Past ({pastAppointments.length})
                    </button>
                  </nav>
                </div>
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : currentAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <FaCalendarCheck className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No {activeTab === "upcoming" ? "upcoming" : "past"}{" "}
                      appointments
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {activeTab === "upcoming"
                        ? "You don't have any upcoming appointments."
                        : "You don't have any past appointments."}
                    </p>
                    {activeTab === "upcoming" && (
                      <button
                        onClick={() => setActiveSection("book")}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Book Appointment
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentAppointments.map((appointment) => (
                      <div
                        key={appointment._id}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-white to-gray-50"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                <FaUserMd />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  Dr.{" "}
                                  {appointment.doctorId?.name ||
                                    appointment.doctorId?.userId?.name ||
                                    "Unknown Doctor"}
                                </h3>
                                <p className="text-sm text-gray-600 flex items-center">
                                  <FaStethoscope className="mr-2" />
                                  {appointment.doctorId?.specialization ||
                                    "General Medicine"}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                    appointment.status
                                  )}`}
                                >
                                  {getStatusIcon(appointment.status)}
                                  <span className="ml-1 capitalize">
                                    {appointment.status}
                                  </span>
                                </span>
                              </div>
                            </div>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                <FaCalendarCheck className="mr-2 text-blue-500" />
                                {new Date(
                                  appointment.appointmentDate
                                ).toLocaleDateString()}
                              </div>
                              <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                <FaClock className="mr-2 text-blue-500" />
                                {appointment.slotId || "TBD"}
                              </div>
                              <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                <FaMapMarkerAlt className="mr-2 text-blue-500" />
                                {appointment.location || "Clinic"}
                              </div>
                            </div>

                            {/* Status Indicators for Completed Appointments */}
                            {appointment.status === "completed" && (
                              <div className="mt-4 flex space-x-4">
                                <div className="flex items-center">
                                  <span
                                    className={`w-3 h-3 rounded-full mr-2 ${
                                      appointment.patientVisited
                                        ? "bg-green-500"
                                        : "bg-gray-300"
                                    }`}
                                  ></span>
                                  <span className="text-sm text-gray-600">
                                    Visited:{" "}
                                    {appointment.patientVisited ? "Yes" : "No"}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <span
                                    className={`w-3 h-3 rounded-full mr-2 ${
                                      appointment.checkupDone
                                        ? "bg-green-500"
                                        : "bg-gray-300"
                                    }`}
                                  ></span>
                                  <span className="text-sm text-gray-600">
                                    Checkup:{" "}
                                    {appointment.checkupDone
                                      ? "Done"
                                      : "Pending"}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Doctor Notes */}
                            {appointment.doctorNotes && (
                              <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                                <p className="text-sm text-gray-700">
                                  <strong>Doctor Notes:</strong>{" "}
                                  {appointment.doctorNotes}
                                </p>
                              </div>
                            )}

                            {/* Consultation Notes */}
                            {appointment.consultationNotes && (
                              <div className="mt-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                                <p className="text-sm text-gray-700">
                                  <strong>Consultation:</strong>{" "}
                                  {appointment.consultationNotes}
                                </p>
                              </div>
                            )}
                          </div>
                          {activeTab === "upcoming" &&
                            appointment.status === "pending" && (
                              <div className="flex space-x-2 mt-2">
                                <button
                                  onClick={() =>
                                    handleCancelAppointment(appointment._id)
                                  }
                                  className="px-3 py-1 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
          {activeSection === "profile" && <MyProfile onlyProfileInfo />}
          {activeSection === "settings" && <MyProfile onlySettings />}
          {activeSection === "doctors" && <DoctorsList />}
          {activeSection === "book" && <BookAppointment />}
          {activeSection === "services" && <Services />}
          {activeSection === "ambulance" && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-red-50 to-blue-50 rounded-2xl shadow-xl p-10 animate-fade-in">
              <FaAmbulance className="text-6xl text-red-500 mb-6 animate-bounce" />
              <h2 className="text-3xl font-bold text-red-700 mb-2">
                Emergency Ambulance Request
              </h2>
              <p className="text-lg text-gray-700 mb-6 text-center max-w-xl">
                If you or someone near you needs urgent medical attention, call
                our 24x7 ambulance helpline or request an ambulance below. Our
                team will respond immediately.
              </p>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <button className="bg-gradient-to-r from-red-500 to-red-700 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:from-red-600 hover:to-red-800 transition-all flex items-center">
                  <FaPhone className="mr-2" /> Call 108 (Emergency)
                </button>
                <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all flex items-center">
                  <FaAmbulance className="mr-2" /> Request Ambulance
                </button>
              </div>
              <div className="text-gray-500 text-sm">
                Ambulance services are available 24x7 in your area.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
