const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getHodRequests,
  hodDecision
} = require("../controllers/hodController");

router.get(
  "/requests",
  protect,
  authorize("hod"),
  getHodRequests
);

router.put(
  "/requests/:id",
  protect,
  authorize("hod"),
  hodDecision
);

module.exports = router;