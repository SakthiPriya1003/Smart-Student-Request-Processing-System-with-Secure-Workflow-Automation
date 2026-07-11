//const mongoose = require("mongoose");



//const requestSchema = new mongoose.Schema({
  //studentName: { type: String, required: true },
  //tutorName: { type: String, required: true },
  //requestType: { type: String, required: true }, // OD, Leave, Assignment Help
  //reason: { type: String, required: true },      // mandatory for OD/Leave
  //numDays: { type: Number },                     // required only for OD/Leave
  //date: { type: Date },                          // single date if numDays=1
  //fromDate: { type: Date },                      // start date if numDays>1
  //toDate: { type: Date },                        // end date if numDays>1
  //document: { type: String },                    // path to uploaded file
  //status: { type: String, default: "pending" },
  //createdAt: { type: Date, default: Date.now },
//});


//module.exports = mongoose.model("Request", requestSchema);

/*const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  tutorName: { type: String, required: true },

  requestType: { type: String, required: true },
  reason: { type: String, required: true },

  numDays: { type: Number },
  date: { type: Date },
  fromDate: { type: Date },
  toDate: { type: Date },

  document: { type: String },

  status: {
    type: String,
    enum: [
      "pending",
      "tutor_approved",
      "tutor_rejected",
      "hod_approved",
      "hod_rejected"
    ],
    default: "pending"
  },

  tutorComment: String,
  hodComment: String,

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Request", requestSchema);*/

// server/models/Request.js
/*const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  tutorName: { type: String, required: true },

  requestType: { type: String, required: true },
  reason: { type: String, required: true },

  // ✅ ADDED: Attendance field
  attendance: { type: Number, default: null },

  numDays: { type: Number },
  date: { type: Date },
  fromDate: { type: Date },
  toDate: { type: Date },

  document: { type: String },

  status: {
    type: String,
    enum: [
      "pending",
      "tutor_approved",
      "tutor_rejected",
      "hod_approved",
      "hod_rejected"
    ],
    default: "pending"
  },

  tutorComment: String,
  hodComment: String,

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Request", requestSchema);*/

// server/models/Request.js
const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  tutorName: { type: String, required: true },
  
  // ✅ ADDED: Department field
  department: { type: String, required: true },

  requestType: { type: String, required: true },
  reason: { type: String, required: true },

  attendance: { type: Number, default: null },

  numDays: { type: Number },
  date: { type: Date },
  fromDate: { type: Date },
  toDate: { type: Date },

  document: { type: String },

  status: {
    type: String,
    enum: [
      "pending",
      "tutor_approved",
      "tutor_rejected",
      "hod_approved",
      "hod_rejected"
    ],
    default: "pending"
  },

  tutorComment: String,
  hodComment: String,

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Request", requestSchema);