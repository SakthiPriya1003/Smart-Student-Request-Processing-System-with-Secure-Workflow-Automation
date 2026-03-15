//const express = require("express");
//const router = express.Router();
//const multer = require("multer");
//const path = require("path");
//const Request = require("../models/Request");

// Multer setup (same as before)
//const storage = multer.diskStorage({
  //destination: function (req, file, cb) {
    //cb(null, "uploads/");
  //},
  //filename: function (req, file, cb) {
    //cb(null, Date.now() + "-" + file.originalname);
  //},
//});

//const fileFilter = (req, file, cb) => {
  //const allowedTypes = /pdf|jpeg|jpg|png/;
  //const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  //const mimetype = allowedTypes.test(file.mimetype);

  //if (extname && mimetype) {
    //cb(null, true);
  //} else {
    //cb(new Error("Only PDF, JPG, JPEG, PNG files are allowed"));
  //}
//};

//const upload = multer({
  //storage: storage,
  //limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  //fileFilter: fileFilter,
//});

// POST request
//router.post("/", upload.single("document"), async (req, res) => {
  //const { studentName, tutorName, requestType, reason, numDays, fromDate } = req.body;
  //let document = req.file ? req.file.path : null;

  // Validation
  //if ((requestType === "OD" || requestType === "Leave") && (!reason || reason.trim() === "")) {
    //return res.status(400).json({ message: "Reason is required for OD or Leave requests" });
  //}
  //if ((requestType === "OD" || requestType === "Leave") && (!numDays || numDays <= 0)) {
    //return res.status(400).json({ message: "Number of days is required for OD or Leave requests" });
  //}

  //let date = null, start = null, end = null;

  //if (parseInt(numDays) === 1) {
    //date = fromDate ? new Date(fromDate) : new Date(); // single date
  //} else {
    //start = fromDate ? new Date(fromDate) : new Date();
    //end = new Date(start);
    //end.setDate(start.getDate() + parseInt(numDays) - 1); // calculate toDate
  //}

  //const newRequest = new Request({
    //studentName,
    //tutorName,
    //requestType,
    //reason,
    //numDays,
    //date,
    //fromDate: start,
    //toDate: end,
    //document
  //});

  //try {
    //const savedRequest = await newRequest.save();
    //res.status(201).json(savedRequest);
  //} catch (err) {
    //res.status(400).json({ message: err.message });
  //}
//});

//module.exports = router;


const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const Request = require("../models/Request");
const protect = require("../middleware/authMiddleware");


// ==============================
// Multer Storage Configuration
// ==============================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});


// ==============================
// File Type Validation
// ==============================

const fileFilter = (req, file, cb) => {

  const allowedTypes = /pdf|jpeg|jpg|png/;

  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

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
// CREATE REQUEST (Student)
// ==============================

router.post("/", upload.single("document"), async (req, res) => {

  try {

    const {
      studentName,
      tutorName,
      requestType,
      reason,
      numDays,
      fromDate
    } = req.body;

    let document = req.file ? req.file.path : null;

    // ==========================
    // Validation
    // ==========================

    if (
      (requestType === "OD" || requestType === "Leave") &&
      (!reason || reason.trim() === "")
    ) {
      return res.status(400).json({
        message: "Reason is required for OD or Leave requests"
      });
    }

    if (
      (requestType === "OD" || requestType === "Leave") &&
      (!numDays || numDays <= 0)
    ) {
      return res.status(400).json({
        message: "Number of days is required for OD or Leave requests"
      });
    }


    // ==========================
    // Date Calculation
    // ==========================

    let date = null;
    let start = null;
    let end = null;

    if (parseInt(numDays) === 1) {

      date = fromDate ? new Date(fromDate) : new Date();

    } else {

      start = fromDate ? new Date(fromDate) : new Date();

      end = new Date(start);

      end.setDate(start.getDate() + parseInt(numDays) - 1);

    }


    // ==========================
    // Create Request
    // ==========================

    const newRequest = new Request({
      studentName,
      tutorName,
      requestType,
      reason,
      numDays,
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

});


// ==============================
// STUDENT VIEW THEIR REQUESTS
// ==============================

router.get("/my", protect, async (req, res) => {

  try {

    const studentName = req.user.name;

    const requests = await Request.find({
      studentName: studentName
    });

    res.json(requests);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching requests",
      error: error.message
    });

  }

});


// ==============================
// EXPORT ROUTER
// ==============================

module.exports = router;