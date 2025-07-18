import React, { useState, useEffect } from "react";
import {
  FaSignOutAlt,
  FaUserMd,
  FaCalendarCheck,
  FaUsers,
  FaClock,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaBars,
  FaTimes as FaClose,
  FaHome,
  FaUser,
  FaCog,
  FaChartBar,
  FaBell,
  FaSearch,
  FaEye,
  FaEdit,
  FaPlus,
  FaArrowUp,
  FaArrowDown,
  FaStethoscope,
  FaCalendarAlt,
  FaClipboardList,
  FaHistory,
} from "react-icons/fa";
import axios from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("today");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [doctorName, setDoctorName] = useState("");
  const [doctorSpecialization, setDoctorSpecialization] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    fetchDoctorProfile();
    fetchAppointments();
    fetchSlots();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/doctors/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctorName(
        response.data.name || response.data.userId?.name || "Doctor"
      );
      setDoctorSpecialization(response.data.specialization || "");
    } catch (error) {
      setDoctorName("Doctor");
      setDoctorSpecialization("");
      toast.error("Failed to fetch doctor profile");
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/doctors/my-appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(response.data);
    } catch (error) {
      setAppointments([]);
      toast.error("Failed to fetch appointments");
    }
  };

  const fetchSlots = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/doctors/my-slots", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSlots(response.data);
    } catch (error) {
      setSlots([]);
      toast.error("Failed to fetch slots");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const res = await axios.put(
        `/appointments/${appointmentId}`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.status === 200) {
        setAppointments((prev) =>
          prev.map((apt) =>
            apt._id === appointmentId ? { ...apt, status: newStatus } : apt
          )
        );
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      case "completed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <FaCheck className="text-emerald-600" />;
      case "pending":
        return <FaClock className="text-amber-600" />;
      case "cancelled":
        return <FaTimes className="text-red-600" />;
      case "completed":
        return <FaCheck className="text-blue-600" />;
      default:
        return <FaExclamationTriangle className="text-gray-600" />;
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter(
    (apt) => apt.appointmentDate === today
  );
  const upcomingAppointments = appointments.filter(
    (apt) =>
      apt.appointmentDate > today &&
      (apt.status === "confirmed" || apt.status === "pending")
  );
  const pastAppointments = appointments.filter(
    (apt) => apt.appointmentDate < today || apt.status === "completed"
  );

  const getCurrentAppointments = () => {
    switch (activeTab) {
      case "today":
        return todayAppointments;
      case "upcoming":
        return upcomingAppointments;
      case "past":
        return pastAppointments;
      default:
        return appointments;
    }
  };

  const currentAppointments = getCurrentAppointments();

  // Helper to get unique patients with their soonest appointment
  const getUniquePatientsWithNextAppointment = () => {
    const patientMap = {};
    appointments.forEach((apt) => {
      const id = apt.userId?._id || apt.userId;
      if (!id) return;
      if (
        !patientMap[id] ||
        new Date(apt.appointmentDate) < new Date(patientMap[id].appointmentDate)
      ) {
        patientMap[id] = apt;
      }
    });
    return Object.values(patientMap).sort(
      (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)
    );
  };

  const sidebarItems = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      key: "dashboard",
      color: "text-blue-600",
    },
    {
      name: "Appointments",
      icon: <FaCalendarCheck />,
      key: "appointments",
      color: "text-emerald-600",
    },
    {
      name: "Patients",
      icon: <FaUsers />,
      key: "patients",
      color: "text-purple-600",
    },
  ];

  const stats = [
    {
      title: "Total Appointments",
      value: appointments.length,
      icon: <FaCalendarCheck className="text-blue-600 text-2xl" />,
      bg: "bg-gradient-to-r from-blue-50 to-blue-100",
      change: "+12%",
      changeType: "increase",
    },
    {
      title: "Today's Appointments",
      value: todayAppointments.length,
      icon: <FaStethoscope className="text-emerald-600 text-2xl" />,
      bg: "bg-gradient-to-r from-emerald-50 to-emerald-100",
      change: "+5%",
      changeType: "increase",
    },
    {
      title: "Pending",
      value: appointments.filter((apt) => apt.status === "pending").length,
      icon: <FaClock className="text-amber-600 text-2xl" />,
      bg: "bg-gradient-to-r from-amber-50 to-amber-100",
      change: "-3%",
      changeType: "decrease",
    },
    {
      title: "Available Slots",
      value: slots.filter((slot) => !slot.isBooked).length,
      icon: <FaUsers className="text-purple-600 text-2xl" />,
      bg: "bg-gradient-to-r from-purple-50 to-purple-100",
      change: "+8%",
      changeType: "increase",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-blue-600 text-4xl animate-spin">⚙️</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 border-r border-gray-200`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center">
            <div className="bg-white p-2 rounded-xl shadow-lg">
              <h1 className="text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-600">
                Zocure
              </h1>
            </div>
            <div className="ml-3">
              <p className="text-blue-100 text-sm">Doctor Portal</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white hover:text-blue-200 transition-colors"
          >
            <FaClose />
          </button>
        </div>

        {/* Doctor Profile */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {doctorName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="ml-3">
              <p className="font-semibold text-gray-800">{doctorName}</p>
              <p className="text-sm text-gray-600">{doctorSpecialization}</p>
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
                  Welcome back, {doctorName}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <FaBell className="text-xl" />
                </button>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6">
          {activeSection === "dashboard" && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className={`${stat.bg} rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                        <div
                          className={`flex items-center mt-2 text-sm ${
                            stat.changeType === "increase"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {stat.changeType === "increase" ? (
                            <FaArrowUp className="mr-1" />
                          ) : (
                            <FaArrowDown className="mr-1" />
                          )}
                          {stat.change}
                        </div>
                      </div>
                      <div className="p-3 bg-white rounded-xl shadow-sm">
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dashboard Summaries */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upcoming Appointments Summary */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      Upcoming Appointments
                    </h2>
                  </div>
                  {upcomingAppointments.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No upcoming appointments
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {upcomingAppointments.slice(0, 3).map((appointment) => (
                        <div
                          key={appointment._id}
                          className="border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-all duration-200 hover:scale-105"
                        >
                          <div>
                            <p className="font-semibold text-gray-800">
                              {appointment.userId?.name || "Unknown Patient"}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center">
                              <FaClock className="mr-1" />
                              {appointment.slotId || "TBD"} on{" "}
                              {new Date(
                                appointment.appointmentDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              appointment.status
                            )}`}
                          >
                            {getStatusIcon(appointment.status)}{" "}
                            <span className="ml-1 capitalize">
                              {appointment.status}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Patients Summary */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      Patients
                    </h2>
                  </div>
                  {getUniquePatientsWithNextAppointment().length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No patients found
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {getUniquePatientsWithNextAppointment()
                        .slice(0, 3)
                        .map((apt) => (
                          <div
                            key={apt.userId?._id || apt.userId}
                            className="border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-all duration-200 hover:scale-105"
                          >
                            <div>
                              <p className="font-semibold text-gray-800">
                                {apt.userId?.name || "Unknown Patient"}
                              </p>
                              <p className="text-sm text-gray-600 flex items-center">
                                <FaClock className="mr-1" />
                                {apt.slotId || "TBD"} on{" "}
                                {new Date(
                                  apt.appointmentDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                              Next
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          {activeSection === "appointments" && (
            <>
              {/* Appointments Section */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                <div className="border-b border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      Appointments
                    </h2>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                      <FaPlus className="mr-2" />
                      New Appointment
                    </button>
                  </div>

                  <nav className="flex space-x-8">
                    {[
                      {
                        key: "today",
                        label: "Today",
                        count: todayAppointments.length,
                      },
                      {
                        key: "upcoming",
                        label: "Upcoming",
                        count: upcomingAppointments.length,
                      },
                      {
                        key: "past",
                        label: "Past",
                        count: pastAppointments.length,
                      },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === tab.key
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {tab.label} ({tab.count})
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-6">
                  {currentAppointments.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaCalendarCheck className="text-gray-400 text-2xl" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No {activeTab} appointments
                      </h3>
                      <p className="text-gray-500">
                        You don't have any {activeTab} appointments.
                      </p>
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
                                  {appointment.userId?.name?.charAt(0) || "P"}
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {appointment.userId?.name ||
                                      "Unknown Patient"}
                                  </h3>
                                  <p className="text-sm text-gray-600 flex items-center">
                                    <FaEnvelope className="mr-2" />
                                    {appointment.userId?.email || "No email"}
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

                              {appointment.notes && (
                                <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                                  <p className="text-sm text-gray-700">
                                    {appointment.notes}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col space-y-2 ml-4">
                              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                <FaEye />
                              </button>
                              <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                <FaEdit />
                              </button>

                              {activeTab !== "past" &&
                                appointment.status === "pending" && (
                                  <div className="flex space-x-2 mt-2">
                                    <button
                                      onClick={() =>
                                        handleStatusUpdate(
                                          appointment._id,
                                          "confirmed"
                                        )
                                      }
                                      className="px-3 py-1 text-sm bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors"
                                    >
                                      Confirm
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleStatusUpdate(
                                          appointment._id,
                                          "cancelled"
                                        )
                                      }
                                      className="px-3 py-1 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                )}

                              {activeTab === "today" &&
                                appointment.status === "confirmed" && (
                                  <button
                                    onClick={() =>
                                      handleStatusUpdate(
                                        appointment._id,
                                        "completed"
                                      )
                                    }
                                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors"
                                  >
                                    Complete
                                  </button>
                                )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          {activeSection === "patients" && (
            <>
              {/* Patients List */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Patients</h2>
                </div>
                {getUniquePatientsWithNextAppointment().length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No patients found
                  </p>
                ) : (
                  <div className="space-y-3">
                    {getUniquePatientsWithNextAppointment().map((apt) => (
                      <div
                        key={apt.userId?._id || apt.userId}
                        className="border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-all duration-200 hover:scale-105"
                      >
                        <div>
                          <p className="font-semibold text-gray-800">
                            {apt.userId?.name || "Unknown Patient"}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center">
                            <FaClock className="mr-1" />
                            {apt.slotId || "TBD"} on{" "}
                            {new Date(apt.appointmentDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                          Next
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Available Slots */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Available Slots
                  </h2>
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <FaPlus />
                  </button>
                </div>
                {slots.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No slots available
                  </p>
                ) : (
                  <div className="space-y-3">
                    {slots.map((slot) => (
                      <div
                        key={slot._id}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:scale-105"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-gray-800">
                              {slot.day}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center">
                              <FaClock className="mr-1" />
                              {slot.startTime} - {slot.endTime}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              slot.isBooked
                                ? "bg-red-100 text-red-700 border border-red-200"
                                : "bg-green-100 text-green-700 border border-green-200"
                            }`}
                          >
                            {slot.isBooked ? "Booked" : "Available"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <FaCalendarCheck className="mr-2" />
                    Schedule Appointment
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                    <FaUsers className="mr-2" />
                    View Patients
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    <FaHistory className="mr-2" />
                    Medical Records
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;
