const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER USER =================
exports.registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      department,
      year,
      section,
      tutor
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Normalize inputs
    const dept = department.trim().toUpperCase();
    const sec = section.trim().toUpperCase();
    const yr = year.trim().toUpperCase();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ===== Student specific validation =====
    if (role === "student") {

      if (!tutor) {
        return res.status(400).json({
          message: "Tutor is required for students"
        });
      }

      const selectedTutor = await User.findById(tutor);

      if (!selectedTutor || selectedTutor.role !== "tutor") {
        return res.status(400).json({
          message: "Invalid tutor selected"
        });
      }

      // Normalize tutor values
      const tutorDept = selectedTutor.department.trim().toUpperCase();
      const tutorSec = selectedTutor.section.trim().toUpperCase();
      const tutorYear = selectedTutor.year.trim().toUpperCase();

      // Compare class details
      if (
        tutorDept !== dept ||
        tutorYear !== yr ||
        tutorSec !== sec
      ) {
        return res.status(400).json({
          message: "Tutor does not belong to your class"
        });
      }
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      department: dept,
      year: yr,
      section: sec,
      tutor: role === "student" ? tutor : undefined
    });

    res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
};



// ================= LOGIN USER =================
exports.loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};