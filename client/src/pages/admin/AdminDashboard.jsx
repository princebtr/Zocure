// src/pages/admin/AdminDashboard.jsx
import React, { useState } from "react";
import {
  FaUserMd,
  FaCalendarCheck,
  FaPlusCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import AddDoctor from "./AddDoctor"; // Component for adding doctors
// import ViewAppointments from "./ViewAppointments"; // Coming later

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("addDoctor");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-[#f5f9ff]">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-8">
          Admin <span className="text-red-500">Panel</span>
        </h2>
        <ul className="space-y-4">
          <li
            onClick={() => setActiveTab("addDoctor")}
            className={`flex items-center space-x-2 cursor-pointer p-2 rounded ${
              activeTab === "addDoctor"
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "text-gray-700"
            } hover:bg-blue-50`}
          >
            <FaPlusCircle /> <span>Add Doctor</span>
          </li>
          <li
            onClick={() => setActiveTab("appointments")}
            className="flex items-center space-x-2 text-gray-700 hover:bg-blue-50 p-2 rounded cursor-pointer"
          >
            <FaCalendarCheck /> <span>Appointments</span>
          </li>
          <li
            onClick={handleLogout}
            className="flex items-center space-x-2 text-red-500 hover:bg-red-50 p-2 rounded cursor-pointer mt-8"
          >
            <FaSignOutAlt /> <span>Logout</span>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {activeTab === "addDoctor" && <AddDoctor />}
        {activeTab === "appointments" && (
          <p>Appointments will show here (coming soon)</p>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
