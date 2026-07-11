/*// server/routes/requestRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Request = require("../models/Request");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// ==============================
// Ensure uploads directory exists
// ==============================
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ==============================
// Multer Storage Configuration
// ==============================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// ==============================
// File Type Validation
// ==============================
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, JPG, JPEG, PNG files are allowed"));
  }
};

// ==============================
// Multer Upload Config
// ==============================
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
});

// ==============================
// CREATE REQUEST (Student Only)
// ==============================
router.post(
  "/",
  protect,
  authorize("student"),
  upload.single("document"),
  async (req, res) => {
    try {
      const { tutorName, requestType, reason, numDays, fromDate } = req.body;

      // Get student name from JWT token
      const studentName = req.user.name;
      const studentId = req.user.id;

      // Validate tutor exists and is assigned to this student
      const student = await User.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      // Verify tutorName matches assigned tutor
      const assignedTutor = await User.findById(student.tutor);
      if (!assignedTutor) {
        return res.status(400).json({ message: "No tutor assigned" });
      }

      if (assignedTutor.name !== tutorName) {
        return res.status(403).json({ 
          message: "You can only submit requests to your assigned tutor" 
        });
      }

      let document = req.file ? req.file.path : null;

      // ==========================
      // Validation based on request type
      // ==========================
      if (requestType === "Marksheet") {
        // Marksheet doesn't need reason or dates
        if (!document) {
          return res.status(400).json({
            message: "Document is required for Marksheet request"
          });
        }
      } else if (requestType === "Bonafide") {
        // Bonafide needs reason but not dates
        if (!reason || reason.trim() === "") {
          return res.status(400).json({
            message: "Reason is required for Bonafide request"
          });
        }
      } else {
        // OD and Leave need reason, numDays, and dates
        if (!reason || reason.trim() === "") {
          return res.status(400).json({
            message: "Reason is required for OD or Leave requests"
          });
        }

        if (!numDays || parseInt(numDays) <= 0) {
          return res.status(400).json({
            message: "Number of days is required"
          });
        }

        if (!fromDate) {
          return res.status(400).json({
            message: "From date is required"
          });
        }
      }

      // ==========================
      // Date Calculation (for OD/Leave only)
      // ==========================
      let date = null;
      let start = null;
      let end = null;

      if (requestType === "OD" || requestType === "Leave") {
        const days = parseInt(numDays);

        if (days === 1) {
          date = fromDate ? new Date(fromDate) : new Date();
        } else {
          start = fromDate ? new Date(fromDate) : new Date();
          end = new Date(start);
          end.setDate(start.getDate() + days - 1);
        }
      }

      // ==========================
      // Create Request
      // ==========================
      const newRequest = new Request({
        studentName,
        tutorName,
        requestType,
        reason,
        numDays: requestType === "OD" || requestType === "Leave" ? numDays : null,
        date,
        fromDate: start,
        toDate: end,
        document
      });

      const savedRequest = await newRequest.save();

      res.status(201).json(savedRequest);

    } catch (error) {
      res.status(500).json({
        message: "Error creating request",
        error: error.message
      });
    }
  }
);

// ==============================
// STUDENT VIEW THEIR REQUESTS
// ==============================
router.get(
  "/my",
  protect,
  authorize("student"),
  async (req, res) => {
    try {
      const studentName = req.user.name;

      const requests = await Request.find({ studentName }).sort({
        createdAt: -1
      });

      res.json(requests);

    } catch (error) {
      res.status(500).json({
        message: "Error fetching requests",
        error: error.message
      });
    }
  }
);

// ==============================
// EXPORT ROUTER
// ==============================
module.exports = router;
*/

