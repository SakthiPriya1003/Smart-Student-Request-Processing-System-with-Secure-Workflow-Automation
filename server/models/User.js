const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["student", "tutor", "hod"],
      default: "student"
    },

    // Academic Details
    department: {
      type: String,
      required: true
    },
    year: {
      type: String,
      required: true
    },
    section: {
      type: String,
      required: true
    },

    // Only for students
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);