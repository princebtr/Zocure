const express = require("express");
const router = express.Router();
const {
  addDoctor,
  getAllDoctors,
  deleteDoctor,
} = require("../controllers/adminController");
const { authMiddleware } = require("../middleware/authMiddleware");
const upload = require("../utils/multer");

// Apply both token + role check together
router.post(
  "/add-doctor",
  ...authMiddleware(["admin"]),
  upload.single("image"),
  addDoctor
);
router.get("/doctors", ...authMiddleware(["admin"]), getAllDoctors);
router.delete("/doctors/:id", ...authMiddleware(["admin"]), deleteDoctor);

module.exports = router;
