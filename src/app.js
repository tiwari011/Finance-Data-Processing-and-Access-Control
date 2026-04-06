const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { apiLimiter } = require('./middlewares/rateLimiter');
require('dotenv').config();

// Create Express app
const app = express();

// ═══════════════════════════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════════════════════════

// Enable CORS (allows frontend to connect)
app.use(cors());

// Parse JSON bodies (allows us to read req.body)
app.use(express.json());

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// ═══════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════

// Auth routes (login, register)
app.use('/api/auth', require('./routes/authRoutes'));

// User routes (admin user management)
app.use('/api/users', require('./routes/userRoutes'));

// Transaction routes (financial records)
app.use('/api/transactions', require('./routes/transactionRoutes'));

// Dashboard routes (analytics)
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// ═══════════════════════════════════════════════════════════
// HOME ROUTE
// ═══════════════════════════════════════════════════════════

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Finance Backend API',
    version: '1.0.0',
    rateLimits: {
      general: '100 requests per 15 minutes',
      authentication: '20 attempts per 15 minutes',
      adminRegistration: '15 attempts per hour',
      transactions: '40 per minute'
    },
    endpoints: {
      authentication: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        registerAdmin: 'POST /api/auth/register-admin'
      },
      users: {
        getAllUsers: 'GET /api/users (Admin)',
        updateUserRole: 'PATCH /api/users/:userId/role (Admin)',
        updateUserStatus: 'PATCH /api/users/:userId/status (Admin)',
        deleteUser: 'DELETE /api/users/:userId (Admin)'
      },
      transactions: {
        getAll: 'GET /api/transactions (All users)',
        getById: 'GET /api/transactions/:id (All users)',
        create: 'POST /api/transactions (Admin only)',
        update: 'PUT /api/transactions/:id (Admin only)',
        delete: 'DELETE /api/transactions/:id (Admin only)',
        filter: 'GET /api/transactions?type=income&category=Salary&startDate=2025-01-01&endDate=2025-01-31'
      },
      dashboard: {
        summary: 'GET /api/dashboard/summary (Analyst, Admin)',
        categoryBreakdown: 'GET /api/dashboard/category-breakdown (Analyst, Admin)',
        monthlyTrends: 'GET /api/dashboard/monthly-trends (Analyst, Admin)',
        recentActivity: 'GET /api/dashboard/recent?limit=10 (All users)'
      }
    },
    roles: {
      viewer: 'Can view transactions and recent activity',
      analyst: 'Can view + access analytics/reports',
      admin: 'Full access - can create, update, delete'
    },
    security: {
      authentication: 'JWT Token-based',
      passwordHashing: 'bcrypt',
      rateLimiting: 'Active',
      roleBasedAccess: 'Enabled'
    }
  });
});

// ═══════════════════════════════════════════════════════════
// ERROR HANDLER (Must be after all routes)
// ═══════════════════════════════════════════════════════════

const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

// ═══════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════

const PORT = process.env.PORT || 5000;

// Connect to database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('\n═══════════════════════════════════════');
    console.log(` Server running on port ${PORT}`);
    console.log(` http://localhost:${PORT}`);
    console.log('═══════════════════════════════════════');
    console.log('\n API Documentation:');
    console.log(`   Visit: http://localhost:${PORT}`);
    console.log('\n Default Admin Credentials:');
    console.log('   Email: admin@company.com');
    console.log('   Password: Admin@123');
    console.log('\n Rate Limits Active:');
    console.log('   • General API: 100 requests/15min');
    console.log('   • Authentication: 20 attempts/15min');
    console.log('   • Admin Registration: 15 attempts/hour');
    console.log('   • Transactions: 40 requests/minute');
    console.log('\n Security Features:');
    console.log('   • JWT Authentication');
    console.log('   • Password Hashing (bcrypt)');
    console.log('   • Role-Based Access Control');
    console.log('   • Rate Limiting');
    console.log('   • Input Validation');
    console.log('\n═══════════════════════════════════════\n');
  });
}).catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
