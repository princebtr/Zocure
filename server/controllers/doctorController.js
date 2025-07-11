const Doctor = require("../models/Doctor");
const User = require("../models/User");
const Appointment = require("../models/Appointment");

// Admin: Add a new doctor
exports.addDoctor = async (req, res) => {
  try {
    const { userId, specialization, experience, fees, availableSlots } =
      req.body;

    // Verify user exists and is a doctor
    const user = await User.findById(userId);
    if (!user || user.role !== "doctor") {
      return res.status(400).json({ message: "Invalid user or role" });
    }

    // Check if doctor profile already exists
    const existingDoctor = await Doctor.findOne({ userId });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor profile already exists" });
    }

    const doctor = new Doctor({
      userId,
      specialization,
      experience,
      fees,
      availableSlots,
    });

    await doctor.save();
    res.status(201).json({ message: "Doctor added successfully", doctor });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding doctor", error: error.message });
  }
};

// Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("userId", "name email");

    // Transform the data to match frontend expectations
    const doctorsWithUserData = doctors.map((doctor) => ({
      _id: doctor._id,
      name: doctor.userId.name,
      email: doctor.userId.email,
      specialization: doctor.specialization,
      experience: doctor.experience,
      fees: doctor.fees,
      image: doctor.image || null,
    }));

    res.status(200).json(doctorsWithUserData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching doctors", error: error.message });
  }
};

// Get doctor by ID
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      "userId",
      "name email"
    );
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching doctor", error: error.message });
  }
};

// Doctor: Update available slots
exports.updateSlots = async (req, res) => {
  try {
    const doctorId = req.user.id; // From auth middleware
    const { availableSlots } = req.body;

    const doctor = await Doctor.findOne({ userId: doctorId });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    doctor.availableSlots = availableSlots;
    await doctor.save();

    res.status(200).json({ message: "Slots updated successfully", doctor });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating slots", error: error.message });
  }
};

// Doctor: Get my appointments
exports.getMyAppointments = async (req, res) => {
  try {
    const doctorId = req.user.id; // From auth middleware
    console.log("Doctor fetching appointments for user ID:", doctorId);

    const doctor = await Doctor.findOne({ userId: doctorId });

    if (!doctor) {
      console.log("Doctor not found for user ID:", doctorId);
      return res.status(404).json({ message: "Doctor not found" });
    }

    console.log("Found doctor:", doctor._id);

    const appointments = await Appointment.find({ doctorId: doctor._id })
      .populate("userId", "name email")
      .sort({ appointmentDate: -1 });

    console.log(
      "Found appointments for doctor:",
      appointments.length,
      appointments
    );

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    res
      .status(500)
      .json({ message: "Error fetching appointments", error: error.message });
  }
};

// Doctor: Get my slots
exports.getMySlots = async (req, res) => {
  try {
    const doctorId = req.user.id; // From auth middleware
    const doctor = await Doctor.findOne({ userId: doctorId });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Return available slots or create default slots
    const slots = doctor.availableSlots || [
      { day: "Monday", startTime: "09:00", endTime: "17:00", isBooked: false },
      { day: "Tuesday", startTime: "09:00", endTime: "17:00", isBooked: false },
      {
        day: "Wednesday",
        startTime: "09:00",
        endTime: "17:00",
        isBooked: false,
      },
      {
        day: "Thursday",
        startTime: "09:00",
        endTime: "17:00",
        isBooked: false,
      },
      { day: "Friday", startTime: "09:00", endTime: "17:00", isBooked: false },
    ];

    res.status(200).json(slots);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching slots", error: error.message });
  }
};

exports.getAvailableSlotsByDate = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query; // Expecting YYYY-MM-DD
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Get the day of the week for the selected date
    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    // Check if it's a weekday (Monday to Friday)
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    if (!weekdays.includes(dayOfWeek)) {
      return res.status(200).json([]); // No slots available on weekends
    }

    // Generate hourly slots from 9 AM to 9 PM if no slots exist
    let availableSlots = doctor.availableSlots || [];

    // If no slots exist for this doctor, create default hourly slots
    if (availableSlots.length === 0) {
      const hourlySlots = [];
      for (let hour = 9; hour < 21; hour++) {
        // 9 AM to 9 PM (21:00)
        const startTime = `${hour.toString().padStart(2, "0")}:00`;
        const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`;

        hourlySlots.push({
          _id: `${doctorId}-${dayOfWeek}-${startTime}-${endTime}`, // Generate unique ID
          day: dayOfWeek,
          startTime,
          endTime,
          isBooked: false,
        });
      }
      availableSlots = hourlySlots;
    }

    // Filter slots for the specific day
    const daySlots = availableSlots.filter((slot) => slot.day === dayOfWeek);

    // Find all appointments for this doctor on this date
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      doctorId,
      appointmentDate: { $gte: start, $lte: end },
    });

    const bookedSlotIds = appointments.map((a) => a.slotId.toString());

    // Filter out booked slots and return available slots
    const availableDaySlots = daySlots.filter(
      (slot) => !bookedSlotIds.includes(slot._id?.toString())
    );

    res.status(200).json(availableDaySlots);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching slots", error: error.message });
  }
};

// Doctor: Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;
    const doctorId = req.user.id;

    console.log("Doctor updating appointment status:", {
      appointmentId,
      status,
      doctorId,
    });

    // Find the doctor
    const doctor = await Doctor.findOne({ userId: doctorId });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Find the appointment and verify it belongs to this doctor
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctorId: doctor._id,
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Update the appointment status
    appointment.status = status;
    await appointment.save();

    console.log("Appointment status updated successfully:", appointment._id);

    res.status(200).json({
      message: "Appointment status updated successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({
      message: "Error updating appointment status",
      error: error.message,
    });
  }
};
