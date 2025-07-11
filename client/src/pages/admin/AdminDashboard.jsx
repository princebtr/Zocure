import React, { useState } from "react";
import {
  FaUserMd,
  FaCalendarCheck,
  FaPlusCircle,
  FaSignOutAlt,
  FaCrown,
  FaUsers,
  FaChartBar,
} from "react-icons/fa";
import AddDoctor from "./AddDoctor";
import ManageDoctors from "./ManageDoctors";
import ManageAppointments from "./ManageAppointments";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("addDoctor");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <FaCrown className="text-blue-500 text-2xl mr-3" />
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <button
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeTab === "addDoctor"
                ? "bg-blue-100 text-blue-600 border border-blue-200"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("addDoctor")}
          >
            <FaPlusCircle className="text-lg" />
            <span>Add Doctor</span>
          </button>

          <button
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeTab === "doctors"
                ? "bg-blue-100 text-blue-600 border border-blue-200"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("doctors")}
          >
            <FaUsers className="text-lg" />
            <span>Manage Doctors</span>
          </button>

          <button
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeTab === "appointments"
                ? "bg-blue-100 text-blue-600 border border-blue-200"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("appointments")}
          >
            <FaCalendarCheck className="text-lg" />
            <span>All Appointments</span>
          </button>

          <button
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeTab === "analytics"
                ? "bg-blue-100 text-blue-600 border border-blue-200"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("analytics")}
          >
            <FaChartBar className="text-lg" />
            <span>Analytics</span>
          </button>

          <div className="pt-4 border-t border-gray-200">
            <button
              className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="text-lg" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === "addDoctor" && <AddDoctor />}
          {activeTab === "doctors" && <ManageDoctors />}
          {activeTab === "appointments" && <ManageAppointments />}
          {activeTab === "analytics" && (
            <div className="text-center py-8">
              <FaChartBar className="text-4xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Analytics Dashboard
              </h3>
              <p className="text-gray-500">
                View platform statistics and performance metrics.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
