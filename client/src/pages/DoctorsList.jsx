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

  const services = [
    {
      name: "Consultation",
      description: "General medical consultation and diagnosis",
      icon: "🏥",
    },
    {
      name: "Diagnostic Tests",
      description: "Blood tests, imaging, and other diagnostic procedures",
      icon: "🔬",
    },
    {
      name: "Treatment Plans",
      description: "Comprehensive treatment and recovery plans",
      icon: "📋",
    },
    {
      name: "Follow-up Care",
      description: "Regular check-ups and monitoring",
      icon: "🔄",
    },
    {
      name: "Emergency Care",
      description: "Urgent medical attention when needed",
      icon: "🚨",
    },
    {
      name: "Preventive Care",
      description: "Vaccinations and preventive health measures",
      icon: "🛡️",
    },
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Find Your Doctor
          </h1>
          <p className="text-gray-600">
            Choose from our qualified healthcare professionals
          </p>
        </div>

        {/* Services Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">{service.icon}</span>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {service.name}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="experience">Sort by Experience</option>
              <option value="fees">Sort by Fees</option>
            </select>

            <div className="text-sm text-gray-600 flex items-center">
              <FaFilter className="mr-2" />
              {filteredDoctors.length} doctors found
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col items-center"
            >
              {doctor.image ? (
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="h-20 w-20 rounded-full object-cover border mb-3"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <FaUserMd className="text-blue-500 text-3xl" />
                </div>
              )}
              <div className="font-bold text-lg mb-1">{doctor.name}</div>
              <div className="text-gray-600 mb-2">{doctor.specialization}</div>
              <div className="text-gray-500 text-sm mb-2">
                Experience: {doctor.experience} years
              </div>
              <div className="text-gray-500 text-sm mb-4">
                Fees: ${doctor.fees}
              </div>
              <button
                onClick={() => handleBookAppointment(doctor._id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <FaUserMd className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No doctors found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;
