const express = require("express");
const router = express.Router();
const { addDoctor } = require("../controllers/adminController");
const { authMiddleware } = require("../middleware/authMiddleware"); // <-- FIXED

// Apply both token + role check together
router.post("/add-doctor", ...authMiddleware(["admin"]), addDoctor);

module.exports = router;
