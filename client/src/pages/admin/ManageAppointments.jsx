import React, { useState, useEffect } from "react";
import {
  FaCalendarCheck,
  FaUser,
  FaUserMd,
  FaClock,
  FaDollarSign,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
} from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/appointments/all");
      console.log("Fetched appointments:", response.data);
      setAppointments(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      await axiosInstance.patch(`/appointments/${appointmentId}/status`, {
        status: newStatus,
      });

      // Update the appointment in the local state
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );

      console.log("Appointment status updated successfully");
    } catch (error) {
      console.error("Error updating appointment status:", error);
      setError("Failed to update appointment status");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
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

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading appointments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <FaTimesCircle className="text-4xl text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">Error</h3>
        <p className="text-gray-500">{error}</p>
        <button
          onClick={fetchAppointments}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">All Appointments</h2>
          <p className="text-gray-600 mt-1">
            Manage all appointments across the platform
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <FaCalendarCheck className="text-blue-500 text-xl" />
          <span className="text-gray-600 font-medium">
            {appointments.length} appointments
          </span>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-8">
          <FaCalendarCheck className="text-4xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No Appointments
          </h3>
          <p className="text-gray-500">No appointments have been booked yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUser className="text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.userId?.name || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.userId?.email || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUserMd className="text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.doctorId?.userId?.name || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.doctorId?.specialization || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaClock className="text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatDate(appointment.appointmentDate)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatTime(appointment.appointmentDate)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaDollarSign className="text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          ${appointment.amount}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(
                          appointment.paymentStatus
                        )}`}
                      >
                        {appointment.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowDetails(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Details"
                        >
                          <FaEye className="text-sm" />
                        </button>
                        {appointment.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                updateAppointmentStatus(
                                  appointment._id,
                                  "confirmed"
                                )
                              }
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Confirm"
                            >
                              <FaCheckCircle className="text-sm" />
                            </button>
                            <button
                              onClick={() =>
                                updateAppointmentStatus(
                                  appointment._id,
                                  "cancelled"
                                )
                              }
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Cancel"
                            >
                              <FaTimesCircle className="text-sm" />
                            </button>
                          </>
                        )}
                        {appointment.status === "confirmed" && (
                          <button
                            onClick={() =>
                              updateAppointmentStatus(
                                appointment._id,
                                "completed"
                              )
                            }
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Mark as Completed"
                          >
                            <FaCheckCircle className="text-sm" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {showDetails && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Appointment Details
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimesCircle className="text-xl" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Patient Information
                  </h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p>
                      <strong>Name:</strong>{" "}
                      {selectedAppointment.userId?.name || "N/A"}
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      {selectedAppointment.userId?.email || "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Doctor Information
                  </h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p>
                      <strong>Name:</strong>{" "}
                      {selectedAppointment.doctorId?.userId?.name || "N/A"}
                    </p>
                    <p>
                      <strong>Specialization:</strong>{" "}
                      {selectedAppointment.doctorId?.specialization || "N/A"}
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      {selectedAppointment.doctorId?.userId?.email || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Appointment Details
                </h4>
                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                  <p>
                    <strong>Date:</strong>{" "}
                    {formatDate(selectedAppointment.appointmentDate)}
                  </p>
                  <p>
                    <strong>Time:</strong>{" "}
                    {formatTime(selectedAppointment.appointmentDate)}
                  </p>
                  <p>
                    <strong>Amount:</strong> ${selectedAppointment.amount}
                  </p>
                  <p>
                    <strong>Status:</strong>
                    <span
                      className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        selectedAppointment.status
                      )}`}
                    >
                      {selectedAppointment.status}
                    </span>
                  </p>
                  <p>
                    <strong>Payment Status:</strong>
                    <span
                      className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(
                        selectedAppointment.paymentStatus
                      )}`}
                    >
                      {selectedAppointment.paymentStatus}
                    </span>
                  </p>
                  {selectedAppointment.paymentId && (
                    <p>
                      <strong>Payment ID:</strong>{" "}
                      {selectedAppointment.paymentId}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAppointments;
