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
} from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";

const UserDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/appointments/my-appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("User appointments:", response.data);
      setAppointments(response.data);
    } catch (error) {
      console.error(
        "Error fetching appointments:",
        error.response?.data || error.message
      );
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FaUser className="text-blue-500 text-3xl mr-3" />
              <h1 className="text-2xl font-bold text-gray-800">
                User Dashboard
              </h1>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors mr-4"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    appointments.filter((apt) => apt.status === "confirmed")
                      .length
                  }
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
                <FaUserMd className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Doctors Visited
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(appointments.map((apt) => apt.doctorId?._id)).size}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "upcoming"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Upcoming Appointments ({upcomingAppointments.length})
              </button>
              <button
                onClick={() => setActiveTab("past")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "past"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Past Appointments ({pastAppointments.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {currentAppointments.length === 0 ? (
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
                    onClick={() => navigate("/doctors")}
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
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <FaUserMd className="text-blue-500" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">
                              Dr.{" "}
                              {appointment.doctorId?.name ||
                                appointment.doctorId?.userId?.name ||
                                "Unknown Doctor"}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {appointment.doctorId?.specialization ||
                                "General Medicine"}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                appointment.status
                              )}`}
                            >
                              {getStatusIcon(appointment.status)}
                              <span className="ml-1">{appointment.status}</span>
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
                            {appointment.appointmentTime || "TBD"}
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

                      {activeTab === "upcoming" &&
                        appointment.status === "pending" && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handleCancelAppointment(appointment._id)
                              }
                              className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
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
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
