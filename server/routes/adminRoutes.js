const express = require("express");
const router = express.Router();
const {
  addDoctor,
  getAllDoctors,
  deleteDoctor,
} = require("../controllers/adminController");
const { authMiddleware } = require("../middleware/authMiddleware");
const appointmentController = require("../controllers/appointmentController");
const { uploadDoctor } = require("../utils/multer");

// Apply both token + role check together
router.post(
  "/add-doctor",
  ...authMiddleware(["admin"]),
  uploadDoctor.single("image"),
  addDoctor
);
router.get("/doctors", ...authMiddleware(["admin"]), getAllDoctors);
router.delete("/doctors/:id", ...authMiddleware(["admin"]), deleteDoctor);

// Test route to check if doctors exist
router.get("/doctors-test", ...authMiddleware(["admin"]), async (req, res) => {
  try {
    const doctors = await require("../models/Doctor").find();
    res.json({
      count: doctors.length,
      doctors: doctors.map((d) => ({
        id: d._id,
        specialization: d.specialization,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Appointments routes
router.get(
  "/appointments",
  ...authMiddleware(["admin"]),
  appointmentController.getAllAppointments
);
router.patch(
  "/appointments/:appointmentId/status",
  ...authMiddleware(["admin"]),
  appointmentController.updateAppointmentStatus
);

module.exports = router;
