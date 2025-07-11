const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const doctorController = require("../controllers/doctorController");

// Static doctor routes (must come before dynamic :id route)
router.get(
  "/my-appointments",
  ...authMiddleware(["doctor"]),
  doctorController.getMyAppointments
);
router.get(
  "/my-slots",
  ...authMiddleware(["doctor"]),
  doctorController.getMySlots
);
router.put(
  "/update-slots",
  ...authMiddleware(["doctor"]),
  doctorController.updateSlots
);
router.put(
  "/appointments/:appointmentId/status",
  ...authMiddleware(["doctor"]),
  doctorController.updateAppointmentStatus
);
router.get("/me", ...authMiddleware(["doctor"]), async (req, res) => {
  // Return the logged-in doctor's profile
  try {
    const doctor = await require("../models/Doctor")
      .findOne({ userId: req.user.id })
      .populate("userId", "name email");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.status(200).json(doctor);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching doctor", error: error.message });
  }
});

// Public routes for getting doctors
router.get("/", doctorController.getAllDoctors);
router.get("/all", doctorController.getAllDoctors);
// Dynamic routes must come last
router.get("/:id", doctorController.getDoctorById);
router.get("/:doctorId/slots", doctorController.getAvailableSlotsByDate);

// Admin routes for managing doctors
router.post("/add", ...authMiddleware(["admin"]), doctorController.addDoctor);

module.exports = router;
