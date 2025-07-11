import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosInstance";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
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
} from "react-icons/fa";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("today");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [doctorName, setDoctorName] = useState("");

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
      const doc = response.data;
      setDoctorName(doc.name || doc.userId?.name || "Doctor");
    } catch (error) {
      setDoctorName("Doctor");
    }
  };

  const fetchAppointments = async () => {
    try {
      console.log("Fetching appointments...");
      const token = localStorage.getItem("token");
      console.log("Token available:", !!token);

      const response = await axios.get("/doctors/my-appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched appointments:", response.data);
      setAppointments(response.data);
    } catch (error) {
      console.error(
        "Error fetching appointments:",
        error.response?.data || error.message
      );
      console.error("Full error:", error);
      toast.error("Error fetching appointments");
    }
  };

  const fetchSlots = async () => {
    try {
      console.log("Fetching slots...");
      const token = localStorage.getItem("token");
      console.log("Token available:", !!token);

      const response = await axios.get("/doctors/my-slots", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched slots:", response.data);
      setSlots(response.data);
    } catch (error) {
      console.error(
        "Error fetching slots:",
        error.response?.data || error.message
      );
      console.error("Full error:", error);
      toast.error("Error fetching slots");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/doctors/appointments/${appointmentId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Appointment ${newStatus} successfully`);
      fetchAppointments();
    } catch (error) {
      console.error(
        "Error updating appointment status:",
        error.response?.data || error.message
      );
      toast.error("Error updating appointment status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/");
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

  const sidebarItems = [
    { name: "Dashboard", icon: <FaHome />, active: true },
    { name: "Appointments", icon: <FaCalendarCheck />, active: false },
    { name: "Patients", icon: <FaUsers />, active: false },
    { name: "Schedule", icon: <FaClock />, active: false },
    { name: "Profile", icon: <FaUser />, active: false },
    { name: "Settings", icon: <FaCog />, active: false },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <FaUserMd className="text-blue-500 text-2xl mr-2" />
            <h1 className="text-xl font-bold text-gray-800">Doctor Portal</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <FaClose />
          </button>
        </div>

        <nav className="mt-8">
          {sidebarItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                item.active
                  ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                  : ""
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </a>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <FaSignOutAlt className="mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:ml-64">
        {/* Top Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden text-gray-500 hover:text-gray-700 mr-4"
              >
                <FaBars />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome back, {doctorName}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaCalendarCheck className="text-blue-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Appointments
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {appointments.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaCheck className="text-green-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Today's Appointments
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {todayAppointments.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <FaClock className="text-yellow-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      appointments.filter((apt) => apt.status === "pending")
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FaUsers className="text-purple-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Available Slots
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {slots.filter((slot) => !slot.isBooked).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Appointments Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    <button
                      onClick={() => setActiveTab("today")}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "today"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Today ({todayAppointments.length})
                    </button>
                    <button
                      onClick={() => setActiveTab("upcoming")}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "upcoming"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Upcoming ({upcomingAppointments.length})
                    </button>
                    <button
                      onClick={() => setActiveTab("past")}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "past"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Past ({pastAppointments.length})
                    </button>
                  </nav>
                </div>

                <div className="p-6">
                  {currentAppointments.length === 0 ? (
                    <div className="text-center py-8">
                      <FaCalendarCheck className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No {activeTab} appointments
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        You don't have any {activeTab} appointments.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentAppointments.map((appointment) => {
                        console.log("Rendering appointment:", appointment);
                        return (
                          <div
                            key={appointment._id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                      <FaUsers className="text-blue-500" />
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="text-lg font-medium text-gray-900">
                                      {appointment.userId?.name ||
                                        "Unknown Patient"}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                      {appointment.userId?.email || "No email"}
                                    </p>
                                    <p className="text-xs text-blue-600 mt-1">
                                      Patient ID:{" "}
                                      {appointment.userId?._id || "N/A"}
                                    </p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span
                                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                        appointment.status
                                      )}`}
                                    >
                                      {getStatusIcon(appointment.status)}
                                      <span className="ml-1">
                                        {appointment.status}
                                      </span>
                                    </span>
                                  </div>
                                </div>

                                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="flex items-center text-sm text-gray-600">
                                    <FaCalendarCheck className="mr-2 text-blue-500" />
                                    {new Date(
                                      appointment.appointmentDate
                                    ).toLocaleDateString()}
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <FaClock className="mr-2 text-blue-500" />
                                    {appointment.slotId || "TBD"}
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <FaMapMarkerAlt className="mr-2 text-blue-500" />
                                    {appointment.location || "Clinic"}
                                  </div>
                                </div>

                                {appointment.notes && (
                                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-700">
                                      {appointment.notes}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {activeTab !== "past" &&
                                appointment.status === "pending" && (
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() =>
                                        handleStatusUpdate(
                                          appointment._id,
                                          "confirmed"
                                        )
                                      }
                                      className="px-3 py-1 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
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
                                      className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                )}

                              {activeTab === "today" &&
                                appointment.status === "confirmed" && (
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() =>
                                        handleStatusUpdate(
                                          appointment._id,
                                          "completed"
                                        )
                                      }
                                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                                    >
                                      Complete
                                    </button>
                                  </div>
                                )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Available Slots Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <FaUsers className="text-blue-500 text-xl mr-2" />
                <h2 className="text-xl font-semibold">Available Slots</h2>
              </div>
              {slots.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No slots available
                </p>
              ) : (
                <div className="space-y-3">
                  {slots.map((slot) => (
                    <div
                      key={slot._id}
                      className="border border-gray-200 rounded-lg p-3"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-800">
                            {slot.day}
                          </p>
                          <p className="text-sm text-gray-600">
                            {slot.startTime} - {slot.endTime}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            slot.isBooked
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
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
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default DoctorDashboard;
