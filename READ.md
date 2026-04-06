API Documenatation ---  https://documenter.getpostman.com/view/50990912/2sBXiqG9oq  

Live Link-https://finance-data-processing-and-access-control-production-7fa6.up.railway.app

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

## ⚖️ Trade-offs & Design Decisions

### 1. **Role Model Simplicity**

**Decision:** Three fixed roles (Viewer, Analyst, Admin)

**Trade-off:**
- ✅ **Pros:** Simple to understand, implement, and maintain. Clear separation of concerns. Easy to test and document.
- ❌ **Cons:** Less flexible than permission-based systems. Cannot create custom roles or fine-grained permissions.

---

### 2. **Admin Creation Strategy**

**Decision:** First admin created through seed script; additional admins via promotion or secret key

**Trade-off:**
- ✅ **Pros:** Highly secure (no public endpoint for admin creation). Controlled initial setup. Prevents unauthorized admin creation.
- ❌ **Cons:** Requires server/database access for initial setup. Cannot create admin through UI without secret key.

**Rationale:** Prevents security vulnerability where anyone could create admin accounts. The secret key method provides flexibility while maintaining security.

**Alternative Considered:** Admin approval workflow (new users request admin role)

**Why Not Chosen:** Requires email service integration, approval queue system, and notification mechanism (out of scope).

---

### 3. **JWT Token Expiration (24 Hours)**

**Decision:** Tokens expire after 24 hours

**Trade-off:**
- ✅ **Pros:** Balance between security and user convenience. Reduces risk of token theft. Industry standard for non-critical applications.
- ❌ **Cons:** Users must re-login daily. No "remember me" functionality.

**Rationale:** 24 hours is standard for financial applications. Shorter expiration would burden users; longer expiration increases security risk.

**Alternative Considered:** Refresh token mechanism (access token: 15 min, refresh token: 7 days)

**Why Not Chosen:** Adds complexity with refresh token storage, rotation, and revocation. 24h access token sufficient for demonstration.

---

### 4. **No Pagination on Transaction Lists**

**Decision:** Return all transactions in single response

**Trade-off:**
- ✅ **Pros:** Simpler implementation. Faster development. No additional query parameters needed.
- ❌ **Cons:** Performance issues with large datasets (>1000 records). High memory usage. Slow API responses.


5. On-Demand Dashboard Calculations
Decision: Calculate summaries in real-time on each request (no caching)

Trade-off:

✅ Pros: Always accurate and up-to-date. No stale data. No cache invalidation complexity.
❌ Cons: Slower response time for large datasets. Redundant calculations. Higher database load.
Rationale: Ensures data integrity and accuracy. Acceptable performance for small-to-medium datasets.


6. Single Currency Support
Decision: All amounts in single currency (no currency field)

Trade-off:

✅ Pros: Simpler data model. Easier calculations. Faster development.
❌ Cons: Cannot track multi-currency transactions. Not suitable for international businesses.
Rationale: Multi-currency adds significant complexity (exchange rates, conversions). Out of scope for MVP.

Production Enhancement: Add currency field with default USD, integrate exchange rate API.

7. Hard Delete Instead of Soft Delete
Decision: Transactions are permanently deleted from database

Trade-off:

✅ Pros: Cleaner database. Simpler queries. Better performance.
❌ Cons: No audit trail. Cannot recover deleted records. Compliance issues.
Rationale: Keeps implementation simple. Sufficient for demonstration.


8. Rate Limiting by IP Address
Decision: Rate limit based on IP address only

Trade-off:

✅ Pros: Simple implementation. Protects against DDoS. Standard practice.
❌ Cons: Shared IPs affected (corporate networks, VPNs). Can be bypassed with IP rotation.


 Limitations
 
1. No Pagination
Issue: All transactions returned in single request
Impact: Performance degradation with >1000 records

2. No Email Verification
   
Issue: Users can register with unverified email addresses
Impact: Potential fake accounts, no password reset capability
Workaround: Admin can deactivate suspicious accounts
Fix: Integrate email service (SendGrid, Mailgun)

3. No Password Reset
Issue: Users cannot reset forgotten passwords
Impact: Admin must manually reset via database
Workaround: Admin updates password directly
Fix: Implement password reset flow with email tokens

4. Single Currency
Issue: All amounts assumed in one currency
Impact: Cannot track multi-currency transactions

5. No Data Export
Issue: Cannot export reports to PDF/CSV
Impact: Users must manually copy data
Workaround: Use API responses in external tools
Fix: Add export endpoints using json2csv, pdfkit

9. No File Attachments
Issue: Cannot attach receipts/invoices to transactions
Impact: Reference documents stored separately


11. No Real-time Updates
Issue: Dashboard requires manual refresh
Impact: Users see stale data


13. Generic Error Messages
Issue: Some error messages are vague
Impact: Harder to debug for end users
Workaround: Check server logs
Fix: Add detailed, user-friendly error messages

