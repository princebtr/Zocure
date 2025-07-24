# Zoure Deployment

[🌐 **Live Demo**](https://zocure.netlify.app/)

[🔗 **Connect on LinkedIn**](https://www.linkedin.com/in/princebtr/)

A full-stack Doctor Appointment Booking platform with role-based access for users, doctors, and admins.  
Frontend built with **React + Vite** and Tailwind CSS.  
Backend powered by **Node.js**, **Express**, and **MongoDB**.

---

## ✨ Features

- **User Authentication:** Signup, login, JWT-based sessions
- **Role Management:** User, Doctor, and Admin dashboards
- **Book Appointments:** Users can book, view, and manage appointments
- **Doctor Management:** Admins can add, approve, and manage doctors
- **Profile Management:** Users and doctors can update their profiles
- **Stripe Payments:** Secure payment integration for appointments
- **Responsive UI:** Modern, mobile-friendly design with Tailwind CSS

---

## 🗂️ Project Structure

```
Zoure-Deplyment/
  client/      # React frontend (Vite)
  server/      # Node.js/Express backend
```

### Frontend Pages

- `landingPage.jsx` – Home/landing page
- `login.jsx` – User login
- `signup.jsx` – User signup
- `DoctorsList.jsx` – Browse doctors
- `Services.jsx` – View services
- `About.jsx` – About page
- `Contact.jsx` – Contact page
- `user/` – User dashboard, profile, appointment booking
- `doctor/` – Doctor dashboard, login
- `admin/` – Admin dashboard, doctor management, appointments

### Backend Models

- `User.js` – User schema
- `Doctor.js` – Doctor schema
- `Appointment.js` – Appointment schema

---

## 🚀 Deployment

### Frontend (Vercel)

1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com/), import your repo, and set the project root to `client`.
3. Add environment variable:
   ```
   VITE_API_URL="....not disclosing it"
   ```
4. Deploy!

### Backend (Render)

1. Push your code to GitHub.
2. Go to [Render](https://render.com/), create a new Web Service, and set the root to `server`.
3. Add environment variables (e.g., `MONGO_URI`, `JWT_SECRET`, etc.).
4. Deploy!

---

## 🛠️ Local Development

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local or Atlas)

### Setup

```bash
# Clone the repo
git clone https://github.com/princebtr/Zocure.git
cd Zoure

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

### Environment Variables

Create a `.env` file in `server/`:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET=your_stripe_secret
```

Create a `.env` file in `client/`:

```
VITE_API_URL=http://localhost:5000/api
```

### Run Locally

```bash
# Start backend
cd server
npm run dev

# Start frontend (in a new terminal)
cd ../client
npm run dev
```

---

## 📦 Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Axios, React Router
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Stripe, Multer, Cloudinary
- **Deployment:** Vercel (frontend), Render (backend)

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---
