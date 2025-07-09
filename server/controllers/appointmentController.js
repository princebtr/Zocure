const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Book an appointment
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, slotId, appointmentDate } = req.body;
    const userId = req.user.id; // From auth middleware

    // Find doctor and verify slot availability
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const slot = doctor.availableSlots.id(slotId);
    if (!slot || slot.isBooked) {
      return res.status(400).json({ message: "Slot not available" });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: doctor.fees * 100, // Convert to cents
      currency: "usd",
      metadata: { doctorId, slotId, userId }
    });

    // Create appointment
    const appointment = new Appointment({
      doctorId,
      userId,
      slotId,
      appointmentDate,
      amount: doctor.fees
    });

    await appointment.save();

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({ message: "Error booking appointment", error: error.message });
  }
};

// Get user's appointments
exports.getMyAppointments = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware

    const appointments = await Appointment.find({ userId })
      .populate({
        path: "doctorId",
        populate: {
          path: "userId",
          select: "name email"
        }
      })
      .sort({ appointmentDate: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error: error.message });
  }
};

// Verify payment and confirm appointment
exports.verifyPayment = async (req, res) => {
  try {
    const { paymentIntentId, appointmentId } = req.body;

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ message: "Payment not successful" });
    }

    // Update appointment status
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = "confirmed";
    appointment.paymentStatus = "completed";
    appointment.paymentId = paymentIntentId;
    await appointment.save();

    // Update doctor's slot status
    const doctor = await Doctor.findById(appointment.doctorId);
    const slot = doctor.availableSlots.id(appointment.slotId);
    slot.isBooked = true;
    await doctor.save();

    res.status(200).json({ message: "Payment verified and appointment confirmed", appointment });
  } catch (error) {
    res.status(500).json({ message: "Error verifying payment", error: error.message });
  }
};