//const nodemailer = require("nodemailer");
//
//const sendEmail = async (to, subject, text) => {
//  try {
//    const transporter = nodemailer.createTransport({
//      service: "gmail",
//      auth: {
//        user: process.env.EMAIL_USER,
//        pass: process.env.EMAIL_PASS
//      }
//    });

//    const mailOptions = {
//      from: process.env.EMAIL_USER,
//      to,
//      subject,
//      text
//    };

//    await transporter.sendMail(mailOptions);
//    console.log("Email sent successfully");
//  } catch (error) {
//    console.error("Email error:", error);
//  }
//};

//module.exports = sendEmail;

// server/utils/sendEmail.js
/*const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: `"Smart Request System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`❌ Email error to ${to}:`, error.message);
    return false;
  }
};

const getEmailTemplate = (title, bodyContent) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f4f7; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .body { padding: 30px; }
        .body h2 { color: #333; margin-top: 0; }
        .info-box { background: #f8f9fa; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        .info-row { display: flex; padding: 8px 0; border-bottom: 1px solid #eee; }
        .info-row:last-child { border-bottom: none; }
        .info-label { font-weight: 600; color: #555; width: 120px; flex-shrink: 0; }
        .info-value { color: #333; }
        .status-badge { display: inline-block; padding: 6px 16px; border-radius: 20px; font-weight: 600; font-size: 14px; }
        .status-approved { background: #d4edda; color: #155724; }
        .status-rejected { background: #f8d7da; color: #721c24; }
        .comment-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 15px 0; border-radius: 0 8px 8px 0; font-style: italic; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏫 Smart Request System</h1>
        </div>
        <div class="body">
          ${bodyContent}
        </div>
        <div class="footer">
          <p>This is an automated email from Smart Student Request Management System.</p>
          <p>© ${new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const notifyTutorNewRequest = async (tutorEmail, tutorName, requestData) => {
  const subject = `🔄 New ${requestData.requestType} Request from ${requestData.studentName}`;

  const body = `
    <h2>New Request Received</h2>
    <p>Dear <strong>${tutorName}</strong>,</p>
    <p>You have received a new request that requires your attention:</p>

    <div class="info-box">
      <div class="info-row">
        <span class="info-label">Student:</span>
        <span class="info-value">${requestData.studentName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Type:</span>
        <span class="info-value">${requestData.requestType}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Reason:</span>
        <span class="info-value">${requestData.reason || 'N/A'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Days:</span>
        <span class="info-value">${requestData.numDays || 'N/A'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Date(s):</span>
        <span class="info-value">${requestData.dateDisplay || 'N/A'}</span>
      </div>
      ${requestData.document ? `
      <div class="info-row">
        <span class="info-label">Document:</span>
        <span class="info-value">📎 Attached</span>
      </div>` : ''}
    </div>

    <p>Please log in to the system to review and take action.</p>
  `;

  return await sendEmail(tutorEmail, subject, getEmailTemplate(subject, body));
};

const notifyStudentTutorDecision = async (studentEmail, studentName, requestData) => {
  const isApproved = requestData.status === "tutor_approved";
  const statusText = isApproved ? "Approved" : "Rejected";
  const statusClass = isApproved ? "status-approved" : "status-rejected";
  const subject = `${isApproved ? '✅' : '❌'} Your ${requestData.requestType} Request has been ${statusText} by Tutor`;

  const body = `
    <h2>Update on Your Request</h2>
    <p>Dear <strong>${studentName}</strong>,</p>
    <p>Your request has been reviewed by your Tutor:</p>

    <div style="text-align: center; margin: 20px 0;">
      <span class="status-badge ${statusClass}">${statusText} by Tutor</span>
    </div>

    <div class="info-box">
      <div class="info-row">
        <span class="info-label">Request Type:</span>
        <span class="info-value">${requestData.requestType}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Reason:</span>
        <span class="info-value">${requestData.reason || 'N/A'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Date(s):</span>
        <span class="info-value">${requestData.dateDisplay || 'N/A'}</span>
      </div>
    </div>

    ${requestData.tutorComment ? `
      <div class="comment-box">
        <strong>💬 Tutor's Comment:</strong><br>
        "${requestData.tutorComment}"
      </div>
    ` : ''}

    ${isApproved ? `
      <p>Your request has been forwarded to the <strong>HOD</strong> for final approval. You will be notified once a decision is made.</p>
    ` : `
      <p>Your request has been rejected. Please contact your tutor for more details if needed.</p>
    `}
  `;

  return await sendEmail(studentEmail, subject, getEmailTemplate(subject, body));
};

const notifyStudentHodDecision = async (studentEmail, studentName, requestData) => {
  const isApproved = requestData.status === "hod_approved";
  const statusText = isApproved ? "Approved" : "Rejected";
  const statusClass = isApproved ? "status-approved" : "status-rejected";
  const subject = `${isApproved ? '🎉' : '❌'} Your ${requestData.requestType} Request has been ${statusText} by HOD`;

  const body = `
    <h2>Final Decision on Your Request</h2>
    <p>Dear <strong>${studentName}</strong>,</p>
    <p>Your request has received a final decision from the HOD:</p>

    <div style="text-align: center; margin: 20px 0;">
      <span class="status-badge ${statusClass}">✓ ${statusText} by HOD</span>
    </div>

    <div class="info-box">
      <div class="info-row">
        <span class="info-label">Request Type:</span>
        <span class="info-value">${requestData.requestType}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Reason:</span>
        <span class="info-value">${requestData.reason || 'N/A'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Date(s):</span>
        <span class="info-value">${requestData.dateDisplay || 'N/A'}</span>
      </div>
    </div>

    ${requestData.hodComment ? `
      <div class="comment-box">
        <strong>💬 HOD's Comment:</strong><br>
        "${requestData.hodComment}"
      </div>
    ` : ''}

    ${isApproved ? `
      <p>🎉 <strong>Congratulations!</strong> Your request has been fully approved. Please keep this email for your records.</p>
    ` : `
      <p>Your request has been rejected by the HOD. Please contact the department for further clarification if needed.</p>
    `}
  `;

  return await sendEmail(studentEmail, subject, getEmailTemplate(subject, body));
};

const formatDateDisplay = (req) => {
  if (req.requestType === "Marksheet") return "N/A";
  
  const fmt = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric"
    });
  };

  if (req.numDays === 1) return fmt(req.date);
  return `${fmt(req.fromDate)} → ${fmt(req.toDate)}`;
};

module.exports = {
  sendEmail,
  notifyTutorNewRequest,
  notifyStudentTutorDecision,
  notifyStudentHodDecision,
  formatDateDisplay
};*/

