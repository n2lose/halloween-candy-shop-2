# 🎃 Freddy's Halloween Dashboard (Full-stack Assignment)

## 🎯 Objective

Implement a **full-stack analytics dashboard** using:

* **Frontend**: TypeScript + React
* **Backend**: Node.js + Express.js (local server)

---

## 📖 Brief

Freddy loves Halloween and opened an online artisanal Halloween candy shop. The shop has grown quickly, and now Freddy needs a **web application to manage candy orders and analytics**.

You are tasked with building:

* A **React frontend dashboard**
* A **local Express.js backend API** to simulate production behavior

---

## 🛠️ Tech Stack

### Frontend

* TypeScript
* React
* Charting library (e.g., Chart.js, Recharts)

### Backend

* Node.js
* Express.js
* JWT Authentication
* In-memory database or JSON file

---

## 📦 Project Structure (Suggested)

```
project-root/
│
├── frontend/        # React app
├── backend/         # Express API
├── public/          # Built frontend (production build)
└── README.md
```

---

## 🔐 Backend Requirements (Express.js)

### 1. Authentication

#### POST `/login`

Request:

```json
{
  "username": "freddy",
  "password": "ElmStreet2019"
}
```

Response:

```json
{
  "access_token": "jwt_token",
  "refresh_token": "refresh_token"
}
```

* Access token expires in **15 minutes**
* Refresh token expires in **30 days**
* Return error for invalid credentials

---

#### POST `/refresh`

Headers:

```
Authorization: Bearer <refresh_token>
```

Response:

```json
{
  "access_token": "new_access_token"
}
```

---

### 2. Dashboard API

#### GET `/dashboard`

Headers:

```
Authorization: Bearer <access_token>
```

Response example:

```json
{
  "sales_overview": {
    "weekly": [],
    "yearly": []
  },
  "top_products": [],
  "best_sellers": []
}
```

---

### 3. Orders API

#### GET `/orders?page=1&q=search_term`

Headers:

```
Authorization: Bearer <access_token>
```

Response:

```json
{
  "orders": [],
  "total": 50,
  "page": 1
}
```

Requirements:

* Pagination
* Search (by product name or customer)
* Mock dataset

---

## 💻 Frontend Requirements (React)

### 1. Login Page

* Form: username & password
* Call `/login`
* Store tokens (access + refresh)
* Handle login errors

---

### 2. Dashboard Page

* Fetch data from `/dashboard`
* Display charts
* Toggle:

  * Weekly view
  * Yearly view
* Handle token expiration (auto refresh)

---

### 3. Orders Page

* Fetch from `/orders`
* Features:

  * Search input
  * Pagination
  * Table display

---

## 🔁 Token Handling

* Automatically refresh token when expired
* Retry failed requests after refreshing
* Logout if refresh token is invalid

---

## 📊 Data Handling

Use:

* Static JSON file OR
* In-memory array

Example:

```ts
const orders = [
  {
    id: 1,
    product: "Pumpkin Candy",
    customer: "John Doe",
    date: "2025-10-10",
    status: "delivered"
  }
];
```

---

## 📦 Deliverables

* Full source code (frontend + backend)
* Folder `public/` containing built frontend
* README with:

  * Setup instructions
  * How to run project

---

## 🧪 Evaluation Criteria

### Code Quality

* TypeScript best practices
* Clean architecture
* Reusable components

### Functionality

* Login works
* Dashboard works
* Orders search & pagination work

### Backend Design

* Proper API structure
* JWT handling
* Error handling

### Maintainability

* Clean folder structure
* Separation of concerns

### Testing (Bonus)

* Unit tests

---

## 🚀 Bonus Points

* Use React Query / Zustand / Redux
* Add loading & error states
* Docker setup
* Use database (MongoDB, SQLite)

---

## ▶️ Running the Project

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🎉 Summary

This assignment transforms:

👉 Frontend-only + external API
➡️ Into
👉 Full-stack application (React + Express + JWT)

---

Happy coding! 🚀
