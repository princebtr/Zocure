import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('your_publishable_key');

const BookAppointment = () => {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchDoctorDetails();
  }, [doctorId]);

  const fetchDoctorDetails = async () => {
    try {
      const response = await axios.get(`/api/doctors/${doctorId}`);
      setDoctor(response.data);
    } catch (error) {
      toast.error('Error fetching doctor details');
    }
  };

  const handleBooking = async () => {
    try {
      const response = await axios.post('/api/appointments/book', {
        doctorId,
        slotId: selectedSlot._id,
        appointmentDate: selectedDate
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error('Error booking appointment');
    }
  };

  if (!doctor) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-6">Book Appointment</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Dr. {doctor.userId.name}</h2>
          <p className="text-gray-600">{doctor.specialization}</p>
          <p className="text-gray-600">Experience: {doctor.experience} years</p>
          <p className="text-gray-600">Fees: ${doctor.fees}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Select Date</h3>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Available Slots</h3>
          <div className="grid grid-cols-2 gap-4">
            {doctor.availableSlots.map((slot) => (
              <button
                key={slot._id}
                className={`p-2 rounded ${selectedSlot === slot ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                onClick={() => setSelectedSlot(slot)}
                disabled={slot.isBooked}
              >
                {slot.startTime} - {slot.endTime}
              </button>
            ))}
          </div>
        </div>

        <button
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          onClick={handleBooking}
          disabled={!selectedSlot || !selectedDate}
        >
          Book and Pay
        </button>
      </div>
    </div>
  );
};

export default BookAppointment;