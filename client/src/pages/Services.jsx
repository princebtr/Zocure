import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaAmbulance,
  FaFlask,
  FaBed,
  FaBrain,
  FaSyringe,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowRight,
  FaCheckCircle,
  FaShieldAlt,
} from "react-icons/fa";

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: <FaAmbulance className="text-4xl text-red-500" />,
      title: "24x7 Ambulance Booking",
      description:
        "Emergency ambulance services with quick response and trained paramedics.",
      features: [
        "Instant booking",
        "Live GPS tracking",
        "Paramedic support",
        "Life support equipment",
      ],
      action: "Book Ambulance",
      gradient: "from-red-500 to-red-600",
    },
    {
      icon: <FaFlask className="text-4xl text-blue-500" />,
      title: "Home Sample Collection",
      description:
        "Certified phlebotomists collect samples at home with timely reports.",
      features: [
        "Sterile & safe collection",
        "Flexible timing",
        "Online reports",
        "Popular test packages",
      ],
      action: "Schedule Collection",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: <FaBed className="text-4xl text-green-500" />,
      title: "Hospital Bed Availability",
      description:
        "Real-time tracking of hospital beds for emergencies or planned admission.",
      features: [
        "Live bed status",
        "Partnered hospitals",
        "Instant booking",
        "Transparent pricing",
      ],
      action: "Check Availability",
      gradient: "from-green-500 to-green-600",
    },
    {
      icon: <FaBrain className="text-4xl text-purple-500" />,
      title: "Mental Health Counseling",
      description:
        "Licensed counselors offering virtual support and therapy sessions.",
      features: [
        "Video sessions",
        "Crisis help",
        "Confidential care",
        "Ongoing support",
      ],
      action: "Book Session",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: <FaSyringe className="text-4xl text-yellow-500" />,
      title: "Vaccination Scheduler",
      description:
        "Plan your vaccines, track immunization records, and get reminders.",
      features: [
        "All-age vaccines",
        "Auto reminders",
        "Safe scheduling",
        "Doctor-approved plans",
      ],
      action: "Schedule Vaccination",
      gradient: "from-yellow-500 to-yellow-600",
    },
  ];

  const handleServiceAction = (title) => {
    navigate("/dashboard");
    console.log("Service selected:", title);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero */}
      <section className="pt-24 pb-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-emerald-600/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <div className="inline-flex items-center bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6">
            <FaShieldAlt className="text-blue-500 mr-2" />
            <span className="text-blue-700 font-medium">
              Trusted Medical Services
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Explore Our{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Services
            </span>
          </h1>
          <p className="text-lg text-gray-600 mt-4 max-w-xl mx-auto">
            Quality care, on time — wherever you are.
          </p>
        </div>
      </section>

      {/* Service Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group"
              >
                <div className="mb-4 p-4 bg-gray-50 rounded-full w-fit group-hover:bg-opacity-20">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {service.description}
                </p>
                <ul className="space-y-2 text-sm mb-6">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-600">
                      <FaCheckCircle className="text-green-500 mr-2 text-sm" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleServiceAction(service.title)}
                  className={`w-full bg-gradient-to-r ${service.gradient} text-white py-2 px-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center`}
                >
                  {service.action}
                  <FaArrowRight className="ml-2" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency CTA */}
      <section className="py-16 bg-gradient-to-r from-red-500 to-red-600 text-white text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-bold mb-4">Emergency? We’re Ready.</h2>
          <p className="text-lg mb-6">
            Call our 24x7 helpline or request an ambulance directly from your
            dashboard.
          </p>
          <button className="bg-white text-red-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
            Call Emergency Services
          </button>
        </div>
      </section>
    </div>
  );
};

export default Services;
