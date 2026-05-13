# Secure Library Management System

A full-stack Library Management System built using the MERN Stack with JWT Authentication and Role-Based Access Control (RBAC).

This project allows authenticated users to browse and borrow books while restricting book management operations such as adding, editing, and deleting books to admin users only.

---

# Features

## Authentication & Security
- JWT-based Authentication
- Secure Password Hashing using bcryptjs
- Protected API Routes
- Role-Based Access Control (RBAC)
- Persistent Login using localStorage
- Unauthorized Access Protection

---

## User Features
- Register Account
- Login / Logout
- View Available Books
- Search Books
- Filter Books by Status
- Borrow Books
- Return Books

---

## Admin Features
- Add New Books
- Edit Existing Books
- Delete Books
- Manage Book Status

---

# Tech Stack Used

## Frontend
- React.js
- React Router DOM
- Tailwind CSS
- Axios
- Context API

---

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- dotenv
- cors

---

# Project Structure

## Frontend Structure

```bash
frontend/
│
├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   └── App.jsx
Backend Structure
backend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── utils/
│   └── server.js
│
├── .env
└── package.json
How The Tasks Were Implemented
1. Authentication

Implemented JWT-based authentication using:

jsonwebtoken
bcryptjs
APIs
POST /api/auth/register
POST /api/auth/login
Flow
User registers with username and password
Password gets hashed using bcryptjs
JWT token generated during login
Token stored in localStorage
Protected routes validated using JWT middleware
2. Role-Based Access Control (RBAC)

Implemented middleware-based authorization.

User Permissions
View Books
Borrow / Return Books
Admin Permissions
Add Books
Edit Books
Delete Books
Security Logic

Admin-only routes are protected using role verification middleware.

Example:

if (req.user.role !== "admin") {
  return res.status(403).json({
    message: "Access denied",
  });
}
3. CRUD Operations

Implemented complete CRUD operations for books.

APIs
GET /api/books
POST /api/books
PUT /api/books/:id
DELETE /api/books/:id
PATCH /api/books/:id/status
4. Search & Filter

Implemented:

Search by title or author
Filter by status
available
borrowed
Environment Variables Setup

Create a .env file inside backend root.

Backend .env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
Installation & Setup Instructions
1. Clone Repository
git clone <your-github-repo-url>
2. Setup Backend
cd backend
npm install

Run Backend:

npm run dev
3. Setup Frontend
cd frontend
npm install
npm run dev
MongoDB Setup

Use:

MongoDB Atlas
OR
Local MongoDB

Update connection string inside .env.

Admin Account Setup

For security reasons, all newly registered users are assigned the user role by default.

To create an admin:

Step 1

Register normally from frontend.

Example:

Username: admin
Password: admin123
Step 2

Open MongoDB Compass.

Go to:

users collection

Update role:

"role": "user"

to:

"role": "admin"
Step 3

Logout and login again.

Now admin features become available.

Seed Initial Books

Run the seed script:

node src/seed/seedBooks.js

This will insert sample books into MongoDB.

Security Measures Implemented
JWT Authentication
Password Hashing
Protected Routes
Role-Based Authorization
Environment Variables Protection
API Error Handling
Future Improvements
Refresh Token Implementation

Author
Vaishnavi Dayama
