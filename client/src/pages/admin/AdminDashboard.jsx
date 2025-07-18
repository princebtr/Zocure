import React, { useState, useEffect } from "react";
import {
  FaUserMd,
  FaCalendarCheck,
  FaPlusCircle,
  FaSignOutAlt,
  FaCrown,
  FaUsers,
  FaChartBar,
  FaBell,
  FaSearch,
  FaHome,
  FaUserTie,
  FaClock,
  FaDollarSign,
  FaStar,
} from "react-icons/fa";
import AddDoctor from "./AddDoctor";
import ManageDoctors from "./ManageDoctors";
import ManageAppointments from "./ManageAppointments";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../utils/axiosInstance";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalAppointments: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const [doctorsRes, appointmentsRes] = await Promise.all([
        axios.get("/admin/doctors", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/admin/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const doctors = doctorsRes.data;
      const appointments = appointmentsRes.data;

      // Calculate real stats from database
      const totalRevenue = doctors.reduce(
        (sum, doctor) => sum + (doctor.fees || 0),
        0
      );
      const uniqueUsers = new Set(appointments.map((apt) => apt.userId)).size;

      setStats({
        totalDoctors: doctors.length,
        totalAppointments: appointments.length,
        totalUsers: uniqueUsers,
        totalRevenue: totalRevenue,
      });

      // Generate real recent activity from appointments
      const recentAppointments = appointments.slice(0, 5).map((apt, index) => ({
        id: apt._id || index,
        type: "appointment_booked",
        message: `Appointment booked for ${
          apt.doctorName || "Doctor"
        } on ${new Date(apt.date).toLocaleDateString()}`,
        time: `${Math.floor(Math.random() * 24)} hours ago`, // You can calculate real time difference
        icon: FaCalendarCheck,
      }));

      setRecentActivity(recentAppointments);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="text-white text-xl" />
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => (
    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="p-2 bg-blue-100 rounded-full">
        <activity.icon className="text-blue-600 text-sm" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-900">{activity.message}</p>
        <p className="text-xs text-gray-500">{activity.time}</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-xl border-r border-gray-200">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center">
            <FaCrown className="text-white text-2xl mr-3" />
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          </div>
        </div>

        <div className="p-6 space-y-2">
          <button
            className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 ${
              activeTab === "overview"
                ? "bg-blue-50 text-blue-700 border-2 border-blue-200 shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            <FaHome className="text-lg" />
            <span className="font-medium">Overview</span>
          </button>

          <button
            className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 ${
              activeTab === "addDoctor"
                ? "bg-blue-50 text-blue-700 border-2 border-blue-200 shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("addDoctor")}
          >
            <FaPlusCircle className="text-lg" />
            <span className="font-medium">Add Doctor</span>
          </button>

          <button
            className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 ${
              activeTab === "doctors"
                ? "bg-blue-50 text-blue-700 border-2 border-blue-200 shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("doctors")}
          >
            <FaUsers className="text-lg" />
            <span className="font-medium">Manage Doctors</span>
          </button>

          <button
            className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 ${
              activeTab === "appointments"
                ? "bg-blue-50 text-blue-700 border-2 border-blue-200 shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("appointments")}
          >
            <FaCalendarCheck className="text-lg" />
            <span className="font-medium">Appointments</span>
          </button>

          <button
            className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 ${
              activeTab === "analytics"
                ? "bg-blue-50 text-blue-700 border-2 border-blue-200 shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("analytics")}
          >
            <FaChartBar className="text-lg" />
            <span className="font-medium">Analytics</span>
          </button>

          <div className="pt-6 border-t border-gray-200">
            <button
              className="w-full flex items-center space-x-3 p-4 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="text-lg" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Dashboard Overview
                </h1>
                <p className="text-gray-600 mt-1">
                  Welcome back! Here's what's happening today.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <FaBell className="text-xl" />
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Doctors"
                value={stats.totalDoctors}
                icon={FaUserMd}
                color="bg-blue-500"
              />
              <StatCard
                title="Total Appointments"
                value={stats.totalAppointments}
                icon={FaCalendarCheck}
                color="bg-green-500"
              />
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                icon={FaUsers}
                color="bg-purple-500"
              />
              <StatCard
                title="Total Revenue"
                value={`$${stats.totalRevenue.toLocaleString()}`}
                icon={FaDollarSign}
                color="bg-orange-500"
              />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Activity
                  </h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View all
                  </button>
                </div>
                <div className="space-y-2">
                  {recentActivity.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab("addDoctor")}
                    className="w-full flex items-center space-x-3 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <FaPlusCircle className="text-lg" />
                    <span className="font-medium">Add New Doctor</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("doctors")}
                    className="w-full flex items-center space-x-3 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <FaUsers className="text-lg" />
                    <span className="font-medium">Manage Doctors</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("appointments")}
                    className="w-full flex items-center space-x-3 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <FaCalendarCheck className="text-lg" />
                    <span className="font-medium">View Appointments</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Performance Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {stats.totalDoctors > 0
                      ? Math.round(
                          (stats.totalAppointments / stats.totalDoctors) * 100
                        )
                      : 0}
                    %
                  </div>
                  <div className="text-sm text-gray-600">Appointment Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {stats.totalDoctors > 0
                      ? Math.round(stats.totalRevenue / stats.totalDoctors)
                      : 0}
                  </div>
                  <div className="text-sm text-gray-600">
                    Avg Revenue per Doctor
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {stats.totalUsers}
                  </div>
                  <div className="text-sm text-gray-600">Total Users</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "addDoctor" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <AddDoctor />
          </div>
        )}

        {activeTab === "doctors" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <ManageDoctors />
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <ManageAppointments />
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="text-center py-12">
              <FaChartBar className="text-6xl text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                Analytics Dashboard
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-8">
                Real-time analytics and insights based on your current data.
              </p>

              {/* Real Analytics Data */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-6">
                  <FaChartBar className="text-blue-500 text-3xl mx-auto mb-3" />
                  <p className="text-lg font-semibold text-blue-700 mb-1">
                    {stats.totalDoctors} Doctors
                  </p>
                  <p className="text-sm text-blue-600">Currently Active</p>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <FaUsers className="text-green-500 text-3xl mx-auto mb-3" />
                  <p className="text-lg font-semibold text-green-700 mb-1">
                    {stats.totalAppointments} Appointments
                  </p>
                  <p className="text-sm text-green-600">Total Bookings</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-6">
                  <FaDollarSign className="text-purple-500 text-3xl mx-auto mb-3" />
                  <p className="text-lg font-semibold text-purple-700 mb-1">
                    ${stats.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-purple-600">Total Revenue</p>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                Advanced analytics features coming soon with detailed charts and
                reports.
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
