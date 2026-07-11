//const express = require("express");
//const router = express.Router();
//const User = require("../models/User");

//router.get("/", async (req, res) => {
  //try {
    //const { department, year, section } = req.query;

    //const tutors = await User.find({
      //role: "tutor",
      //department,
      //year,
      //section
    //}).select("_id name");

    //res.json(tutors);

  //} catch (error) {
    //res.status(500).json({ message: "Error fetching tutors" });
  //}
//});

//module.exports = router;


// server/routes/tutorRoutes.js
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getTutorRequests,
  tutorDecision,
  getAllTutors
} = require("../controllers/tutorController");

// Get all tutors (public - needed for registration dropdown)
router.get("/", getAllTutors);

// Tutor request routes (PROTECTED)
router.get(
  "/requests",
  protect,
  authorize("tutor"),
  getTutorRequests
);

router.put(
  "/requests/:id",
  protect,
  authorize("tutor"),
  tutorDecision
);

module.exports = router;