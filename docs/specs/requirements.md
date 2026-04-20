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

#### POST `/auth/register`

Request:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secretPassword123"
}
```

Response:

```json
{
  "access_token": "jwt_token",
  "refresh_token": "refresh_token"
}
```

* Creates a new user account
* Return error if email already registered

---

#### POST `/auth/login`

Request:

```json
{
  "email": "freddy@halloween.shop",
  "password": "<SEED_PASSWORD>"
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

#### POST `/auth/refresh`

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

#### GET `/auth/me` (protected)

Response:

```json
{
  "id": "usr_abc123",
  "name": "Freddy",
  "email": "freddy@halloween.shop"
}
```

---

### 2. Products API

#### GET `/products` (public)

Response: Array of 10 Halloween candy products with id, name, emoji, price, stock.

#### GET `/products/:id` (public)

Response: Single product or 404.

---

### 3. Dashboard API

#### GET `/dashboard` (protected)

Response example:

```json
{
  "stats": { "today": {}, "last_week": {}, "last_month": {} },
  "sales_overview": { "weekly": [], "yearly": [] },
  "bestsellers": []
}
```

---

### 4. Stripe Payment

#### POST `/stripe/create-payment-intent` (protected)

Request:

```json
{
  "items": [{ "productId": "prod_1", "quantity": 2 }]
}
```

Response:

```json
{
  "clientSecret": "pi_xxx_secret_yyy",
  "amount": 599
}
```

* Uses Stripe SDK in **test mode** — never charges real money
* Test card: `4242 4242 4242 4242`

---

### 5. Orders API

#### POST `/orders` (protected)

Request:

```json
{
  "paymentIntentId": "pi_xxx",
  "customer": { "name": "Jane", "email": "jane@example.com", "address": "123 Elm St" },
  "items": [{ "productId": "prod_1", "quantity": 2 }]
}
```

* Backend verifies PaymentIntent status with Stripe before persisting
* Card number stored as last-4 only
* Returns full order detail with orderId

#### GET `/orders` (protected)

```json
{
  "orders": [],
  "total": 12,
  "page": 1,
  "per_page": 10,
  "total_pages": 2
}
```

* Returns only orders belonging to the authenticated user
* Pagination support

#### GET `/orders/:id` (protected)

* Returns full order detail
* Returns 403 if order does not belong to current user
* Returns 404 if order not found

---

## 💻 Frontend Requirements (React)

### 1. Login Page

* Form: email & password
* Call `/auth/login`
* Store tokens (access + refresh)
* Handle login errors
* Link to Register page

---

### 2. Register Page

* Form: name, email, password, confirm password
* Call `/auth/register`
* Store tokens on success
* Redirect to Dashboard

---

### 3. Dashboard Page

* Fetch data from `/dashboard`
* Display stats cards (Today / Last Week / Last Month)
* Display charts with toggle:

  * Weekly view (last 7 days)
  * Yearly view (last 12 months)
* Display bestsellers table
* Handle token expiration (auto refresh)

---

### 4. Orders Page (History)

* Fetch from `/orders`
* Features:

  * Paginated table of past orders
  * Click order → order detail view (`/orders/:id`)

---

### 5. Checkout Page

* Shipping form: name, email, address
* Stripe Card Element for payment (`@stripe/react-stripe-js`)
* Order summary sidebar
* On submit: create PaymentIntent → confirm card → POST /orders
* Redirect to Order Confirmation page
* **Post-checkout navigation**: After successful order, use `navigate(path, { replace: true })` to prevent back-button re-submission. Clear cart after successful order.

---

### 6. Product List Page

* Fetch from `/products`
* Grid of 10 Halloween candy products
* Add to cart functionality
* Cart icon with item count badge

---

### 7. Cart

* Slide-out drawer from right
* Quantity +/−, remove item, subtotal
* "Checkout" button → requires login
* **Cart scope**: Cart is per-user — clear localStorage cart on logout. When a new user logs in, they start with an empty cart.
* **Price freshness**: Cart stores `productId` and `quantity` only. Display prices are fetched from `/products` on cart open to ensure freshness. The backend always calculates the actual amount server-side.

---

## 🔁 Token Handling

* Automatically refresh token when expired
* Retry failed requests after refreshing
* Logout if refresh token is invalid
* **Concurrent refresh**: When multiple API calls receive 401 simultaneously, the axios interceptor must queue all failed requests and send only **one** refresh call. After the refresh succeeds, replay all queued requests with the new token. If refresh fails, logout and redirect all.

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
