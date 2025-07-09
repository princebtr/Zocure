import React from "react";

const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Contact Us</h1>
      <p className="text-gray-700 mb-4">You can reach out to us at:</p>
      <ul className="text-gray-700 list-disc list-inside">
        <li>Email: support@zocure.com</li>
        <li>Phone: +91-1234567890</li>
        <li>Address: 123, Zocure Street, Health City, India</li>
      </ul>
    </div>
  );
};

export default Contact;
