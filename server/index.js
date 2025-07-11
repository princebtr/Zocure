const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());

// Only use express.json() for routes that expect JSON
app.use(express.json());
app.use("/api/auth", express.json(), require("./routes/authRoutes"));
app.use("/api/doctors", express.json(), require("./routes/doctorRoutes"));
app.use(
  "/api/appointments",
  express.json(),
  require("./routes/appointmentRoutes")
);

// Do NOT use express.json() for admin routes (uses multer for file upload)
app.use("/api/admin", require("./routes/adminRoutes"));

// DB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB", err);
  });
