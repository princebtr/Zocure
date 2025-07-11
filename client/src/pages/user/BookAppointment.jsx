import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import { toast } from "react-hot-toast";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  FaUserMd,
  FaClock,
  FaCalendarAlt,
  FaArrowLeft,
  FaStethoscope,
  FaMoneyBillWave,
  FaCreditCard,
  FaCheckCircle,
} from "react-icons/fa";

// Initialize Stripe
const stripePromise = loadStripe(
  import.meta.env.VITE_REACT_APP_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51Rj0ywQkLZso8O2TmOF7TPS93bZTK0nHtAZYfxT1X7vidXrXVp1e5YaYK1b4Az8iIbhusoOpFuymsHyp8zARmERA00GSBY5NZr"
);

const CheckoutForm = ({
  doctor,
  selectedSlot,
  selectedDate,
  onSuccess,
  onCancel,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (selectedSlot && selectedDate) {
      createPaymentIntent();
    }
  }, [selectedSlot, selectedDate]);

  const createPaymentIntent = async () => {
    try {
      const token = localStorage.getItem("token");
      const dateStr =
        typeof selectedDate === "string"
          ? selectedDate
          : selectedDate.toISOString().split("T")[0];

      const response = await axios.post(
        "/appointments/payment/create-intent",
        {
          doctorId: doctor._id,
          slotId:
            selectedSlot._id ||
            `${selectedSlot.startTime}-${selectedSlot.endTime}`,
          appointmentDate: dateStr,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setClientSecret(response.data.clientSecret);
    } catch (error) {
      console.error("Error creating payment intent:", error);
      toast.error(
        error.response?.data?.message || "Error creating payment intent"
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (error) {
        toast.error(error.message);
        setLoading(false);
      } else {
        if (paymentIntent.status === "succeeded") {
          await bookAppointment(paymentIntent.id);
        }
      }
    } catch (error) {
      console.error("Payment confirmation error:", error);
      toast.error("Payment processing failed");
      setLoading(false);
    }
  };

  const bookAppointment = async (paymentIntentId) => {
    try {
      const token = localStorage.getItem("token");
      const dateStr =
        typeof selectedDate === "string"
          ? selectedDate
          : selectedDate.toISOString().split("T")[0];

      await axios.post(
        "/appointments/book",
        {
          doctorId: doctor._id,
          slotId:
            selectedSlot._id ||
            `${selectedSlot.startTime}-${selectedSlot.endTime}`,
          appointmentDate: dateStr,
          paymentIntentId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Appointment booked successfully!");
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error booking appointment");
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-lg">
      <div className="flex items-center mb-6">
        <FaCreditCard className="text-blue-600 text-2xl mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Complete Payment</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-gray-100">
            <div>
              <p className="text-gray-600">Doctor</p>
              <h3 className="font-bold text-lg">
                Dr. {doctor.name || doctor.userId?.name || "Unknown Doctor"}
              </h3>
            </div>
            <div className="mt-2 md:mt-0">
              <p className="text-gray-600">Specialty</p>
              <p className="font-semibold text-blue-600">
                {doctor.specialization || "General Medicine"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-600">Date</p>
              <p className="font-medium">
                {typeof selectedDate === "string"
                  ? selectedDate
                  : selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
              </p>
            </div>

            <div>
              <p className="text-gray-600">Time Slot</p>
              <p className="font-medium">
                {selectedSlot.startTime} - {selectedSlot.endTime}
              </p>
            </div>

            <div>
              <p className="text-gray-600">Fee</p>
              <p className="font-bold text-lg text-blue-600">${doctor.fees}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Payment Details</h3>
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <CardElement options={cardElementOptions} />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Selection
          </button>
          <button
            type="submit"
            disabled={!stripe || loading}
            className={`flex items-center justify-center px-6 py-3 rounded-xl text-white font-medium transition-all ${
              loading
                ? "bg-blue-400"
                : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-md hover:shadow-lg"
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing Payment...
              </>
            ) : (
              <>
                <FaCheckCircle className="mr-2" />
                Pay ${doctor.fees} & Confirm Appointment
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    fetchDoctorDetails();
  }, [doctorId]);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    } else {
      setAvailableSlots([]);
      setSelectedSlot(null);
    }
  }, [selectedDate]);

  const fetchDoctorDetails = async () => {
    try {
      const response = await axios.get(`/doctors/${doctorId}`);
      console.log("Doctor details:", response.data);
      setDoctor(response.data);
    } catch (error) {
      console.error(
        "Error fetching doctor details:",
        error.response?.data || error.message
      );
      toast.error("Error fetching doctor details");
    }
  };

  const fetchAvailableSlots = async (date) => {
    setLoadingSlots(true);
    try {
      const dateStr =
        typeof date === "string" ? date : date.toISOString().split("T")[0];
      const response = await axios.get(
        `/doctors/${doctorId}/slots?date=${dateStr}`
      );
      setAvailableSlots(response.data);
    } catch (error) {
      toast.error("Error fetching available slots");
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSlotSelection = (slot) => {
    setSelectedSlot(slot);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setSelectedSlot(null);
    setSelectedDate("");
    navigate("/dashboard");
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setSelectedSlot(null);
  };

  if (!doctor) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Custom calendar styling
  const customCalendarStyles = `
    .react-calendar {
      width: 100%;
      max-width: 100%;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      font-family: 'Inter', sans-serif;
      padding: 16px;
    }
    
    .react-calendar__navigation {
      display: flex;
      height: 44px;
      margin-bottom: 1em;
    }
    
    .react-calendar__navigation button {
      min-width: 44px;
      background: none;
      border: none;
      color: #3182ce;
      font-weight: 600;
    }
    
    .react-calendar__navigation button:enabled:hover,
    .react-calendar__navigation button:enabled:focus {
      background-color: #ebf8ff;
      border-radius: 8px;
    }
    
    .react-calendar__navigation button[disabled] {
      background-color: #f0f0f0;
    }
    
    .react-calendar__month-view__weekdays {
      text-align: center;
      text-transform: uppercase;
      font-weight: 600;
      font-size: 0.75em;
      color: #4a5568;
      margin-bottom: 8px;
    }
    
    .react-calendar__month-view__weekdays__weekday {
      padding: 0.5em;
    }
    
    .react-calendar__month-view__days__day--weekend {
      color: #e53e3e;
    }
    
    .react-calendar__tile {
      max-width: 100%;
      padding: 10px 6.6667px;
      background: none;
      text-align: center;
      line-height: 16px;
      border-radius: 8px;
    }
    
    .react-calendar__tile:enabled:hover,
    .react-calendar__tile:enabled:focus {
      background-color: #ebf8ff;
      color: #3182ce;
    }
    
    .react-calendar__tile--now {
      background: #ebf8ff;
      color: #3182ce;
      font-weight: bold;
    }
    
    .react-calendar__tile--active {
      background: #3182ce;
      color: white;
    }
    
    .react-calendar__tile--active:enabled:hover,
    .react-calendar__tile--active:enabled:focus {
      background: #2b6cb0;
    }
  `;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-8 pt-24">
      <style>{customCalendarStyles}</style>

      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <FaArrowLeft className="mr-2" />
            Back to Doctors
          </button>
        </div>

        {!showPayment ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
              <h1 className="text-3xl font-bold">Book Appointment</h1>
              <p className="mt-2 text-blue-100">
                Select date and time for your consultation
              </p>
            </div>

            <div className="p-6">
              {/* Doctor Card */}
              <div className="flex flex-col md:flex-row items-start mb-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex-shrink-0 mr-6 mb-4 md:mb-0">
                  {doctor.image ? (
                    <img
                      src={doctor.image}
                      alt={`Dr. ${doctor.name || doctor.userId?.name}`}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover border-2 border-blue-200"
                    />
                  ) : (
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                      <FaUserMd className="text-white text-2xl" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        Dr.{" "}
                        {doctor.name || doctor.userId?.name || "Unknown Doctor"}
                      </h2>
                      <div className="flex items-center mt-1">
                        <FaStethoscope className="text-blue-500 mr-2" />
                        <span className="text-blue-600 font-medium">
                          {doctor.specialization || "General Medicine"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 flex items-center">
                      <FaMoneyBillWave className="text-blue-500 mr-2" />
                      <span className="text-xl font-bold text-blue-600">
                        ${doctor.fees || 0}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-500 mr-2 mt-0.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-gray-600">
                        Experience:{" "}
                        <span className="font-medium">
                          {doctor.experience || 0} years
                        </span>
                      </p>
                    </div>

                    <div className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-500 mr-2 mt-0.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-gray-600">
                        Location:{" "}
                        <span className="font-medium">
                          Medical Center, Suite 302
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Interface */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Calendar Section */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-6">
                    <FaCalendarAlt className="text-blue-600 text-xl mr-3" />
                    <h3 className="text-xl font-semibold">Select Date</h3>
                  </div>

                  <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    minDate={new Date()}
                    maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                    tileDisabled={({ date }) => {
                      const day = date.toLocaleDateString("en-US", {
                        weekday: "long",
                      });
                      return ![
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                      ].includes(day);
                    }}
                  />

                  {selectedDate && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg text-center">
                      <p className="text-blue-600 font-medium">
                        Selected:{" "}
                        {selectedDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                </div>

                {/* Time Slots */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-6">
                    <FaClock className="text-blue-600 text-xl mr-3" />
                    <h3 className="text-xl font-semibold">
                      Available Time Slots
                    </h3>
                  </div>

                  {!selectedDate ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-gray-400 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-gray-500 text-lg">
                        Select a date to see available time slots
                      </p>
                      <p className="text-gray-400 mt-2">
                        Choose a date from the calendar to proceed
                      </p>
                    </div>
                  ) : loadingSlots ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-gray-400 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-gray-500 text-lg">
                        No slots available for this date
                      </p>
                      <p className="text-gray-400 mt-2">
                        Please select a different date
                      </p>
                      <button
                        onClick={() => setSelectedDate("")}
                        className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                      >
                        Change Date
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot._id || `${slot.startTime}-${slot.endTime}`}
                          className={`p-4 rounded-xl text-center transition-all transform hover:-translate-y-0.5 ${
                            selectedSlot === slot
                              ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg"
                              : "bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300"
                          }`}
                          onClick={() => handleSlotSelection(slot)}
                        >
                          <div className="font-bold text-lg">
                            {slot.startTime}
                          </div>
                          <div className="text-sm mt-1">to {slot.endTime}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Elements stripe={stripePromise}>
            <CheckoutForm
              doctor={doctor}
              selectedSlot={selectedSlot}
              selectedDate={selectedDate}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;
