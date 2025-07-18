import React, { useState } from "react";
import Footer from "../components/Footer";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaHeartbeat,
  FaComments,
  FaQuestionCircle,
  FaUserMd,
  FaShieldAlt,
  FaGlobe,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";

const ContactPage = () => {
  const contactInfo = [
    {
      icon: <FaPhone className="text-2xl text-blue-500" />,
      title: "Phone",
      details: ["+91 82399876-CARE", "108-HELP (Emergency)"],
      description: "Available 24/7 for emergencies",
    },
    {
      icon: <FaEnvelope className="text-2xl text-green-500" />,
      title: "Email",
      details: ["support@zocure.com", "emergency@zocure.com"],
      description: "We respond within 2 hours",
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl text-purple-500" />,
      title: "Address",
      details: ["123 Zocure Tower", "Vrindavan,Mathura-281406"],
      description: "Visit our headquarters",
    },
    {
      icon: <FaClock className="text-2xl text-orange-500" />,
      title: "Hours",
      details: ["24/7 Online Platform", "Mon-Fri: 8AM-8PM (Support)"],
      description: "Always here when you need us",
    },
  ];

  const faqs = [
    {
      question: "How do I book an appointment?",
      answer:
        "Simply log in to your account, browse available doctors, and select your preferred time slot. It's that easy!",
    },
    {
      question: "Is my health information secure?",
      answer:
        "Absolutely. We use enterprise-grade encryption and are fully HIPAA compliant to protect your privacy.",
    },
    {
      question: "Can I consult with doctors virtually?",
      answer:
        "Yes! We offer video consultations with licensed healthcare professionals from the comfort of your home.",
    },
    {
      question: "What if I need emergency care?",
      answer:
        "For emergencies, call our 24/7 emergency line or visit your nearest emergency room immediately.",
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
              <FaComments className="text-blue-500 mr-2" />
              <span className="text-blue-700 font-medium">Get in Touch</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              We're Here to
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Help You
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Have questions about our services? Need technical support? Or want
              to learn more about our platform? Our team is ready to assist you
              24/7.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center"
              >
                <div className="mb-6 flex justify-center">{info.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {info.title}
                </h3>
                <div className="space-y-1 mb-3">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-800 font-medium">
                      {detail}
                    </p>
                  ))}
                </div>
                <p className="text-gray-600 text-sm">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Quick answers to common questions about our services
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                    <FaQuestionCircle className="text-blue-500 mr-3" />
                    {faq.question}
                  </h3>
                  <p className="text-gray-700 leading-relaxed pl-8">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Experience Better Healthcare?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join thousands of patients who trust Zocure for their healthcare
              needs. Your health journey starts with a simple click.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-10 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl">
                Book Appointment
              </button>
              <button className="px-10 py-4 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:-translate-y-1">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ContactPage;
