// src/components/Footer.jsx
import React from "react";
import {
  FaHeartbeat,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 - Brand Info */}
          <div>
            <div className="flex items-center">
              <FaHeartbeat className="text-blue-500 text-3xl" />
              <h1 className="text-2xl font-bold text-white ml-2">
                Zoc<span className="text-red-500">ure</span>
              </h1>
            </div>
            <p className="mt-4">
              Making healthcare accessible and convenient through technology.
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Doctors
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Services */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition">
                  Doctor Appointment
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Health Checkup
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Medicine Delivery
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Lab Tests
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Health Records
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-blue-500" />
                <span>123 Zocure Tower Vrindavan, Mathura 281406</span>
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="mr-3 text-blue-500" />
                <span>+91 834-123-4567</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-blue-500" />
                <span>info@zocure.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p>
            &copy; 2023 Zocure. All rights reserved. Designed with ❤️ by Prince
            Chauhan for better healthcare.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
