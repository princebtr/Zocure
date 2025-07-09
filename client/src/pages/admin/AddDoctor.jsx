import React, { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "../../utils/axiosInstance";

const AddDoctor = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    specialization: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/admin/add-doctor", form);
      toast.success("Doctor added successfully");
      setForm({ name: "", email: "", specialization: "", password: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add doctor");
    }
  };

  return (
    <div className="max-w-xl bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Add New Doctor</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Doctor's Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          name="specialization"
          placeholder="Specialization"
          value={form.specialization}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          name="password"
          placeholder="Temporary Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Add Doctor
        </button>
      </form>
    </div>
  );
};

export default AddDoctor;
