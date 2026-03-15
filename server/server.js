const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const tutorRoutes = require("./routes/tutorRoutes");
const requestRoutes = require("./routes/requestRoutes"); // <-- Add this here

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/tutors", tutorRoutes);
app.use("/api/requests", requestRoutes); // <-- And this here

// Test Route
app.get("/", (req, res) => {
  res.send("Backend running...");
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });