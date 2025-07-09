const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: { type: String, required: true },
  experience: { type: Number, required: true },
  fees: { type: Number, required: true },
  availableSlots: [{
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isBooked: { type: Boolean, default: false }
  }]
});

module.exports = mongoose.model("Doctor", doctorSchema);