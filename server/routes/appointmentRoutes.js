const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const appointmentController = require("../controllers/appointmentController");

router.post(
  "/payment/create-intent",
  ...authMiddleware(["user"]),
  appointmentController.createPaymentIntent
);

router.post(
  "/book",
  ...authMiddleware(["user"]),
  appointmentController.bookAppointment
);

router.get(
  "/my-appointments",
  ...authMiddleware(["user"]),
  appointmentController.getMyAppointments
);

router.post(
  "/payment/verify",
  ...authMiddleware(["user"]),
  appointmentController.verifyPayment
);

// Doctor routes
router.get(
  "/doctor/appointments",
  ...authMiddleware(["doctor"]),
  appointmentController.getDoctorAppointments
);

router.get(
  "/doctor/appointments/:appointmentId",
  ...authMiddleware(["doctor"]),
  appointmentController.getAppointmentDetails
);

router.patch(
  "/doctor/appointments/:appointmentId/status",
  ...authMiddleware(["doctor"]),
  appointmentController.updateAppointmentStatusByDoctor
);

// Admin routes
router.get(
  "/all",
  ...authMiddleware(["admin"]),
  appointmentController.getAllAppointments
);

router.patch(
  "/:appointmentId/status",
  ...authMiddleware(["admin"]),
  appointmentController.updateAppointmentStatus
);

module.exports = router;
