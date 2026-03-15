const Request = require("../models/Request");

// View tutor requests
exports.getTutorRequests = async (req, res) => {
  try {

    const tutorName = req.user.name;

    const requests = await Request.find({
      tutorName,
      status: "pending"
    });

    res.json(requests);

  } catch (error) {
    res.status(500).json({ message: "Error fetching requests" });
  }
};

// Tutor decision
exports.tutorDecision = async (req, res) => {

  try {

    const { status, comment } = req.body;

    const request = await Request.findById(req.params.id);

    request.status = status;
    request.tutorComment = comment;

    await request.save();

    res.json({
      message: "Tutor decision updated",
      request
    });

  } catch (error) {
    res.status(500).json({ message: "Error updating request" });
  }
};