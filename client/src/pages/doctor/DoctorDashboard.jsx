import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    fetchAppointments();
    fetchSlots();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/api/doctors/my-appointments', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAppointments(response.data);
    } catch (error) {
      toast.error('Error fetching appointments');
    }
  };

  const fetchSlots = async () => {
    try {
      const response = await axios.get('/api/doctors/my-slots', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSlots(response.data);
    } catch (error) {
      toast.error('Error fetching slots');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Doctor Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
          {appointments.map((appointment) => (
            <div key={appointment._id} className="border-b py-4">
              <p className="font-medium">Patient: {appointment.userId.name}</p>
              <p>Date: {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
              <p>Status: {appointment.status}</p>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Available Slots</h2>
          {slots.map((slot) => (
            <div key={slot._id} className="border-b py-4">
              <p>Day: {slot.day}</p>
              <p>Time: {slot.startTime} - {slot.endTime}</p>
              <p>Status: {slot.isBooked ? 'Booked' : 'Available'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;