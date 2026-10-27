# 01 — Project Overview & Requirements (extracted from the assessment PDF)

## 1. Overview
**Doctor Tracker** is a secure administrative web application that lets authenticated users manage doctors and their patients. Focus: performance optimization, clean UX, data visualization.

## 2. Core Features

### 2.1 Authentication
- Only authenticated users can access the portal.
- Secure login.
- All routes protected with proper authentication AND authorization.

### 2.2 Doctor Management (Admin can)
- Create a doctor: **name, specialization, hospital, phone, email**.
- View list of all doctors.
- Search doctors.
- Filter doctors (date-wise + other relevant filters, e.g. specialization, hospital).
- Paginate doctor records.
- View corresponding patients of each doctor.
- Add new patients under a specific doctor.
- Delete patients from the doctor's patient list.

### 2.3 Patient Management (dedicated Patient page)
- List all patients.
- Edit patient information.
- Delete patients.
- Pagination.
- Search.
- Filtering: date-wise, patient condition, other relevant filters.

## 3. Dashboard & Data Visualization
Admin dashboard must include visual representation of data and analytics:
- Total doctors
- Total patients
- Patients per doctor
- Date-based statistics
- Charts and graphs (any suitable library)

Focus: clean data aggregation, optimized query performance, meaningful visual insights.

## 4. UI/UX Requirements
- Modern, visually appealing; demonstrates strong frontend skills.
- Clean layout, proper spacing and hierarchy, responsive design, smooth navigation, UX best practices.
- Clear navigation between **Dashboard, Doctors, Patients**.

## 5. Performance & Optimization
- Optimize DB queries for searching, filtering, pagination.
- Proper MongoDB indexing.
- Efficient query patterns.
- Avoid unnecessary re-renders.
- Clean folder structure.
- Reusable components.
- API validation and error handling.

## 6. Tech Stack (mandatory)
- Next.js, Node.js, Express, MongoDB, RESTful API design.
- Proper state management and data fetching strategies.
- NOTE: the PDF lists two variants (full-stack inside Next.js vs. separate Next.js client + standalone Express server). See file 02 for the decision.

## 7. Evaluation Criteria
Code structure & cleanliness · Query optimization · UX/UI quality · Data visualization · Performance efficiency · Authentication implementation · Best practices in Next.js and MongoDB · Scalability considerations.

## 8. README Requirements (standardized)
1. Elevator pitch (one paragraph)
2. Setup guide (step by step; must include `.env.example`)
3. System architecture (data flow + service interactions)
4. Technical decisions (deep dive into exactly 2)
5. Visual evidence (high-quality screenshots, Desktop & Mobile)

## 9. Submission
Submit **project link (deployed)** and **GitHub repo**, with **credentials** if required (provide demo admin login).
