const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Create payment intent for appointment booking
exports.createPaymentIntent = async (req, res) => {
  try {
    const { doctorId, slotId, appointmentDate } = req.body;
    const userId = req.user.id;

    console.log("Creating payment intent:", {
      doctorId,
      slotId,
      appointmentDate,
      userId,
    });

    // Find doctor and verify slot availability
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: doctor.fees * 100, // Convert to cents
      currency: "usd",
      metadata: {
        doctorId,
        userId,
        slotId,
        appointmentDate,
      },
    });

    console.log("Payment intent created:", paymentIntent.id);

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      amount: doctor.fees,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({
      message: "Error creating payment intent",
      error: error.message,
    });
  }
};

// Book an appointment after payment
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, slotId, appointmentDate, paymentIntentId } = req.body;
    const userId = req.user.id;

    console.log("Booking appointment:", {
      doctorId,
      slotId,
      appointmentDate,
      paymentIntentId,
      userId,
    });

    // Find doctor and verify slot availability
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ message: "Payment not successful" });
    }

    // Check if slot is still available
    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate: new Date(appointmentDate),
      slotId,
    });

    if (existingAppointment) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    // Create appointment
    const appointment = new Appointment({
      doctorId,
      userId,
      slotId,
      appointmentDate: new Date(appointmentDate),
      amount: doctor.fees,
      status: "confirmed",
      paymentStatus: "completed",
      paymentId: paymentIntentId,
    });
    await appointment.save();

    console.log("Appointment booked successfully:", appointment._id);

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({
      message: "Error booking appointment",
      error: error.message,
    });
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
          select: "name email",
        },
      })
      .sort({ appointmentDate: -1 });

    console.log("User appointments with populated data:", appointments);
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching user appointments:", error);
    res
      .status(500)
      .json({ message: "Error fetching appointments", error: error.message });
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

    res.status(200).json({
      message: "Payment verified and appointment confirmed",
      appointment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying payment", error: error.message });
  }
};

// Get all appointments (for admin)
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate({
        path: "doctorId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate({
        path: "userId",
        select: "name email",
      })
      .sort({ appointmentDate: -1 });

    console.log("All appointments fetched for admin:", appointments.length);
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    res
      .status(500)
      .json({ message: "Error fetching appointments", error: error.message });
  }
};

// Update appointment status (for admin)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = status;
    await appointment.save();

    console.log("Appointment status updated:", appointmentId, status);
    res.status(200).json({
      message: "Appointment status updated successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res
      .status(500)
      .json({
        message: "Error updating appointment status",
        error: error.message,
      });
  }
};