/*const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Request = require("../models/Request");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// ✅ ADDED: Import email utilities
const {
  notifyTutorNewRequest,
  formatDateDisplay
} = require("../utils/sendEmail");

// ==============================
// Ensure uploads directory exists
// ==============================
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ==============================
// Multer Storage Configuration
// ==============================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// ==============================
// File Type Validation
// ==============================
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, JPG, JPEG, PNG files are allowed"));
  }
};

// ==============================
// Multer Upload Config
// ==============================
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
});

// ==============================
// CREATE REQUEST (Student Only)
// ==============================
router.post(
  "/",
  protect,
  authorize("student"),
  upload.single("document"),
  async (req, res) => {
    try {
      const { tutorName, requestType, reason, numDays, fromDate } = req.body;

      // Get student name from JWT token
      const studentName = req.user.name;
      const studentId = req.user.id;

      // Validate tutor exists and is assigned to this student
      const student = await User.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      // Verify tutorName matches assigned tutor
      const assignedTutor = await User.findById(student.tutor);
      if (!assignedTutor) {
        return res.status(400).json({ message: "No tutor assigned" });
      }

      if (assignedTutor.name !== tutorName) {
        return res.status(403).json({ 
          message: "You can only submit requests to your assigned tutor" 
        });
      }

      let document = req.file ? req.file.path : null;

      // ==========================
      // Validation based on request type
      // ==========================
      if (requestType === "Marksheet") {
        if (!document) {
          return res.status(400).json({
            message: "Document is required for Marksheet request"
          });
        }
      } else if (requestType === "Bonafide") {
        if (!reason || reason.trim() === "") {
          return res.status(400).json({
            message: "Reason is required for Bonafide request"
          });
        }
      } else {
        if (!reason || reason.trim() === "") {
          return res.status(400).json({
            message: "Reason is required for OD or Leave requests"
          });
        }

        if (!numDays || parseInt(numDays) <= 0) {
          return res.status(400).json({
            message: "Number of days is required"
          });
        }

        if (!fromDate) {
          return res.status(400).json({
            message: "From date is required"
          });
        }
      }

      // ==========================
      // Date Calculation (for OD/Leave only)
      // ==========================
      let date = null;
      let start = null;
      let end = null;

      if (requestType === "OD" || requestType === "Leave") {
        const days = parseInt(numDays);

        if (days === 1) {
          date = fromDate ? new Date(fromDate) : new Date();
        } else {
          start = fromDate ? new Date(fromDate) : new Date();
          end = new Date(start);
          end.setDate(start.getDate() + days - 1);
        }
      }

      // ==========================
      // Create Request
      // ==========================
      const newRequest = new Request({
        studentName,
        tutorName,
        requestType,
        reason,
        numDays: requestType === "OD" || requestType === "Leave" ? numDays : null,
        date,
        fromDate: start,
        toDate: end,
        document
      });

      const savedRequest = await newRequest.save();

      // ✅ ADDED: Send email notification to tutor
      try {
        const emailData = {
          ...savedRequest._doc,
          dateDisplay: formatDateDisplay(savedRequest)
        };
        await notifyTutorNewRequest(
          assignedTutor.email,
          assignedTutor.name,
          emailData
        );
      } catch (emailErr) {
        console.error("Email failed (non-blocking):", emailErr.message);
      }

      res.status(201).json(savedRequest);

    } catch (error) {
      res.status(500).json({
        message: "Error creating request",
        error: error.message
      });
    }
  }
);

// ==============================
// STUDENT VIEW THEIR REQUESTS
// ==============================
router.get(
  "/my",
  protect,
  authorize("student"),
  async (req, res) => {
    try {
      const studentName = req.user.name;

      const requests = await Request.find({ studentName }).sort({
        createdAt: -1
      });

      res.json(requests);

    } catch (error) {
      res.status(500).json({
        message: "Error fetching requests",
        error: error.message
      });
    }
  }
);

// ==============================
// EXPORT ROUTER
// ==============================
module.exports = router;
*/

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Request = require("../models/Request");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// ✅ ADDED: Import email utilities
const {
  notifyTutorNewRequest,
  formatDateDisplay
} = require("../utils/sendEmail");

// ==============================
// Ensure uploads directory exists
// ==============================
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ==============================
// Multer Storage Configuration
// ==============================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// ==============================
// File Type Validation
// ==============================
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, JPG, JPEG, PNG files are allowed"));
  }
};

