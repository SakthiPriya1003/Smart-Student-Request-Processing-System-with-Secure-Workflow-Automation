// server/server.js
//const express = require("express");
//const mongoose = require("mongoose");
//const cors = require("cors");
//const path = require("path");
//require("dotenv").config();

//const app = express();

// ==============================
// Middleware
// ==============================
//app.use(cors());
//app.use(express.json());

// Serve uploaded files statically
//app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==============================
// Routes
// ==============================
//app.use("/api/auth", require("./routes/authRoutes"));
//app.use("/api/tutors", require("./routes/tutorRoutes"));
//app.use("/api/requests", require("./routes/requestRoutes"));
//app.use("/api/hod", require("./routes/hodRoutes"));
//app.use("/api/protected", require("./routes/protectedRoutes"));

// ==============================
// Global Error Handler
// ==============================
//app.use((err, req, res, next) => {
  //console.error(err.stack);

  // Multer file size error
  //if (err.code === "LIMIT_FILE_SIZE") {
    //return res.status(400).json({
      //message: "File size too large. Maximum 5MB allowed"
    //});
  //}

  // Multer file type error
  //if (err.message && err.message.includes("Only")) {
    //return res.status(400).json({
      //message: err.message
    //});
  //}

  //res.status(500).json({
    //message: "Something went wrong",
    //error: err.message
  //});
//});

// ==============================
// Database Connection
// ==============================
//mongoose
  //.connect(process.env.MONGO_URI)
  //.then(() => {
    //console.log("✅ MongoDB Connected");

    //const PORT = process.env.PORT || 5000;
    //app.listen(PORT, () => {
      //console.log(`🚀 Server running on port ${PORT}`);
    //});
  //})
  //.catch((err) => {
    //console.error("❌ MongoDB Connection Error:", err);
  //});

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// ==============================
// Middleware
// ==============================
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==============================
// Routes
// ==============================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tutors", require("./routes/tutorRoutes"));
app.use("/api/requests", require("./routes/requestRoutes"));
app.use("/api/hod", require("./routes/hodRoutes"));
app.use("/api/protected", require("./routes/protectedRoutes"));

// ==============================
// Global Error Handler
// ==============================
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Multer file size error
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "File size too large. Maximum 5MB allowed"
    });
  }

  // Multer file type error
  if (err.message && err.message.includes("Only")) {
    return res.status(400).json({
      message: err.message
    });
  }

  res.status(500).json({
    message: "Something went wrong",
    error: err.message
  });
});

// ==============================
// Database Connection
// ==============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
  });