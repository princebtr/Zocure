import React, { useState } from "react";
import axios from "../../utils/axiosInstance";
import { toast } from "react-hot-toast";
import {
  FaUserMd,
  FaUpload,
  FaImage,
  FaUser,
  FaEnvelope,
  FaLock,
  FaStethoscope,
  FaClock,
  FaDollarSign,
  FaPlus,
  FaTimes,
} from "react-icons/fa";

const AddDoctor = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    experience: "",
    fees: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
    "Ophthalmology",
    "ENT (Ear, Nose, Throat)",
    "Gynecology",
    "Urology",
    "Pulmonology",
    "Rheumatology",
    "Nephrology",
    "Hematology",
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setFormData({
        ...formData,
        image: file,
      });

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("password", formData.password);
      submitData.append("specialization", formData.specialization);
      submitData.append("experience", formData.experience);
      submitData.append("fees", formData.fees);

      if (formData.image) {
        submitData.append("image", formData.image);
      }

      const response = await axios.post("/admin/add-doctor", submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        toast.success("Doctor added successfully");
        setFormData({
          name: "",
          email: "",
          password: "",
          specialization: "",
          experience: "",
          fees: "",
          image: null,
        });
        setImagePreview(null);
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : null) ||
        error.message ||
        JSON.stringify(error) ||
        "Error adding doctor";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      specialization: "",
      experience: "",
      fees: "",
      image: null,
    });
    setImagePreview(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-100 rounded-full">
            <FaUserMd className="text-blue-600 text-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add New Doctor</h2>
            <p className="text-gray-600">
              Register a new doctor to the platform
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <FaUser className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Basic Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUser className="inline mr-2 text-gray-400" />
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter doctor's full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaEnvelope className="inline mr-2 text-gray-400" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="doctor@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaLock className="inline mr-2 text-gray-400" />
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Minimum 6 characters"
                required
                minLength={6}
              />
            </div>
          </div>
        </div>

        {/* Professional Information Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <FaStethoscope className="text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Professional Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaStethoscope className="inline mr-2 text-gray-400" />
                Specialization *
              </label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              >
                <option value="">Select Specialization</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaClock className="inline mr-2 text-gray-400" />
                Years of Experience *
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="0"
                required
                min="0"
                max="50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaDollarSign className="inline mr-2 text-gray-400" />
                Consultation Fees (USD) *
              </label>
              <input
                type="number"
                name="fees"
                value={formData.fees}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="0.00"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <FaImage className="text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Profile Image
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="flex items-center px-6 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <FaUpload className="mr-3 text-blue-500 text-lg" />
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Choose Image
                  </span>
                  <p className="text-xs text-gray-500">
                    JPG, PNG, GIF up to 5MB
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {formData.image && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg">
                  <span className="text-sm font-medium">
                    ✓ {formData.image.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, image: null });
                      setImagePreview(null);
                    }}
                    className="text-green-600 hover:text-green-800"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                </div>
              )}
            </div>

            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Preview:
                </p>
                <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={clearForm}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <FaTimes className="inline mr-2" />
            Clear Form
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding Doctor...
              </>
            ) : (
              <>
                <FaPlus className="mr-2" />
                Add Doctor
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;
