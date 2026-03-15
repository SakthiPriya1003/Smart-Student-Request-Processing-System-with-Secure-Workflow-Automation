const Request = require("../models/Request");

exports.getHodRequests = async (req, res) => {

  const requests = await Request.find({
    status: "tutor_approved"
  });

  res.json(requests);
};

exports.hodDecision = async (req, res) => {

  const { status, comment } = req.body;

  const request = await Request.findById(req.params.id);

  request.status = status;
  request.hodComment = comment;

  await request.save();

  res.json({
    message: "HOD decision updated",
    request
  });
};