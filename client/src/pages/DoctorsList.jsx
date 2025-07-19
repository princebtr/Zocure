import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  FaUserMd,
  FaSearch,
  FaFilter,
  FaStar,
  FaClock,
  FaMapMarkerAlt,
  FaStethoscope,
  FaHeart,
  FaCalendarCheck,
  FaGraduationCap,
  FaAward,
  FaPhone,
  FaEnvelope,
  FaArrowRight,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("/doctors");
      setDoctors(response.data);
    } catch (error) {
      toast.error("Error fetching doctors");
    } finally {
      setLoading(false);
    }
  };

  const specializations = [
    "Cardiology",
    "Dermatology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "Oncology",
    "Gastroenterology",
    "Endocrinology",
    "Radiology",
    "General Medicine",
    "Emergency Medicine",
  ];

  const filteredDoctors = doctors
    .filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialization =
        !selectedSpecialization ||
        doctor.specialization === selectedSpecialization;
      return matchesSearch && matchesSpecialization;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "experience":
          return b.experience - a.experience;
        case "fees":
          return a.fees - b.fees;
        default:
          return 0;
      }
    });

  const handleBookAppointment = (doctorId) => {
    navigate(`/book-appointment/${doctorId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
        <div className="text-center">
          <div className="inline-flex items-center bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-4">
            <FaUserMd className="text-blue-500 mr-2" />
            <span className="text-blue-700 font-medium">
              Expert Healthcare Professionals
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Find Your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Doctor
            </span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with qualified healthcare professionals who are committed to
            providing exceptional care and personalized treatment plans.
          </p>
        </div>
      </div>

      {/* Search and Filters Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="">All Specializations</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="name">Sort by Name</option>
            <option value="experience">Sort by Experience</option>
            <option value="fees">Sort by Fees</option>
          </select>

          <div className="flex items-center justify-center bg-blue-50 rounded-xl px-4 py-3 border border-blue-200">
            <FaFilter className="mr-2 text-blue-600" />
            <span className="text-blue-700 font-semibold">
              {filteredDoctors.length} doctors found
            </span>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden group"
            >
              {/* Doctor Header */}
              <div className="relative p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-b border-gray-100">
                <div className="flex items-center space-x-4">
                  {doctor.image ? (
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="h-16 w-16 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white shadow-lg">
                      <FaUserMd className="text-white text-2xl" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      Dr. {doctor.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <FaStethoscope className="mr-1" />
                        {doctor.specialization}
                      </span>
                      {doctor.experience >= 10 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FaAward className="mr-1" />
                          Expert
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Doctor Details */}
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <FaGraduationCap className="text-blue-500 mr-3" />
                    <span className="text-sm">
                      {doctor.experience} years of experience
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="text-green-500 mr-3" />
                    <span className="text-sm">Medical Center, Suite 302</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaClock className="text-purple-500 mr-3" />
                    <span className="text-sm">Available for appointments</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="text-sm font-medium text-gray-700">
                        {doctor.rating ? doctor.rating.toFixed(1) : "4.8"}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        (120 reviews)
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-blue-600">
                        ${doctor.fees}
                      </span>
                      <span className="text-xs text-gray-500 block">
                        per consultation
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleBookAppointment(doctor._id)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center group-hover:shadow-lg"
                  >
                    <FaCalendarCheck className="mr-2" />
                    Book Appointment
                  </button>
                  <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <FaHeart className="text-gray-400 hover:text-red-500 transition-colors" />
                  </button>
                </div>

                {/* Quick Contact */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <FaPhone className="mr-1" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center">
                      <FaEnvelope className="mr-1" />
                      <span>
                        dr.{doctor.name.toLowerCase().replace(" ", ".")}
                        @zocure.com
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaUserMd className="text-3xl text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            No doctors found
          </h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search criteria or filters to find the right
            healthcare professional.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedSpecialization("");
              setSortBy("name");
            }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Stats Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 mt-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold mb-1">{doctors.length}+</div>
            <div className="text-blue-100 text-sm">Qualified Doctors</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">15+</div>
            <div className="text-blue-100 text-sm">Specializations</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">24/7</div>
            <div className="text-blue-100 text-sm">Support Available</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">98%</div>
            <div className="text-blue-100 text-sm">Patient Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorsList;
