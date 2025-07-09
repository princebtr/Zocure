// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaMapMarkerAlt,
  FaVenusMars,
  FaCalendarAlt,
  FaHeartbeat,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function Profile() {
  const [user, setUser] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "(555) 123-4567",
    address: "123 Healthcare St, Medical City",
    gender: "male",
    dob: "1985-06-15",
    bloodGroup: "A+",
    allergies: "Penicillin, Pollen",
    conditions: "Asthma",
    medications: "Ventolin",
  });

  const [avatar, setAvatar] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [editing, setEditing] = useState(false);
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword({ ...password, [name]: value });
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
    setEditing(false);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      toast.error("New passwords don't match!");
      return;
    }
    toast.success("Password changed successfully!");
    setPassword({ current: "", new: "", confirm: "" });
  };

  // Mock medical records data
  const medicalRecords = [
    {
      id: 1,
      date: "2023-05-15",
      doctor: "Dr. Sarah Miller",
      diagnosis: "Annual Checkup",
      status: "Completed",
    },
    {
      id: 2,
      date: "2023-03-22",
      doctor: "Dr. Michael Chen",
      diagnosis: "Allergy Consultation",
      status: "Completed",
    },
    {
      id: 3,
      date: "2023-07-10",
      doctor: "Dr. James Wilson",
      diagnosis: "Asthma Follow-up",
      status: "Upcoming",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-32 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="bg-gray-200 border-2 border-dashed rounded-full w-full h-full flex items-center justify-center">
                      <FaUser className="text-gray-400 text-4xl" />
                    </div>
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-20 px-8 pb-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {user.name}
                </h1>
                <p className="text-gray-600 mt-1 flex items-center">
                  <FaHeartbeat className="text-red-500 mr-2" />
                  <span>Member since June 2022</span>
                </p>
              </div>

              <div className="mt-4 md:mt-0">
                <button
                  onClick={() => setEditing(!editing)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-medium hover:from-blue-600 hover:to-indigo-700 transition shadow-md hover:shadow-lg"
                >
                  {editing ? "Cancel Editing" : "Edit Profile"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto mb-8 bg-white rounded-xl shadow">
          <button
            onClick={() => setActiveTab("personal")}
            className={`px-6 py-4 font-medium text-sm md:text-base whitespace-nowrap ${
              activeTab === "personal"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Personal Info
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-6 py-4 font-medium text-sm md:text-base whitespace-nowrap ${
              activeTab === "security"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab("medical")}
            className={`px-6 py-4 font-medium text-sm md:text-base whitespace-nowrap ${
              activeTab === "medical"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Medical Info
          </button>
          <button
            onClick={() => setActiveTab("records")}
            className={`px-6 py-4 font-medium text-sm md:text-base whitespace-nowrap ${
              activeTab === "records"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Medical Records
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          {/* Personal Info */}
          {activeTab === "personal" && (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={user.name}
                      onChange={handleChange}
                      disabled={!editing}
                      className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                        editing
                          ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          : "border-transparent bg-gray-50"
                      }`}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      disabled={!editing}
                      className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                        editing
                          ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          : "border-transparent bg-gray-50"
                      }`}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={user.phone}
                      onChange={handleChange}
                      disabled={!editing}
                      className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                        editing
                          ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          : "border-transparent bg-gray-50"
                      }`}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={user.address}
                      onChange={handleChange}
                      disabled={!editing}
                      className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                        editing
                          ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          : "border-transparent bg-gray-50"
                      }`}
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaVenusMars className="text-gray-400" />
                    </div>
                    <select
                      name="gender"
                      value={user.gender}
                      onChange={handleChange}
                      disabled={!editing}
                      className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                        editing
                          ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          : "border-transparent bg-gray-50"
                      }`}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="dob"
                      value={user.dob}
                      onChange={handleChange}
                      disabled={!editing}
                      className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                        editing
                          ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          : "border-transparent bg-gray-50"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {editing && (
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-teal-700 transition shadow-md hover:shadow-lg"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <form onSubmit={handlePasswordSubmit}>
              <div className="max-w-xl mx-auto">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  Change Password
                </h3>

                <div className="space-y-6">
                  {/* Current Password */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="current"
                        value={password.current}
                        onChange={handlePasswordChange}
                        className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your current password"
                      />
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="new"
                        value={password.new}
                        onChange={handlePasswordChange}
                        className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Create a new password"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Minimum 8 characters with at least one number and one
                      symbol
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="confirm"
                        value={password.confirm}
                        onChange={handlePasswordChange}
                        className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Confirm your new password"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition shadow-md hover:shadow-lg"
                    >
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Security Settings
                  </h3>

                  <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div>
                      <h4 className="font-medium text-gray-800">
                        Two-Factor Authentication
                      </h4>
                      <p className="text-sm text-gray-600">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div>
                      <h4 className="font-medium text-gray-800">
                        Login Notifications
                      </h4>
                      <p className="text-sm text-gray-600">
                        Get notified when someone logs into your account
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* Medical Info */}
          {activeTab === "medical" && (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Blood Group */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Group
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <select
                      name="bloodGroup"
                      value={user.bloodGroup}
                      onChange={handleChange}
                      disabled={!editing}
                      className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                        editing
                          ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          : "border-transparent bg-gray-50"
                      }`}
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                {/* Allergies */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Allergies
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm3-1a1 1 0 11-2 0 1 1 0 012 0zm4 1a1 1 0 100-2 1 1 0 000 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="allergies"
                      value={user.allergies}
                      onChange={handleChange}
                      disabled={!editing}
                      className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                        editing
                          ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          : "border-transparent bg-gray-50"
                      }`}
                      placeholder="List any allergies"
                    />
                  </div>
                </div>

                {/* Medical Conditions */}
                <div className="relative md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medical Conditions
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <textarea
                      name="conditions"
                      value={user.conditions}
                      onChange={handleChange}
                      disabled={!editing}
                      rows="3"
                      className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                        editing
                          ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          : "border-transparent bg-gray-50"
                      }`}
                      placeholder="List any medical conditions"
                    />
                  </div>
                </div>

                {/* Medications */}
                <div className="relative md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Medications
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                      </svg>
                    </div>
                    <textarea
                      name="medications"
                      value={user.medications}
                      onChange={handleChange}
                      disabled={!editing}
                      rows="3"
                      className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                        editing
                          ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          : "border-transparent bg-gray-50"
                      }`}
                      placeholder="List current medications and dosages"
                    />
                  </div>
                </div>
              </div>

              {editing && (
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-teal-700 transition shadow-md hover:shadow-lg"
                  >
                    Save Medical Information
                  </button>
                </div>
              )}
            </form>
          )}

          {/* Medical Records */}
          {activeTab === "records" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Medical Records
                </h3>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium text-sm hover:from-blue-600 hover:to-indigo-700 transition shadow-md hover:shadow-lg">
                  Download All Records
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Doctor
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Diagnosis
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {medicalRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {record.date}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {record.doctor}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {record.diagnosis}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              record.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            View
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 bg-blue-50 rounded-xl p-6">
                <h4 className="text-lg font-medium text-blue-800 mb-3">
                  Upload New Medical Document
                </h4>
                <div className="flex items-center">
                  <input
                    type="file"
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                  <button className="ml-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium text-sm hover:from-blue-600 hover:to-indigo-700 transition">
                    Upload
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Emergency Card */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl shadow-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">Emergency Medical Card</h3>
              <p className="mt-2 max-w-xl">
                Important medical information for emergency situations
              </p>
            </div>
            <div>
              <button className="px-6 py-3 bg-white text-red-600 rounded-lg font-medium hover:bg-gray-100 transition shadow-md hover:shadow-lg">
                View Emergency Card
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
