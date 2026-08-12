# Smart Student Request Processing System with Secure Workflow Automation

A full-stack web application designed to digitize and automate the process of submitting, reviewing, approving, and tracking student requests through a secure multi-level workflow.

## Overview

The Smart Student Request Processing System replaces manual student request handling with a centralized web-based platform.

Students can submit requests and track their status, while Tutors and HODs can review and process requests according to their roles. The system provides secure authentication, role-based access control, file uploads, email notifications, and request tracking.

## Key Features

- Student request submission and tracking
- Multi-level request approval workflow
- JWT-based user authentication
- Role-Based Access Control (RBAC)
- Role-specific dashboards for Students, Tutors, and HODs
- RESTful API architecture
- MongoDB Atlas database integration
- Secure document/file uploads using Multer
- Automated email notifications using Nodemailer
- Request status and approval tracking
- Responsive React.js user interface

## User Roles

### Student
- Register and securely log in
- Submit requests
- Upload supporting documents
- Track request status
- View approval/rejection updates

### Tutor
- View assigned student requests
- Review request details and documents
- Approve or reject requests
- Update request status

### HOD
- Review requests that reach the HOD level
- Approve or reject requests
- Track overall request workflow

## Technology Stack

### Frontend
- React.js
- HTML
- CSS
- Bootstrap

### Backend
- Node.js
- Express.js
- REST APIs

### Database
- MongoDB Atlas

### Authentication & Security
- JSON Web Tokens (JWT)
- Role-Based Access Control (RBAC)

### Other Tools
- Multer
- Nodemailer
- Git & GitHub
- Postman

## System Workflow

```text
Student
   |
   v
Submit Request
   |
   v
Tutor Review
   |
   +---- Rejected ----> Student
   |
   v
HOD Review
   |
   +---- Rejected ----> Student
   |
   v
Approved
   |
   v
Student Receives Status/Notification
```

## Project Structure

```text
Smart-Student-Request-Processing-System/
│
├── client/                 # React.js frontend
│   ├── src/
│   └── public/
│
├── server/                 # Node.js + Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
├── uploads/                # Uploaded documents
├── .gitignore
└── README.md
```

> The exact folder structure may vary depending on the current project implementation.

## Installation and Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd Smart-Student-Request-Processing-System
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Install frontend dependencies

```bash
cd ../client
npm install
```

### 4. Configure environment variables

Create a `.env` file in the backend directory.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password_or_app_password
```

Do not commit `.env` files or credentials to GitHub.

### 5. Run the backend

```bash
cd server
npm start
```

### 6. Run the frontend

```bash
cd client
npm start
```

The application will be available on the local development URLs configured by the project.

## API Testing

REST API endpoints can be tested using Postman.

Authentication is handled using JWT tokens, and protected endpoints require a valid token and appropriate user role.

## Security Features

- JWT-based authentication
- Role-Based Access Control
- Protected API routes
- Input and request validation
- Secure file upload handling
- Environment-based configuration for sensitive credentials

## Future Enhancements

- Advanced request analytics
- Audit logs for approval actions
- Cloud-based file storage
- Automated deployment using CI/CD

## Learning Outcomes

This project provided hands-on experience in:

- Full-stack web development
- REST API development
- React.js frontend development
- Node.js and Express.js backend development
- MongoDB database integration
- JWT authentication and RBAC
- API testing using Postman
- File upload and email service integration
- Git and GitHub based version control

## Author

**Sakthi Priya G**

B.E. Computer Science and Engineering (Cyber Security)  
PSNA College of Engineering and Technology
