# Finance Data Processing and Access Control Backend

A comprehensive backend API system for managing financial transactions with role-based access control, built with Node.js, Express, and MongoDB.

---

## 🎯 **Project Overview**

This backend application provides a complete solution for financial data management with:

- **User Authentication & Authorization** (JWT-based)
- **Role-Based Access Control** (Viewer, Analyst, Admin)
- **Financial Transaction Management** (CRUD operations)
- **Dashboard Analytics** (Summary, trends, category breakdown)
- **Rate Limiting & Security** (Protection against abuse)

---

## 🚀 **Features**

### **Authentication & Authorization**
- ✅ User registration for Viewer and Analyst roles
- ✅ Secure login with JWT tokens
- ✅ Admin creation via seed script or secret key
- ✅ Password hashing with bcrypt
- ✅ Token-based session management

### **Role-Based Permissions**

| Role | Permissions |
|------|-------------|
| **Viewer** | • View transactions<br>• View recent activity<br>• Read-only access |
| **Analyst** | • All Viewer permissions<br>• Access dashboard analytics<br>• View reports, trends & breakdowns |
| **Admin** | • All Analyst permissions<br>• Create/Update/Delete transactions<br>• Manage users (promote, demote, deactivate)<br>• Full system access |

### **Transaction Management**
- ✅ Create income/expense transactions (Admin only)
- ✅ View all transactions (All authenticated users)
- ✅ Update/Delete transactions (Admin only)
- ✅ Filter by type, category, and date range
- ✅ Track transaction creator

### **Dashboard & Analytics**
- ✅ Summary (Total income, expenses, net balance)
- ✅ Category-wise breakdown
- ✅ Monthly trends analysis
- ✅ Recent activity feed

### **Security Features**
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Rate limiting (prevents brute force & spam)
- ✅ Role-based route protection
- ✅ Input validation
- ✅ Error handling middleware

---

## 🛠️ **Tech Stack**

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT)
- **Security:** bcryptjs, express-rate-limit
- **Environment:** dotenv

---

## 📁 **Project Structure**
