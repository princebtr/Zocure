// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  verify,
  getProfileById,
  updateProfile,
  updatePassword,
} = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");
const { uploadUser } = require("../utils/multer");

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify", verifyToken, verify);
router.get("/profile/:userId", getProfileById);
router.patch("/profile/:userId", uploadUser.single("image"), updateProfile);
router.patch("/profile/:userId/password", updatePassword);

module.exports = router;