// ✅ ADDED: Force Node to find .env inside the server folder
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: `"Smart Request System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`❌ Email error to ${to}:`, error.message);
    return false;
  }
};

const getEmailTemplate = (title, bodyContent) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f4f7; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .body { padding: 30px; }
        .body h2 { color: #333; margin-top: 0; }
        .info-box { background: #f8f9fa; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        .info-row { display: flex; padding: 8px 0; border-bottom: 1px solid #eee; }
        .info-row:last-child { border-bottom: none; }
        .info-label { font-weight: 600; color: #555; width: 120px; flex-shrink: 0; }
        .info-value { color: #333; }
        .status-badge { display: inline-block; padding: 6px 16px; border-radius: 20px; font-weight: 600; font-size: 14px; }
        .status-approved { background: #d4edda; color: #155724; }
        .status-rejected { background: #f8d7da; color: #721c24; }
        .comment-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 15px 0; border-radius: 0 8px 8px 0; font-style: italic; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏫 Smart Request System</h1>
        </div>
        <div class="body">
          ${bodyContent}
        </div>
        <div class="footer">
          <p>This is an automated email from Smart Student Request Management System.</p>
          <p>© ${new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const notifyTutorNewRequest = async (tutorEmail, tutorName, requestData) => {
  const subject = `🔄 New ${requestData.requestType} Request from ${requestData.studentName}`;

  const body = `
    <h2>New Request Received</h2>
    <p>Dear <strong>${tutorName}</strong>,</p>
    <p>You have received a new request that requires your attention:</p>

    <div class="info-box">
      <div class="info-row">
        <span class="info-label">Student:</span>
        <span class="info-value">${requestData.studentName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Type:</span>
        <span class="info-value">${requestData.requestType}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Reason:</span>
        <span class="info-value">${requestData.reason || 'N/A'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Days:</span>
        <span class="info-value">${requestData.numDays || 'N/A'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Date(s):</span>
        <span class="info-value">${requestData.dateDisplay || 'N/A'}</span>
      </div>
      ${requestData.document ? `
      <div class="info-row">
        <span class="info-label">Document:</span>
        <span class="info-value">📎 Attached</span>
      </div>` : ''}
    </div>

    <p>Please log in to the system to review and take action.</p>
  `;

  return await sendEmail(tutorEmail, subject, getEmailTemplate(subject, body));
};

const notifyStudentTutorDecision = async (studentEmail, studentName, requestData) => {
  const isApproved = requestData.status === "tutor_approved";
  const statusText = isApproved ? "Approved" : "Rejected";
  const statusClass = isApproved ? "status-approved" : "status-rejected";
  const subject = `${isApproved ? '✅' : '❌'} Your ${requestData.requestType} Request has been ${statusText} by Tutor`;

  const body = `
    <h2>Update on Your Request</h2>
    <p>Dear <strong>${studentName}</strong>,</p>
    <p>Your request has been reviewed by your Tutor:</p>

    <div style="text-align: center; margin: 20px 0;">
      <span class="status-badge ${statusClass}">${statusText} by Tutor</span>
    </div>

    <div class="info-box">
      <div class="info-row">
        <span class="info-label">Request Type:</span>
        <span class="info-value">${requestData.requestType}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Reason:</span>
        <span class="info-value">${requestData.reason || 'N/A'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Date(s):</span>
        <span class="info-value">${requestData.dateDisplay || 'N/A'}</span>
      </div>
    </div>

    ${requestData.tutorComment ? `
      <div class="comment-box">
        <strong>💬 Tutor's Comment:</strong><br>
        "${requestData.tutorComment}"
      </div>
    ` : ''}

    ${isApproved ? `
      <p>Your request has been forwarded to the <strong>HOD</strong> for final approval. You will be notified once a decision is made.</p>
    ` : `
      <p>Your request has been rejected. Please contact your tutor for more details if needed.</p>
    `}
  `;

  return await sendEmail(studentEmail, subject, getEmailTemplate(subject, body));
};

const notifyStudentHodDecision = async (studentEmail, studentName, requestData) => {
  const isApproved = requestData.status === "hod_approved";
  const statusText = isApproved ? "Approved" : "Rejected";
  const statusClass = isApproved ? "status-approved" : "status-rejected";
  const subject = `${isApproved ? '🎉' : '❌'} Your ${requestData.requestType} Request has been ${statusText} by HOD`;

  const body = `
    <h2>Final Decision on Your Request</h2>
    <p>Dear <strong>${studentName}</strong>,</p>
    <p>Your request has received a final decision from the HOD:</p>

    <div style="text-align: center; margin: 20px 0;">
      <span class="status-badge ${statusClass}">✓ ${statusText} by HOD</span>
    </div>

    <div class="info-box">
      <div class="info-row">
        <span class="info-label">Request Type:</span>
        <span class="info-value">${requestData.requestType}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Reason:</span>
        <span class="info-value">${requestData.reason || 'N/A'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Date(s):</span>
        <span class="info-value">${requestData.dateDisplay || 'N/A'}</span>
      </div>
    </div>

    ${requestData.hodComment ? `
      <div class="comment-box">
        <strong>💬 HOD's Comment:</strong><br>
        "${requestData.hodComment}"
      </div>
    ` : ''}

    ${isApproved ? `
      <p>🎉 <strong>Congratulations!</strong> Your request has been fully approved. Please keep this email for your records.</p>
    ` : `
      <p>Your request has been rejected by the HOD. Please contact the department for further clarification if needed.</p>
    `}
  `;

  return await sendEmail(studentEmail, subject, getEmailTemplate(subject, body));
};

const formatDateDisplay = (req) => {
  if (req.requestType === "Marksheet") return "N/A";
  
  const fmt = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric"
    });
  };

  if (req.numDays === 1) return fmt(req.date);
  return `${fmt(req.fromDate)} → ${fmt(req.toDate)}`;
};

module.exports = {
  sendEmail,
  notifyTutorNewRequest,
  notifyStudentTutorDecision,
  notifyStudentHodDecision,
  formatDateDisplay
};