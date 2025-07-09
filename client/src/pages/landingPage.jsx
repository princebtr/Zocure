// src/components/LandingPage.jsx
import React from "react";
import { FaCalendarCheck, FaUserMd, FaBell } from "react-icons/fa";

const LandingPage = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="pt-16 pb-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
              Book Your Doctor's Appointment{" "}
              <span className="text-blue-600">Online</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-lg">
              Zocure connects you with the best healthcare professionals in your
              area. Book appointments instantly, manage your health records, and
              get reminders - all in one place.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="px-8 py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition transform hover:-translate-y-1">
                Find a Doctor
              </button>
              <button className="px-8 py-3 border-2 border-blue-500 text-blue-500 rounded-full font-medium hover:bg-blue-50 transition transform hover:-translate-y-1">
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-blue-400 rounded-full absolute -top-6 -left-6 opacity-20"></div>
              <div className="w-64 h-64 md:w-80 md:h-80 bg-blue-600 rounded-full absolute -bottom-6 -right-6 opacity-20"></div>
              <div className="relative bg-white p-4 rounded-xl shadow-xl transform rotate-3">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 md:h-80" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Why Choose Zocure
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We make healthcare accessible and convenient for everyone
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaCalendarCheck className="text-4xl text-white" />,
                title: "Easy Booking",
                description:
                  "Book appointments in seconds with our simple and intuitive platform.",
              },
              {
                icon: <FaUserMd className="text-4xl text-white" />,
                title: "Verified Doctors",
                description:
                  "All healthcare professionals are verified and rated by patients.",
              },
              {
                icon: <FaBell className="text-4xl text-white" />,
                title: "Smart Reminders",
                description:
                  "Get timely reminders for your appointments via email and SMS.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:-translate-y-2"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mx-auto">
                  {feature.icon}
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-800 text-center">
                  {feature.title}
                </h3>
                <p className="mt-3 text-gray-600 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Book an appointment in just a few simple steps
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                number: 1,
                title: "Find a Doctor",
                description: "Search by specialty, location, or doctor's name.",
              },
              {
                number: 2,
                title: "Choose Time",
                description:
                  "Select a convenient date and time from available slots.",
              },
              {
                number: 3,
                title: "Book Appointment",
                description: "Confirm your appointment with a few clicks.",
              },
              {
                number: 4,
                title: "Visit Doctor",
                description:
                  "Receive reminders and visit the doctor at the scheduled time.",
              },
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                  {step.number}
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-800 text-center">
                  {step.title}
                </h3>
                <p className="mt-3 text-gray-600 text-center">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Patient Testimonials
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              See what our patients say about their experience
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                initials: "MR",
                name: "Michael Rodriguez",
                duration: "Patient for 2 years",
                comment:
                  "Zocure saved me so much time! Booking an appointment used to take multiple phone calls, but now I can do it in seconds from my phone.",
              },
              {
                initials: "SJ",
                name: "Sarah Johnson",
                duration: "Patient for 1 year",
                comment:
                  "The reminder feature is a lifesaver. I never miss appointments anymore, and the ability to reschedule online is incredibly convenient.",
              },
              {
                initials: "DC",
                name: "David Chen",
                duration: "Patient for 3 years",
                comment:
                  "Finding a specialist was so easy with Zocure. I was able to see doctor ratings and reviews before booking, which gave me confidence in my choice.",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                    {testimonial.initials}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-gray-800">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-500">{testimonial.duration}</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600 italic">
                  "{testimonial.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to Book Your Appointment?
          </h2>
          <p className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto">
            Join thousands of satisfied patients who have simplified their
            healthcare journey with Zocure
          </p>
          <button className="mt-8 px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-blue-50 transition transform hover:-translate-y-1">
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