// ==============================
// Multer Upload Config
// ==============================
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
});

// ==============================
// CREATE REQUEST (Student Only)
// ==============================
router.post(
  "/",
  protect,
  authorize("student"),
  upload.single("document"),
  async (req, res) => {
    try {
      // ✅ UPDATED: Added attendance to destructuring
      const { tutorName, requestType, reason, numDays, fromDate, attendance } = req.body;

      // Get student name from JWT token
      const studentName = req.user.name;
      const studentId = req.user.id;

      // Validate tutor exists and is assigned to this student
      const student = await User.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      // Verify tutorName matches assigned tutor
      const assignedTutor = await User.findById(student.tutor);
      if (!assignedTutor) {
        return res.status(400).json({ message: "No tutor assigned" });
      }

      if (assignedTutor.name !== tutorName) {
        return res.status(403).json({ 
          message: "You can only submit requests to your assigned tutor" 
        });
      }

      let document = req.file ? req.file.path : null;

      // ==========================
      // Validation based on request type
      // ==========================
      if (requestType === "Marksheet") {
        if (!document) {
          return res.status(400).json({
            message: "Document is required for Marksheet request"
          });
        }
      } else if (requestType === "Bonafide") {
        if (!reason || reason.trim() === "") {
          return res.status(400).json({
            message: "Reason is required for Bonafide request"
          });
        }
      } else {
        // OD and Leave validations
        if (!reason || reason.trim() === "") {
          return res.status(400).json({
            message: "Reason is required for OD or Leave requests"
          });
        }

        // ✅ ADDED: Attendance validation for OD/Leave
        if (attendance === "" || attendance === undefined || isNaN(attendance) || attendance < 0 || attendance > 100) {
          return res.status(400).json({
            message: "Valid attendance percentage (0-100) is required"
          });
        }

        if (!numDays || parseInt(numDays) <= 0) {
          return res.status(400).json({
            message: "Number of days is required"
          });
        }

        if (!fromDate) {
          return res.status(400).json({
            message: "From date is required"
          });
        }
      }

      // ==========================
      // Date Calculation (for OD/Leave only)
      // ==========================
      let date = null;
      let start = null;
      let end = null;

      if (requestType === "OD" || requestType === "Leave") {
        const days = parseInt(numDays);

        if (days === 1) {
          date = fromDate ? new Date(fromDate) : new Date();
        } else {
          start = fromDate ? new Date(fromDate) : new Date();
          end = new Date(start);
          end.setDate(start.getDate() + days - 1);
        }
      }

      // ==========================
      // Create Request
      // ==========================
      const newRequest = new Request({
        studentName,
        tutorName,
        department: student.department,
        requestType,
        reason,
        attendance: (requestType === "OD" || requestType === "Leave") ? attendance : null, // ✅ ADDED
        numDays: requestType === "OD" || requestType === "Leave" ? numDays : null,
        date,
        fromDate: start,
        toDate: end,
        document
      });

      const savedRequest = await newRequest.save();

      // ✅ ADDED: Send email notification to tutor
      try {
        const emailData = {
          ...savedRequest._doc,
          dateDisplay: formatDateDisplay(savedRequest)
        };
        await notifyTutorNewRequest(
          assignedTutor.email,
          assignedTutor.name,
          emailData
        );
      } catch (emailErr) {
        console.error("Email failed (non-blocking):", emailErr.message);
      }

      res.status(201).json(savedRequest);

    } catch (error) {
      res.status(500).json({
        message: "Error creating request",
        error: error.message
      });
    }
  }
);

// ==============================
// STUDENT VIEW THEIR REQUESTS
// ==============================
router.get(
  "/my",
  protect,
  authorize("student"),
  async (req, res) => {
    try {
      const studentName = req.user.name;

      const requests = await Request.find({ studentName }).sort({
        createdAt: -1
      });

      res.json(requests);

    } catch (error) {
      res.status(500).json({
        message: "Error fetching requests",
        error: error.message
      });
    }
  }
);

// ==============================
// EXPORT ROUTER
// ==============================
module.exports = router;