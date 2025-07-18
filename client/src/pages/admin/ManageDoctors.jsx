import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosInstance";
import { toast } from "react-hot-toast";
import {
  FaUserMd,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaFilter,
  FaEye,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaStar,
  FaClock,
  FaDollarSign,
} from "react-icons/fa";

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialization, setFilterSpecialization] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // table or grid

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/admin/doctors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched doctors:", response.data);
      setDoctors(response.data);
    } catch (error) {
      toast.error("Error fetching doctors");
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    console.log("Attempting to delete doctor with ID:", doctorId);
    if (
      window.confirm(
        "Are you sure you want to delete this doctor? This action cannot be undone."
      )
    ) {
      setDeleteLoading(doctorId);
      try {
        const token = localStorage.getItem("token");
        console.log("Making DELETE request to:", `/admin/doctors/${doctorId}`);
        const response = await axios.delete(`/admin/doctors/${doctorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Delete response:", response);
        toast.success("Doctor deleted successfully");
        fetchDoctors();
      } catch (error) {
        console.error("Error deleting doctor:", error);
        console.error("Error response:", error.response);
        toast.error(error.response?.data?.message || "Error deleting doctor");
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization =
      !filterSpecialization ||
      doctor.specialization
        .toLowerCase()
        .includes(filterSpecialization.toLowerCase());
    return matchesSearch && matchesSpecialization;
  });

  const specializations = [
    ...new Set(doctors.map((doctor) => doctor.specialization)),
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const DoctorCard = ({ doctor }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {doctor.image ? (
              <img
                src={doctor.image}
                alt={doctor.name}
                className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                <FaUserMd className="text-white text-lg" />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {doctor.name}
            </h3>
            <p className="text-sm text-gray-500">{doctor.specialization}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <FaEye className="text-sm" />
          </button>
          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
            <FaEdit className="text-sm" />
          </button>
          <button
            onClick={() => handleDeleteDoctor(doctor._id)}
            disabled={deleteLoading === doctor._id}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          >
            {deleteLoading === doctor._id ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
            ) : (
              <FaTrash className="text-sm" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <FaEnvelope className="text-gray-400" />
          <span>{doctor.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <FaClock className="text-gray-400" />
          <span>{doctor.experience} years experience</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <FaDollarSign className="text-gray-400" />
          <span>${doctor.fees} consultation fee</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Active
          </span>
          <div className="flex items-center space-x-1">
            <FaStar className="text-yellow-400 text-sm" />
            <span className="text-sm text-gray-600">Active</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Doctors</h2>
          <p className="text-gray-600 mt-1">
            Manage and monitor all registered doctors
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {viewMode === "table" ? "Grid View" : "Table View"}
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors by name, email, or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterSpecialization}
                onChange={(e) => setFilterSpecialization(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">All Specializations</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <FaPlus className="inline mr-2" />
              Add Doctor
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Doctors</p>
              <p className="text-2xl font-bold">{doctors.length}</p>
            </div>
            <FaUserMd className="text-2xl opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Active Doctors</p>
              <p className="text-2xl font-bold">{doctors.length}</p>
            </div>
            <FaUserMd className="text-2xl opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Specializations</p>
              <p className="text-2xl font-bold">{specializations.length}</p>
            </div>
            <FaUserMd className="text-2xl opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Revenue</p>
              <p className="text-2xl font-bold">
                $
                {doctors
                  .reduce((sum, doctor) => sum + (doctor.fees || 0), 0)
                  .toLocaleString()}
              </p>
            </div>
            <FaDollarSign className="text-2xl opacity-80" />
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialization
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fees
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDoctors.map((doctor) => (
                  <tr
                    key={doctor._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {doctor.image ? (
                            <img
                              src={doctor.image}
                              alt={doctor.name}
                              className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                              <FaUserMd className="text-white text-sm" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {doctor.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {doctor.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {doctor.specialization}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {doctor.experience} years
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${doctor.fees}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <FaEye className="text-sm" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <FaEdit className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDeleteDoctor(doctor._id)}
                          disabled={deleteLoading === doctor._id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deleteLoading === doctor._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <FaTrash className="text-sm" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <FaUserMd className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No doctors found
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {doctors.length === 0
              ? "Get started by adding your first doctor to the platform."
              : "Try adjusting your search criteria to find what you're looking for."}
          </p>
          {doctors.length === 0 && (
            <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <FaPlus className="inline mr-2" />
              Add First Doctor
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageDoctors;
