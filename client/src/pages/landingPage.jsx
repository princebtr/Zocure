// src/components/LandingPage.jsx
import React from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarCheck,
  FaUserMd,
  FaStethoscope,
  FaHeartbeat,
  FaAmbulance,
  FaShieldAlt,
  FaClock,
  FaArrowRight,
  FaPlay,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleActionClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const features = [
    {
      icon: <FaCalendarCheck className="text-3xl text-blue-500" />,
      title: "Instant Booking",
      description: "Book appointments in seconds with real-time availability",
    },
    {
      icon: <FaUserMd className="text-3xl text-emerald-500" />,
      title: "Expert Doctors",
      description: "Connect with verified healthcare professionals",
    },
    {
      icon: <FaStethoscope className="text-3xl text-purple-500" />,
      title: "Virtual Consultations",
      description: "Get medical advice from anywhere, anytime",
    },
    {
      icon: <FaAmbulance className="text-3xl text-red-500" />,
      title: "Emergency Support",
      description: "24/7 emergency assistance when you need it most",
    },
  ];

  const stats = [
    { number: "10K+", label: "Happy Patients" },
    { number: "500+", label: "Expert Doctors" },
    { number: "24/7", label: "Support" },
    { number: "99%", label: "Success Rate" },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      content:
        "Zocure made booking my appointment so simple. The doctors are amazing!",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face&auto=format",
    },
    {
      name: "Michael Chen",
      role: "Patient",
      content:
        "Best healthcare platform I've used. Quick, reliable, and professional.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face&auto=format",
    },
    {
      name: "Emily Rodriguez",
      role: "Patient",
      content:
        "The virtual consultation feature is a game-changer. Highly recommended!",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face&auto=format",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-emerald-600/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center">
            {/* Main Heading */}
            <div className="inline-flex items-center bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-8">
              <FaHeartbeat className="text-blue-500 mr-2" />
              <span className="text-blue-700 font-medium">
                Trusted by 10,000+ patients
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Your Health,
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Our Priority
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Experience healthcare like never before. Book appointments
              instantly, consult with experts, and manage your health
              seamlessly.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={handleActionClick}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center"
              >
                Get Started Now
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleActionClick}
                className="group px-8 py-4 bg-white text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl border-2 border-gray-200 flex items-center justify-center"
              >
                <FaPlay className="mr-2 text-blue-500" />
                Watch Demo
              </button>
            </div>

            {/* Hero Image */}
            <div className="relative max-w-4xl mx-auto">
              <div className="relative bg-white rounded-3xl shadow-2xl p-2 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=500&fit=crop&auto=format"
                  alt="Modern Healthcare"
                  className="w-full h-64 md:h-80 object-cover rounded-2xl"
                />

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-emerald-500 text-white p-3 rounded-full shadow-lg">
                  <FaCheckCircle className="text-xl" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white p-3 rounded-full shadow-lg">
                  <FaHeartbeat className="text-xl animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Zocure?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of healthcare with our innovative platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="mb-6 p-4 bg-gray-50 rounded-full w-fit group-hover:bg-blue-50 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our Patients Say
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from real people who trust Zocure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                  />
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>

                <p className="text-gray-700 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="py-20 bg-gradient-to-r from-red-500 to-pink-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
              <FaAmbulance className="text-4xl" />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              24/7 Emergency Support
            </h2>

            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              Medical emergencies don't wait. Neither do we. Get immediate
              assistance anytime, anywhere.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleActionClick}
                className="px-8 py-4 bg-white text-red-600 rounded-full font-bold hover:bg-red-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                Get Emergency Help
              </button>

              <button
                onClick={handleActionClick}
                className="px-8 py-4 border-2 border-white text-white rounded-full font-bold hover:bg-white hover:text-red-600 transition-all duration-300 transform hover:-translate-y-1"
              >
                Call Now: +1 (555) 911-HELP
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Healthcare Experience?
            </h2>

            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join thousands of satisfied patients who've already made the
              switch to smarter healthcare.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleActionClick}
                className="group px-10 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center"
              >
                Start Your Journey
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleActionClick}
                className="px-10 py-4 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:-translate-y-1"
              >
                Learn More
              </button>
            </div>

            <div className="mt-12 flex items-center justify-center space-x-8 text-blue-200">
              <div className="flex items-center">
                <FaShieldAlt className="mr-2" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center">
                <FaClock className="mr-2" />
                <span>24/7 Available</span>
              </div>
              <div className="flex items-center">
                <FaCheckCircle className="mr-2" />
                <span>Verified Doctors</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default LandingPage;
