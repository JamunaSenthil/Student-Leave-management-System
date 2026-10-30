# CampusLeave – Student Leave Management System (SLMS)
## Complete Full-Stack Web Application

A production-grade, multi-tier college leave clearance and gate-pass management system built with **React**, **Node.js**, **Express**, **MongoDB (Mongoose ODM)**, **JWT Authentication**, and **Tailwind CSS**.

---

## 1. System Overview

CampusLeave digitizes the entire student leave lifecycle across 3 distinct institutional user roles:
1. **Student**: Registers, submits leave applications with reason, destination, and guardian details, tracks the live approval pipeline, views HOD/Warden decisions, and downloads digital gate passes upon clearance.
2. **Head of Department (HOD)**: Manages academic department approvals, reviews student reason and attendance impact, approves or rejects with mandatory remarks, and audits clearance history.
3. **Hostel Warden**: Manages residential gate permissions, validates room residency and parent contact, clears or rejects gate passes, and logs audit histories.

---

## 2. Multi-Tier Approval Workflow Engine

```
[ Stage 1: Student Application ]
                │
                ▼
     (HOD Status: Pending)
   (Warden Status: Pending)
   (Overall Status: Pending)
                │
    ┌───────────┴───────────┐
    ▼                       ▼
[ Stage 2: HOD Review ]   [ Stage 3: Warden Review ]
    │                       │
 ┌──┴──┐                 ┌──┴──┐
 │     │                 │     │
Appr  Rej               Appr  Rej
 │     │                 │     │
 └─────┼─────────────────┼─────┘
       │                 │
       ▼                 ▼
[ Stage 4: Strict Backend Final Evaluation ]
- If EITHER HOD or Warden REJECTS ──► Overall Status = REJECTED
- If BOTH HOD and Warden APPROVE ──► Overall Status = APPROVED (Gate Pass Issued)
- Otherwise ───────────────────────► Overall Status = PENDING
```

---

## 3. Pre-Seeded Authorized Demo Accounts

For instant evaluation, the system seeds pre-configured demo credentials:

### A. Student Account
- **Register Number**: `2023CSE042`
- **Email**: `rahul.cse@student.edu`
- **Password**: `password123`
- **Department**: Computer Science and Engineering
- **Hostel**: Kaveri Boys Hostel (Room A-204)

### B. Head of Department (HOD) Accounts
- **CSE Department**:
  - Email: `hod.cse@campus.edu`
  - Password: `password123`
  - Name: Dr. Robert Vance
- **ECE Department**:
  - Email: `hod.ece@campus.edu`
  - Password: `password123`
  - Name: Dr. Sarah Jenkins
- **Mechanical Engineering**:
  - Email: `hod.mech@campus.edu`
  - Password: `password123`
  - Name: Dr. Arthur Davis
- **Information Technology**:
  - Email: `hod.it@campus.edu`
  - Password: `password123`
  - Name: Dr. Emily Chen

### C. Hostel Warden Accounts
- **Kaveri Boys Hostel (Block A)**:
  - Email: `warden.kaveri@campus.edu`
  - Password: `password123`
  - Name: Mr. Michael Turner
- **Ganga Boys Hostel (Block B)**:
  - Email: `warden.ganga@campus.edu`
  - Password: `password123`
  - Name: Mr. David Miller
- **Yamuna Girls Hostel (Block C)**:
  - Email: `warden.yamuna@campus.edu`
  - Password: `password123`
  - Name: Ms. Priya Sharma
- **Saraswati Girls Hostel (Block D)**:
  - Email: `warden.saraswati@campus.edu`
  - Password: `password123`
  - Name: Ms. Anita Patel

*(Note: The login page also includes a **1-Click Autofill** button for rapid testing).*

---

## 4. RESTful API Architecture

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/student/register` | Register new student account with validation |
| `POST` | `/api/auth/hod/register` | Register new Head of Department (HOD) account |
| `POST` | `/api/auth/warden/register` | Register new Hostel Warden account |
| `POST` | `/api/auth/student/login` | Student login with Register No/Email and password |
| `POST` | `/api/auth/hod/login` | Authorized HOD login |
| `POST` | `/api/auth/warden/login` | Authorized Warden login |
| `POST` | `/api/auth/logout` | Secure session termination |
| `GET` | `/api/auth/me` | Fetch fresh authenticated user profile |

### Student Routes (`/api/students`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/students/profile` | Retrieve student profile details |
| `PATCH` | `/api/students/profile` | Update permitted contact and room details |
| `GET` | `/api/students/dashboard` | Dashboard metrics and recent submissions |

### Leave Management Routes (`/api/leaves`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/leaves` | Submit new leave application (auto duration calculation) |
| `GET` | `/api/leaves/my-leaves` | Search, filter, and paginate student's own leaves |
| `GET` | `/api/leaves/:id` | View specific leave details |
| `GET` | `/api/leaves/:id/track` | Retrieve visual clearance timeline and gate pass |

### HOD Routes (`/api/hod`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/hod/dashboard` | Department statistics and pending reviews |
| `GET` | `/api/hod/students` | List enrolled students in HOD's department |
| `GET` | `/api/hod/leaves` | List department leave requests with filters |
| `GET` | `/api/hod/leaves/:id` | View department leave application |
| `PATCH` | `/api/hod/leaves/:id/decision` | Approve or Reject with remarks |

### Warden Routes (`/api/warden`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/warden/dashboard` | Hostel statistics and pending gate clearances |
| `GET` | `/api/warden/students` | List student residents in assigned hostel |
| `GET` | `/api/warden/leaves` | List hostel resident leave requests |
| `GET` | `/api/warden/leaves/:id` | View hostel leave application |
| `PATCH` | `/api/warden/leaves/:id/decision` | Approve or Reject gate pass with remarks |

### Notification Routes (`/api/notifications`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/notifications` | Fetch unread and recent alerts for current user |
| `PATCH` | `/api/notifications/:id/read` | Mark individual notification as read |
| `PATCH` | `/api/notifications/read-all` | Mark all notifications read |

---

## 5. Security & Data Integrity

1. **Password Encryption**: All passwords stored using `bcryptjs` with salt rounds. Plaintext passwords never enter the database or leave in API responses.
2. **JWT Authorization**: Cryptographically signed tokens with 7-day expiration.
3. **Role-Based Access Control (RBAC)**: Backend middleware strictly enforces access rules (`requireRole(['student'])`, `requireRole(['hod'])`, `requireRole(['warden'])`).
4. **Data Jurisdiction Isolation**:
   - An HOD can **only** query or review leave requests belonging to their department.
   - A Warden can **only** query or review leave requests belonging to their hostel.
   - Students cannot view or tamper with other students' records.
5. **Two-Tier Validation**: Overall status is computed strictly on the backend during decision submission.

---

## 6. Execution & Setup Instructions

### Environment Variables (`.env`)
```bash
PORT=3000
JWT_SECRET=slms_campus_secret_key_production_2026_xyz
MONGODB_URI= # Leave empty to use embedded real MongoDB engine, or supply mongodb+srv://...
```

### Installation & Run
```bash
# 1. Install dependencies
npm install

# 2. Run full-stack application (starts Express server + MongoDB engine + Vite)
npm run dev

# 3. Build for production
npm run build
npm run start
```
The application will be accessible at `http://localhost:3000`.
