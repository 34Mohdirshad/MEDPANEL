# Medical Gallery Portal with Admin Panel

A secure, professional web application for managing and displaying clinical medical records, reports, and scans.

## 🚀 Quick Start (Local Setup)

### 1. Backend Setup
1.  Navigate to `/server`
2.  Install dependencies: `npm install`
3.  Configure `.env` file with your credentials:
    -   `MONGODB_URI`: Your MongoDB Atlas connection string.
    -   `JWT_SECRET`: A secure key for auth.
    -   `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: From your Cloudinary Dashboard.
4.  Seed the database: `node seed.js` (Creates default admin: `admin / adminpassword123`).
5.  Start server: `npm run dev`

### 2. Frontend Setup
1.  Navigate to `/client`
2.  Install dependencies: `npm install`
3.  Start development server: `npm run dev`
4.  Access the app at `http://localhost:3000`

## 🏗️ Technical Stack
-   **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Axios, React Router 7.
-   **Backend**: Node.js, Express, MongoDB/Mongoose.
-   **Storage**: Cloudinary (Cloud-based storage for medical files).
-   **Auth**: JWT (Stateless Authentication).

## ⚕️ Key Features
-   **Public Gallery**: Responsive grid view with category filters and search.
-   **Admin Dashboard**: Statistical overview of medical data ingestion.
-   **Record Management**: Full CRUD on medical files including PDF and Image support.
-   **Secure Ingestion**: Validated file upload pipeline with 10MB limit.
-   **Clinical Design**: Professional hospital-grade UI with smooth animations.

## 🌍 Deployment Options
-   **Frontend**: Vercel or Netlify.
-   **Backend**: Render, Railway, or Heroku.
-   **Database**: MongoDB Atlas.
