# Campus Connect - College Event Management System

Campus Connect is a comprehensive web application designed to streamline the management and discovery of college events. It allows students to browse, filter, and register for events while providing administrators with tools to create and manage them.

## 🚀 Features

-   **Event Discovery:** Browse events by category (Hackathon, Workshop, Cultural, TechFest).
-   **Advanced Filtering:** Search events by name or filter by category.
-   **Event Details:** View detailed information including date, time, venue, rules, and coordinators.
-   **Registration:** Students can register for events instantly.
-   **Admin Dashboard:** Secure admin interface to create and manage events.
-   **Responsive Design:** Fully optimized for desktop and mobile devices.

## 🛠️ Tech Stack

-   **Frontend:** React, Vite, TypeScript, Tailwind CSS, Shadcn UI
-   **Backend:** Node.js, Express.js
-   **Database:** Firebase Firestore
-   **Authentication:** Firebase Auth (planned/in-progress)

## 📋 Prerequisites

-   Node.js (v16 or higher)
-   npm or yarn
-   Firebase Account

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/campus-connect.git
cd campus-connect
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

**Configuration:**
Create a `.env` file in the `backend` directory:
```env
PORT=3000
```
*Note: You also need a `serviceAccountKey.json` file in the `backend` directory for Firebase admin access.*

Start the backend server:
```bash
npm start
```
The server will run on `http://localhost:3000`.

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd ../forntend/campus-connect
npm install
```

Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:8080`.

## 📦 Deployment

### Backend (Render)
1.  Push code to GitHub.
2.  Create a Web Service on Render.
3.  Set Root Directory to `backend`.
4.  Add `serviceAccountKey.json` content as a secret file or environment variable.

### Frontend (Vercel)
1.  Import repository to Vercel.
2.  Set Root Directory to `forntend/campus-connect`.
3.  Add `VITE_API_BASE_URL` environment variable pointing to your Render backend URL.

## 📝 License
This project is licensed under the MIT License.