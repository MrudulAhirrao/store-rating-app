# Store Rating System (Full-Stack Application)

![Status](https://img.shields.io/badge/Status-Completed-success)
![Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20PostgreSQL-blue)

A robust, full-stack web application built for a coding challenge. It allows users to discover and rate stores, enables store owners to track their business performance, and provides administrators with tools to manage the entire platform.

## 🔗 Live Deployment

 https://store-rating-app-dpgl.vercel.app/

---

## 🛠️ Tech Stack

This project follows modern best practices using a Monorepo-style structure.

### **Frontend**
* **Framework:** React.js (Vite)
* **Styling:** Tailwind CSS
* **UI Library:** Shadcn/UI (Radix Primitives)
* **State/Forms:** React Hook Form
* **Networking:** Axios
* **Notifications:** Sonner (Toast notifications)

### **Backend**
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** PostgreSQL (Hosted on Neon.tech)
* **ORM:** Prisma (Schema management & Migrations)
* **Authentication:** JWT (JSON Web Tokens) & Bcrypt
* **Validation:** Joi

---

## ✨ Key Features

### 🔐 Authentication & Security
* **Role-Based Access Control (RBAC):** distinct flows for `ADMIN`, `STORE_OWNER`, and `NORMAL_USER`.
* **Secure Auth:** Passwords hashed via Bcrypt; API routes protected via JWT middleware.
* **Auto-Provisioning:** When a user signs up as a "Store Owner", a store is automatically created for them.

### 👤 User Roles & Capabilities

| Role | Capabilities |
| :--- | :--- |
| **Admin** | • View all Users and Stores in a sortable Data Table.<br>• Filter users by Role.<br>• Create new Stores manually.<br>• Assign Owners to Stores. |
| **Store Owner** | • Access a dedicated Dashboard.<br>• View average rating statistics.<br>• See a list of users who rated their specific store. |
| **Normal User** | • Browse all stores in a Grid View.<br>• Search stores by **Name** or **Address** (Debounced search).<br>• Submit ratings (1-5 Stars).<br>• Real-time rating updates. |

---

## 🗄️ Database Schema

The project uses a relational PostgreSQL database managed by Prisma.

* **User:** Stores profile info and Role (`ADMIN`, `NORMAL_USER`, `STORE_OWNER`).
* **Store:** Linked to a specific Owner (One-to-One). Stores average rating for performance.
* **Rating:** Links a User to a Store. Includes a composite unique constraint to ensure a user can only rate a store once (updates existing rating on subsequent attempts).

---
