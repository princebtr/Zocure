const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    slotId: { type: String, required: true },
    appointmentDate: { type: Date, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "cancelled",
        "completed",
        "no-show",
        "in-progress",
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    paymentId: { type: String },
    amount: { type: Number, required: true },
    consultationNotes: { type: String, default: "" },
    doctorNotes: { type: String, default: "" },
    patientVisited: { type: Boolean, default: false },
    checkupDone: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
