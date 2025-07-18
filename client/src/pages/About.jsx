import React from "react";
import Footer from "../components/Footer";
import {
  FaHeartbeat,
  FaUsers,
  FaAward,
  FaShieldAlt,
  FaGlobe,
  FaUserMd,
  FaLightbulb,
  FaHandshake,
  FaStethoscope,
} from "react-icons/fa";

const AboutPage = () => {
  const stats = [
    { number: "2019", label: "Founded", icon: <FaAward /> },
    { number: "50K+", label: "Patients Served", icon: <FaUsers /> },
    { number: "1000+", label: "Doctors", icon: <FaUserMd /> },
    { number: "25+", label: "Cities", icon: <FaGlobe /> },
  ];

  const values = [
    {
      icon: <FaHeartbeat className="text-4xl text-red-500" />,
      title: "Patient-Centric Care",
      description:
        "Every decision we make is centered around improving patient outcomes and experiences.",
    },
    {
      icon: <FaShieldAlt className="text-4xl text-blue-500" />,
      title: "Trust & Security",
      description:
        "Your health data is protected with enterprise-grade security and full HIPAA compliance.",
    },
    {
      icon: <FaLightbulb className="text-4xl text-yellow-500" />,
      title: "Innovation",
      description:
        "We continuously innovate to bring you the latest in healthcare technology and solutions.",
    },
    {
      icon: <FaHandshake className="text-4xl text-green-500" />,
      title: "Accessibility",
      description:
        "Making quality healthcare accessible to everyone, everywhere, at any time.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-emerald-600/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-8">
              <FaStethoscope className="text-blue-500 mr-2" />
              <span className="text-blue-700 font-medium">About Zocure</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transforming Healthcare
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                One Patient at a Time
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to make quality healthcare accessible,
              affordable, and convenient for everyone. Our platform connects
              patients with trusted healthcare providers through innovative
              technology.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-4">
                  <div className="text-3xl text-blue-500 group-hover:text-purple-500 transition-colors">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Zocure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group text-center p-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="mb-6 flex justify-center">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AboutPage;
