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
import LandingPage from "./pages/landingPage";
import Signup from "./pages/signUp";
import Login from "./pages/login";
import MyProfile from "./pages/user/MyProfile";
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
              <Route path="/" element={<LandingPage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/doctors" element={<DoctorsList />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admindashboard" element={<AdminDashboard />} />
              <Route path="/adddoctor" element={<AddDoctor />} />

              {/* Protected User Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute roles={["user"]}>
                    <MyProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/book-appointment/:doctorId"
                element={
                  <ProtectedRoute roles={["user"]}>
                    <BookAppointment />
                  </ProtectedRoute>
                }
              />

              {/* Protected Doctor Routes */}
              <Route
                path="/doctor/dashboard"
                element={
                  <ProtectedRoute roles={["doctor"]}>
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
