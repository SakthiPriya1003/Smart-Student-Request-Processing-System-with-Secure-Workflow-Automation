//const Request = require("../models/Request");
//const User = require("../models/User");

// ===============================
// Get all tutors (for dropdown)
// ===============================
//exports.getAllTutors = async (req, res) => {
  //try {
    //const { department, year, section } = req.query;

    // Base filter: only tutors
    //let filter = { role: "tutor" };

    //if (department) filter.department = department.trim().toUpperCase();
    //if (year) filter.year = year.trim().toUpperCase();       // Roman numerals (I, II, III, IV)
    //if (section) filter.section = section.trim().toUpperCase();

    //const tutors = await User.find(filter).select(
      //"name email department year section"
    //);

    //res.json(tutors);

  //} catch (error) {
    //console.error(error);
    //res.status(500).json({ message: "Error fetching tutors" });
  //}
//};

// ===============================
// View tutor requests
// ===============================
//exports.getTutorRequests = async (req, res) => {
  //try {
    //const tutorName = req.user.name;

    // UPDATED: Removed "status: pending" filter.
    // Now fetches ALL requests (Pending, Approved, Rejected) for this tutor.
    //const requests = await Request.find({ tutorName: tutorName })
      //.sort({ createdAt: -1 }); // Show newest first

    //res.json(requests);

  //} catch (error) {
    //console.error(error);
    //res.status(500).json({ message: "Error fetching requests" });
  //}
//};

// ===============================
// Tutor approve / reject request
// ===============================
//exports.tutorDecision = async (req, res) => {
  //try {
    //const { status, comment } = req.body;

    //const request = await Request.findById(req.params.id);

    //if (!request) {
      //return res.status(404).json({ message: "Request not found" });
    //}

    //request.status = status;
    //request.tutorComment = comment;

    //await request.save();

    //res.json({
      //message: "Tutor decision updated",
      //request
    //});

  //} catch (error) {
    //console.error(error);
    //res.status(500).json({ message: "Error updating request" });
  //}
//};

// ===============================
// Register User (for reference)
// ===============================
//exports.registerUser = async (req, res) => {
  //try {
    //const { name, email, password, role, department, year, section, tutor } = req.body;

    // Check if user already exists
    //const existingUser = await User.findOne({ email });
    //if (existingUser) {
      //return res.status(400).json({ message: "User already exists" });
    //}

    // Normalize inputs
    //const dept = department.trim().toUpperCase();
    //const sec = section.trim().toUpperCase();
    //const yr = year.trim().toUpperCase(); // Roman numeral stored directly

    // Hash password
    //const bcrypt = require("bcryptjs");
    //const hashedPassword = await bcrypt.hash(password, 10);

    // ===== Student specific validation =====
    //if (role === "student") {
      //if (!tutor) {
        //return res.status(400).json({ message: "Tutor is required for students" });
      //}

      //const selectedTutor = await User.findById(tutor);

      //if (!selectedTutor || selectedTutor.role !== "tutor") {
        //return res.status(400).json({ message: "Invalid tutor selected" });
      //}

      // Compare class details
      //if (
        //selectedTutor.department.trim().toUpperCase() !== dept ||
        //selectedTutor.year.trim().toUpperCase() !== yr ||
        //selectedTutor.section.trim().toUpperCase() !== sec
      //) {
        //return res.status(400).json({ message: "Tutor does not belong to your class" });
      //}
    //}
/*
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

    res.status(201).json({ message: "User registered successfully", user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};
*/

const Request = require("../models/Request");
const User = require("../models/User");

// ✅ ADDED: Import email utilities
const {
  notifyStudentTutorDecision,
  formatDateDisplay
} = require("../utils/sendEmail");

// ===============================
// Get all tutors (for dropdown)
// ===============================
exports.getAllTutors = async (req, res) => {
  try {
    const { department, year, section } = req.query;

    // Base filter: only tutors
    let filter = { role: "tutor" };

    if (department) filter.department = department.trim().toUpperCase();
    if (year) filter.year = year.trim().toUpperCase();       // Roman numerals (I, II, III, IV)
    if (section) filter.section = section.trim().toUpperCase();

    const tutors = await User.find(filter).select(
      "name email department year section"
    );

    res.json(tutors);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching tutors" });
  }
};

// ===============================
// View tutor requests
// ===============================
exports.getTutorRequests = async (req, res) => {
  try {
    const tutorName = req.user.name;

    // UPDATED: Removed "status: pending" filter.
    // Now fetches ALL requests (Pending, Approved, Rejected) for this tutor.
    const requests = await Request.find({ tutorName: tutorName })
      .sort({ createdAt: -1 }); // Show newest first

    res.json(requests);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching requests" });
  }
};

// ===============================
// Tutor approve / reject request
// ===============================
exports.tutorDecision = async (req, res) => {
  try {
    const { status, comment } = req.body;

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = status;
    request.tutorComment = comment;

    await request.save();

    // ✅ ADDED: Send email notification to student
    try {
      const student = await User.findOne({ name: request.studentName });

      if (student && student.email) {
        const emailData = {
          ...request._doc,
          dateDisplay: formatDateDisplay(request)
        };
        await notifyStudentTutorDecision(
          student.email,
          student.name,
          emailData
        );
      }
    } catch (emailErr) {
      console.error("Email failed (non-blocking):", emailErr.message);
    }

    res.json({
      message: "Tutor decision updated",
      request
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating request" });
  }
};

// ===============================
// Register User (for reference)
// ===============================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, department, year, section, tutor } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Normalize inputs
    const dept = department.trim().toUpperCase();
    const sec = section.trim().toUpperCase();
    const yr = year.trim().toUpperCase(); // Roman numeral stored directly

    // Hash password
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);

    // ===== Student specific validation =====
    if (role === "student") {
      if (!tutor) {
        return res.status(400).json({ message: "Tutor is required for students" });
      }

      const selectedTutor = await User.findById(tutor);

      if (!selectedTutor || selectedTutor.role !== "tutor") {
        return res.status(400).json({ message: "Invalid tutor selected" });
      }

      // Compare class details
      if (
        selectedTutor.department.trim().toUpperCase() !== dept ||
        selectedTutor.year.trim().toUpperCase() !== yr ||
        selectedTutor.section.trim().toUpperCase() !== sec
      ) {
        return res.status(400).json({ message: "Tutor does not belong to your class" });
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

    res.status(201).json({ message: "User registered successfully", user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};