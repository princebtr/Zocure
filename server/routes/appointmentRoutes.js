const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const appointmentController = require("../controllers/appointmentController");

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

module.exports = router;
