const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const doctorController = require("../controllers/doctorController");

// Admin routes for managing doctors
router.post("/add", ...authMiddleware(["admin"]), doctorController.addDoctor);
router.get("/all", doctorController.getAllDoctors);
router.get("/:id", doctorController.getDoctorById);

// Doctor routes
router.put(
  "/update-slots",
  ...authMiddleware(["doctor"]),
  doctorController.updateSlots
);
router.get(
  "/my-appointments",
  ...authMiddleware(["doctor"]),
  doctorController.getMyAppointments
);

module.exports = router;
