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
  FaHeartbeat,
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
  const [user, setUser] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  // Replace newSlotDay and newSlotStart with multi-select state
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState("");
  const [scheduleSuccess, setScheduleSuccess] = useState("");
  // Add state for slot appointment modal
  const [showSlotAppointmentModal, setShowSlotAppointmentModal] =
    useState(false);
  const [slotAppointment, setSlotAppointment] = useState(null);
  const [slotAppointmentLoading, setSlotAppointmentLoading] = useState(false);

  const allDaysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const allTimeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00", // Last slot is 20:00-21:00
  ];

  useEffect(() => {
    fetchUserProfile();
    fetchDoctorProfile();
    fetchAppointments();
    fetchSlots();
  }, []);

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
      const response = await axios.get("/appointments/doctor/appointments", {
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

  const handleAppointmentUpdate = async (appointmentId, updateData) => {
    setUpdatingStatus(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `/appointments/doctor/appointments/${appointmentId}/status`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        // Update the appointment in the local state
        setAppointments((prev) =>
          prev.map((apt) =>
            apt._id === appointmentId
              ? { ...apt, ...response.data.appointment }
              : apt
          )
        );
        toast.success("Appointment updated successfully");
        setShowAppointmentModal(false);
        setSelectedAppointment(null);
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Failed to update appointment");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const openAppointmentModal = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `/appointments/doctor/appointments/${appointmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedAppointment(response.data);
      setShowAppointmentModal(true);
    } catch (error) {
      console.error("Error fetching appointment details:", error);
      toast.error("Failed to fetch appointment details");
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

  // Add multiple slots at once
  const handleAddMultipleSlots = () => {
    setScheduleError("");
    setScheduleSuccess("");
    if (selectedDays.length === 0 || selectedTimes.length === 0) {
      setScheduleError("Please select at least one day and one time slot.");
      return;
    }
    let newSlots = [...slots];
    selectedDays.forEach((day) => {
      selectedTimes.forEach((startTime) => {
        const endHour = parseInt(startTime.split(":")[0], 10) + 1;
        if (endHour > 21) return; // Only allow up to 20:00-21:00
        const endTime = `${endHour.toString().padStart(2, "0")}:00`;
        // Prevent duplicates
        if (
          !newSlots.some(
            (s) =>
              s.day === day &&
              s.startTime === startTime &&
              s.endTime === endTime
          )
        ) {
          newSlots.push({ day, startTime, endTime, isBooked: false });
        }
      });
    });
    setSlots(newSlots);
    setSelectedDays([]);
    setSelectedTimes([]);
  };

  // Remove a slot
  const handleRemoveSlot = (idx) => {
    setScheduleError("");
    setScheduleSuccess("");
    setSlots(slots.filter((_, i) => i !== idx));
  };

  // Save slots to backend
  const handleSaveSchedule = async () => {
    setScheduleLoading(true);
    setScheduleError("");
    setScheduleSuccess("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "/doctors/update-slots",
        { availableSlots: slots },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setScheduleSuccess("Schedule updated successfully.");
        fetchSlots();
      }
    } catch (error) {
      setScheduleError(
        error.response?.data?.message || "Failed to update schedule."
      );
    } finally {
      setScheduleLoading(false);
    }
  };

  // Function to open modal for a booked slot
  const openSlotAppointmentModal = async (slot) => {
    setSlotAppointmentLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/appointments/doctor/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Match by slotId string, fallback to day/startTime/endTime
      const found = response.data.find(
        (apt) =>
          (apt.slotId && String(apt.slotId) === String(slot._id)) ||
          (apt.slotId == null &&
            apt.appointmentDate &&
            apt.doctorId &&
            apt.doctorId._id &&
            slot.day &&
            slot.startTime &&
            slot.endTime &&
            apt.doctorId._id === slot.doctorId &&
            apt.day === slot.day &&
            apt.startTime === slot.startTime &&
            apt.endTime === slot.endTime)
      );
      if (found) {
        setSlotAppointment(found);
        setShowSlotAppointmentModal(true);
      } else {
        toast.error("No appointment found for this slot.");
      }
    } catch (error) {
      toast.error("Failed to fetch appointment for slot.");
    } finally {
      setSlotAppointmentLoading(false);
    }
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
    {
      name: "Schedule",
      icon: <FaClock />,
      key: "schedule",
      color: "text-orange-600",
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
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-purple-100">
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
                Doctor Dashboard
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

        {/* Doctor Profile */}
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
                {user?.name
                  ? user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : doctorName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
              </div>
            )}
            <div className="ml-3">
              <p className="font-semibold text-gray-800">
                {user?.name || doctorName}
              </p>
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
                  Welcome back, {user?.name || "Doctor"}
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
                              <button
                                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                onClick={() =>
                                  openAppointmentModal(appointment._id)
                                }
                              >
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
          {activeSection === "schedule" && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-6xl mx-auto w-full">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <FaClock className="mr-3 text-orange-500 text-2xl" /> Doctor
                Schedule
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                Select multiple days and time slots, then click <b>Add Slots</b>{" "}
                to add all combinations at once.
              </p>
              {scheduleError && (
                <div className="mb-4 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 text-base">
                  {scheduleError}
                </div>
              )}
              {scheduleSuccess && (
                <div className="mb-4 text-green-600 bg-green-50 p-3 rounded-lg border border-green-200 text-base">
                  {scheduleSuccess}
                </div>
              )}
              <div className="flex flex-col md:flex-row md:items-end gap-8 mb-8">
                <div className="flex-1">
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Days
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {allDaysOfWeek.map((day) => (
                      <label
                        key={day}
                        className={`flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg border ${
                          selectedDays.includes(day)
                            ? "bg-blue-100 border-blue-400"
                            : "bg-gray-50 border-gray-200"
                        } transition-all`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedDays.includes(day)}
                          onChange={() =>
                            setSelectedDays((prev) =>
                              prev.includes(day)
                                ? prev.filter((d) => d !== day)
                                : [...prev, day]
                            )
                          }
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span className="text-base font-medium">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Time Slots
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {allTimeSlots.map((time) => (
                      <label
                        key={time}
                        className={`flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg border ${
                          selectedTimes.includes(time)
                            ? "bg-blue-100 border-blue-400"
                            : "bg-gray-50 border-gray-200"
                        } transition-all`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedTimes.includes(time)}
                          onChange={() =>
                            setSelectedTimes((prev) =>
                              prev.includes(time)
                                ? prev.filter((t) => t !== time)
                                : [...prev, time]
                            )
                          }
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span className="text-base font-medium">
                          {time} -{" "}
                          {`${(parseInt(time.split(":")[0], 10) + 1)
                            .toString()
                            .padStart(2, "0")}:00`}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleAddMultipleSlots}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold mt-4 md:mt-0 shadow-md"
                >
                  <FaPlus className="inline mr-2" /> Add Slots
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg text-lg">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">
                        Day
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">
                        Start Time
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">
                        End Time
                      </th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {slots.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center text-gray-500 py-8 text-lg"
                        >
                          No slots added yet.
                        </td>
                      </tr>
                    ) : (
                      slots
                        .sort((a, b) =>
                          allDaysOfWeek.indexOf(a.day) !==
                          allDaysOfWeek.indexOf(b.day)
                            ? allDaysOfWeek.indexOf(a.day) -
                              allDaysOfWeek.indexOf(b.day)
                            : a.startTime.localeCompare(b.startTime)
                        )
                        .map((slot, idx) => (
                          <tr
                            key={idx}
                            className="border-t border-gray-100 hover:bg-blue-50 transition-all"
                          >
                            <td className="px-6 py-3 font-medium">
                              {slot.day}
                            </td>
                            <td className="px-6 py-3">{slot.startTime}</td>
                            <td className="px-6 py-3">{slot.endTime}</td>
                            <td className="px-6 py-3">
                              <button
                                onClick={() => handleRemoveSlot(idx)}
                                className="text-red-600 hover:text-red-800 text-xl"
                                title="Remove slot"
                              >
                                <FaTimes />
                              </button>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSaveSchedule}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold shadow-md disabled:opacity-50"
                  disabled={scheduleLoading}
                >
                  {scheduleLoading ? "Saving..." : "Save Schedule"}
                </button>
              </div>
            </div>
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
                          {slot.isBooked && (
                            <button
                              className="ml-4 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                              onClick={() => openSlotAppointmentModal(slot)}
                              disabled={slotAppointmentLoading}
                            >
                              {slotAppointmentLoading
                                ? "Loading..."
                                : "Update Status"}
                            </button>
                          )}
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

      {/* Appointment Management Modal */}
      {showAppointmentModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  Manage Appointment
                </h2>
                <button
                  onClick={() => {
                    setShowAppointmentModal(false);
                    setSelectedAppointment(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Patient Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Patient Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">
                        {selectedAppointment.userId?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">
                        {selectedAppointment.userId?.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">
                        {selectedAppointment.userId?.phone || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Appointment Date</p>
                      <p className="font-medium">
                        {new Date(
                          selectedAppointment.appointmentDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Management */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Appointment Status
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={selectedAppointment.status}
                      onChange={(e) =>
                        setSelectedAppointment({
                          ...selectedAppointment,
                          status: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="no-show">No Show</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="patientVisited"
                        checked={selectedAppointment.patientVisited || false}
                        onChange={(e) =>
                          setSelectedAppointment({
                            ...selectedAppointment,
                            patientVisited: e.target.checked,
                          })
                        }
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="patientVisited"
                        className="text-sm font-medium text-gray-700"
                      >
                        Patient Visited
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="checkupDone"
                        checked={selectedAppointment.checkupDone || false}
                        onChange={(e) =>
                          setSelectedAppointment({
                            ...selectedAppointment,
                            checkupDone: e.target.checked,
                          })
                        }
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="checkupDone"
                        className="text-sm font-medium text-gray-700"
                      >
                        Checkup Done
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Doctor Notes */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Doctor Notes
                </h3>
                <textarea
                  value={selectedAppointment.doctorNotes || ""}
                  onChange={(e) =>
                    setSelectedAppointment({
                      ...selectedAppointment,
                      doctorNotes: e.target.value,
                    })
                  }
                  placeholder="Add notes about the appointment..."
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              {/* Consultation Notes */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Consultation Notes
                </h3>
                <textarea
                  value={selectedAppointment.consultationNotes || ""}
                  onChange={(e) =>
                    setSelectedAppointment({
                      ...selectedAppointment,
                      consultationNotes: e.target.value,
                    })
                  }
                  placeholder="Add consultation details..."
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowAppointmentModal(false);
                    setSelectedAppointment(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    handleAppointmentUpdate(selectedAppointment._id, {
                      status: selectedAppointment.status,
                      patientVisited: selectedAppointment.patientVisited,
                      checkupDone: selectedAppointment.checkupDone,
                      doctorNotes: selectedAppointment.doctorNotes,
                      consultationNotes: selectedAppointment.consultationNotes,
                    })
                  }
                  disabled={updatingStatus}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updatingStatus ? "Updating..." : "Update Appointment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Slot Appointment Management Modal */}
      {showSlotAppointmentModal && slotAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                Update Appointment Status
              </h2>
              <button
                onClick={() => {
                  setShowSlotAppointmentModal(false);
                  setSlotAppointment(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Patient Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">
                        {slotAppointment.userId?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">
                        {slotAppointment.userId?.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">
                        {slotAppointment.userId?.phone || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Appointment Date</p>
                      <p className="font-medium">
                        {new Date(
                          slotAppointment.appointmentDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Status Management */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Appointment Status
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={slotAppointment.status}
                      onChange={(e) =>
                        setSlotAppointment({
                          ...slotAppointment,
                          status: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Doctor Notes
                    </label>
                    <textarea
                      value={slotAppointment.doctorNotes || ""}
                      onChange={(e) =>
                        setSlotAppointment({
                          ...slotAppointment,
                          doctorNotes: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={slotAppointment.checkupDone || false}
                      onChange={(e) =>
                        setSlotAppointment({
                          ...slotAppointment,
                          checkupDone: e.target.checked,
                        })
                      }
                      id="checkupDone"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="checkupDone"
                      className="text-sm text-gray-700"
                    >
                      Checkup Done
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-2"
                  onClick={async () => {
                    // Save status update
                    try {
                      setSlotAppointmentLoading(true);
                      const token = localStorage.getItem("token");
                      await axios.patch(
                        `/appointments/doctor/appointments/${slotAppointment._id}/status`,
                        {
                          status: slotAppointment.status,
                          doctorNotes: slotAppointment.doctorNotes,
                          checkupDone: slotAppointment.checkupDone,
                        },
                        { headers: { Authorization: `Bearer ${token}` } }
                      );
                      toast.success("Appointment status updated");
                      setShowSlotAppointmentModal(false);
                      setSlotAppointment(null);
                      fetchAppointments();
                    } catch (error) {
                      toast.error("Failed to update appointment status");
                    } finally {
                      setSlotAppointmentLoading(false);
                    }
                  }}
                  disabled={slotAppointmentLoading}
                >
                  {slotAppointmentLoading ? "Saving..." : "Save"}
                </button>
                <button
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  onClick={() => {
                    setShowSlotAppointmentModal(false);
                    setSlotAppointment(null);
                  }}
                  disabled={slotAppointmentLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
