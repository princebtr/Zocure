import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialization, setSpecialization] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/doctors/all");
      setDoctors(response.data || []);
    } catch (error) {
      toast.error("Error fetching doctors");
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const name = doctor.userId?.name?.toLowerCase() || "";
    return (
      name.includes(searchTerm.toLowerCase()) &&
      (specialization === "" || doctor.specialization === specialization)
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Find a Doctor</h1>

      <div className="mb-8 flex gap-4">
        <input
          type="text"
          placeholder="Search by name"
          className="flex-1 p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-2 border rounded"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
        >
          <option value="">All Specializations</option>
          <option value="Cardiologist">Cardiologist</option>
          <option value="Dermatologist">Dermatologist</option>
          <option value="Pediatrician">Pediatrician</option>
          {/* Add more specializations */}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading doctors...</p>
      ) : filteredDoctors.length === 0 ? (
        <p className="text-center text-gray-500">No doctors found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold mb-2">
                Dr. {doctor.userId?.name || "N/A"}
              </h2>
              <p className="text-gray-600 mb-2">
                {doctor.specialization || "Specialization not set"}
              </p>
              <p className="text-gray-600 mb-2">
                Experience: {doctor.experience || 0} years
              </p>
              <p className="text-gray-600 mb-4">Fees: ₹{doctor.fees || 0}</p>
              <Link
                to={`/book-appointment/${doctor._id}`}
                className="block text-center bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Book Appointment
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorsList;
