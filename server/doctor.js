const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Doctor = require("./models/Doctor");

const MONGO_URI = process.env.MONGO_URI;

const maleDoctors = [
  { name: "Amit Sharma", specialization: "Cardiology" },
  { name: "Rahul Verma", specialization: "Orthopedics" },
  { name: "Suresh Kumar", specialization: "Dermatology" },
  { name: "Vikram Singh", specialization: "Neurology" },
  { name: "Rohit Mehra", specialization: "Pediatrics" },
  { name: "Deepak Chawla", specialization: "Urology" },
  { name: "Manish Gupta", specialization: "Gastroenterology" },
  { name: "Sanjay Rao", specialization: "Oncology" },
];

const femaleDoctors = [
  { name: "Priya Patel", specialization: "Gynecology" },
  { name: "Anjali Nair", specialization: "Ophthalmology" },
  { name: "Sneha Reddy", specialization: "ENT" },
  { name: "Kavita Joshi", specialization: "Psychiatry" },
  { name: "Pooja Desai", specialization: "General Medicine" },
  { name: "Meena Iyer", specialization: "Endocrinology" },
  { name: "Ritu Sinha", specialization: "Rheumatology" },
];

const maleImage =
  "https://res.cloudinary.com/djnerwn8s/image/upload/v1752216832/doctor_profiles/j7lrtnpjtvolmkx3ghi0.jpg";
const femaleImage =
  "https://res.cloudinary.com/djnerwn8s/image/upload/v1752217039/doctor_profiles/nnx4wbas3wjjy4s2wxie.jpg";

const getFirstName = (fullName) => fullName.split(" ")[0].toLowerCase();

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const experienceOptions = [5, 8, 10, 12, 15];
const feesOptions = [400, 500, 600, 700, 800];
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const slotTimes = [
  { start: "09:00", end: "10:00" },
  { start: "10:00", end: "11:00" },
  { start: "11:00", end: "12:00" },
  { start: "14:00", end: "15:00" },
  { start: "15:00", end: "16:00" },
];

async function addDoctors() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const allDoctors = [
      ...maleDoctors.map((d) => ({ ...d, gender: "male" })),
      ...femaleDoctors.map((d) => ({ ...d, gender: "female" })),
    ];

    let added = 0;
    let skipped = 0;

    for (const doc of allDoctors) {
      const firstName = getFirstName(doc.name);
      const email = `${firstName}@zocure.com`;
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log(
          `⚠️  Skipping ${doc.name} (email: ${email}) - already exists.`
        );
        skipped++;
        continue;
      }
      const password = await bcrypt.hash(`${firstName}123`, 10);
      const image = doc.gender === "male" ? maleImage : femaleImage;
      // Create user
      const user = new User({
        name: doc.name,
        email,
        password,
        role: "doctor",
        image,
      });
      await user.save();
      // Create doctor profile
      const availableSlots = [];
      // Add 2-3 random slots
      const usedDays = [];
      for (let i = 0; i < 3; i++) {
        let day;
        do {
          day = getRandom(daysOfWeek);
        } while (usedDays.includes(day));
        usedDays.push(day);
        const slot = getRandom(slotTimes);
        availableSlots.push({
          day,
          startTime: slot.start,
          endTime: slot.end,
          isBooked: false,
        });
      }
      const doctor = new Doctor({
        userId: user._id,
        specialization: doc.specialization,
        experience: getRandom(experienceOptions),
        fees: getRandom(feesOptions),
        image,
        availableSlots,
      });
      await doctor.save();
      console.log(
        `Doctor: ${doc.name} | Email: ${email} | Password: ${firstName}123 | Specialization: ${doc.specialization}`
      );
      added++;
    }
    console.log(`✅ ${added} doctors added successfully!`);
    console.log(`⚠️  ${skipped} doctors skipped due to existing emails.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error adding doctors:", error);
    process.exit(1);
  }
}

addDoctors();
