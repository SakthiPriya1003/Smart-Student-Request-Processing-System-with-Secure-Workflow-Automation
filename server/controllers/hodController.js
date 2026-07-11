//const Request = require("../models/Request");

//exports.getHodRequests = async (req, res) => {

  //const requests = await Request.find({
    //status: "tutor_approved"
  //});

  //res.json(requests);
//};

//exports.hodDecision = async (req, res) => {

  //const { status, comment } = req.body;

  //const request = await Request.findById(req.params.id);

  //request.status = status;
  //request.hodComment = comment;

  //await request.save();

  //res.json({
    //message: "HOD decision updated",
    //request
  //});
//};


//the corrected version;
//const Request = require("../models/Request");

//exports.getHodRequests = async (req, res) => {
  //try {
    // Fetches: Pending (Tutor Approved), HOD Approved, and HOD Rejected
    //const requests = await Request.find({
      //status: { $in: ["tutor_approved", "hod_approved", "hod_rejected"] }
    //})
    //.sort({ createdAt: -1 }); // Show newest requests first

    //res.json(requests);
  //} catch (error) {
    //console.error("Error fetching HOD requests:", error);
    //res.status(500).json({ message: "Error fetching requests" });
  //}
//};

//exports.hodDecision = async (req, res) => {
  //try {
    //const { status, comment } = req.body;

    //const request = await Request.findById(req.params.id);

    //if (!request) {
      //return res.status(404).json({ message: "Request not found" });
    //}

    //request.status = status;
    //request.hodComment = comment;

    //await request.save();

    //res.json({
      //message: "HOD decision updated",
      //request
    //});
  //} catch (error) {
    //console.error("Error updating HOD request:", error);
    //res.status(500).json({ message: "Error updating request" });
  //}
//};

/*const Request = require("../models/Request");
const User = require("../models/User");

// ✅ ADDED: Import email utilities
const {
  notifyStudentHodDecision,
  formatDateDisplay
} = require("../utils/sendEmail");

exports.getHodRequests = async (req, res) => {
  try {
    // Fetches: Pending (Tutor Approved), HOD Approved, and HOD Rejected
    const requests = await Request.find({
      status: { $in: ["tutor_approved", "hod_approved", "hod_rejected"] }
    })
    .sort({ createdAt: -1 }); // Show newest requests first

    res.json(requests);
  } catch (error) {
    console.error("Error fetching HOD requests:", error);
    res.status(500).json({ message: "Error fetching requests" });
  }
};

exports.hodDecision = async (req, res) => {
  try {
    const { status, comment } = req.body;

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = status;
    request.hodComment = comment;

    await request.save();

    // ✅ ADDED: Send email notification to student
    try {
      const student = await User.findOne({ name: request.studentName });

      if (student && student.email) {
        const emailData = {
          ...request._doc,
          dateDisplay: formatDateDisplay(request)
        };
        await notifyStudentHodDecision(
          student.email,
          student.name,
          emailData
        );
      }
    } catch (emailErr) {
      console.error("Email failed (non-blocking):", emailErr.message);
    }

    res.json({
      message: "HOD decision updated",
      request
    });
  } catch (error) {
    console.error("Error updating HOD request:", error);
    res.status(500).json({ message: "Error updating request" });
  }
};*/

// server/controllers/hodController.js
const Request = require("../models/Request");
const User = require("../models/User");

// ✅ ADDED: Import email utilities
const {
  notifyStudentHodDecision,
  formatDateDisplay
} = require("../utils/sendEmail");

exports.getHodRequests = async (req, res) => {
  try {
    // ✅ ADDED: 1. Find who the logged-in HOD is
    const hod = await User.findById(req.user.id);
    if (!hod) {
      return res.status(404).json({ message: "HOD not found" });
    }

    // ✅ ADDED: 2. Filter requests by HOD's department ONLY
    const requests = await Request.find({
      status: { $in: ["tutor_approved", "hod_approved", "hod_rejected"] },
      department: hod.department // <--- THIS FIXES THE BUG
    }).sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error("Error fetching HOD requests:", error);
    res.status(500).json({ message: "Error fetching requests" });
  }
};

exports.hodDecision = async (req, res) => {
  try {
    const { status, comment } = req.body;

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // ✅ ADDED: Security check - Ensure HOD can only touch their own department's requests
    const hod = await User.findById(req.user.id);
    if (request.department !== hod.department) {
      return res.status(403).json({ message: "You can only handle requests from your department" });
    }

    request.status = status;
    request.hodComment = comment;

    await request.save();

    // ✅ EMAIL TO STUDENT
    try {
      const student = await User.findOne({ name: request.studentName });

      if (student && student.email) {
        const emailData = {
          ...request._doc,
          dateDisplay: formatDateDisplay(request)
        };
        await notifyStudentHodDecision(
          student.email,
          student.name,
          emailData
        );
      }
    } catch (emailErr) {
      console.error("Email failed (non-blocking):", emailErr.message);
    }

    res.json({
      message: "HOD decision updated",
      request
    });
  } catch (error) {
    console.error("Error updating HOD request:", error);
    res.status(500).json({ message: "Error updating request" });
  }
};