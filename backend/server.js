const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const sequelize = require('./config/database');
const errorHandler = require('./middlewares/errorHandler');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Middlewares
app.use(helmet());
app.use(cors({
  origin: true, // Allow client origin mapping
  credentials: true // Allow cookies to be shared
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Apply rate limiter to auth routes
app.use('/api/auth', limiter, authRoutes);

// Other API Routes
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);

// Serve static files from the React frontend build
const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use('/static', express.static(frontendDistPath));
app.use(express.static(frontendDistPath));

// Fallback to index.html for React Router SPA routes under /static
app.get('/static/*splat', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Fallback to index.html for React Router SPA routes under root
app.get('/*splat', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Sync database and start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync models
    await sequelize.sync();
    console.log('Database synced.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();
