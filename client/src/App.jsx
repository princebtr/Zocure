// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import LandingPage from "./pages/landingPage";
import Signup from "./pages/signUp";
import Login from "./pages/login";
import AdminLogin from "./pages/admin/AdminLogin";
import DoctorLogin from "./pages/doctor/DoctorLogin";
import MyProfile from "./pages/user/MyProfile";
import UserDashboard from "./pages/user/UserDashboard";
import DoctorsList from "./pages/DoctorsList";
import BookAppointment from "./pages/user/BookAppointment";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import AddDoctor from "./pages/admin/AddDoctor";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-white">
          <Toaster position="top-center" reverseOrder={false} />
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/doctor/login" element={<DoctorLogin />} />
              <Route path="/doctors" element={<DoctorsList />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* Protected Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected User Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <MyProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/book-appointment/:doctorId"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <BookAppointment />
                  </ProtectedRoute>
                }
              />

              {/* Protected Doctor Routes */}
              <Route
                path="/doctor/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["doctor"]}>
                    <DoctorDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
