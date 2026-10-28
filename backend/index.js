import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/AuthRoutes.js';
import attendanceRoutes from './routes/AttendanceRoutes.js';
import userRoutes from './routes/UserRoutes.js';
import seatRoutes from './routes/SeatRoutes.js';
import serviceRoutes from './routes/ServiceRoutes.js';
import paymentRoutes from './routes/PaymentRoutes.js';
import athleteRoutes from './routes/AthleteRoutes.js';
import coachRoutes from './routes/CoachRoutes.js';
import tournamentRoutes from './routes/TournamentRoutes.js';
import physioRoutes from './routes/PhysioRoutes.js';
import assessmentRoutes from './routes/AssessmentRoutes.js';
import inventoryRoutes from './routes/InventoryRoutes.js';
import membershipRoutes from './routes/MembershipRoutes.js';
import inquiryRoutes from './routes/InquiryRoutes.js';
import statsRoutes from './routes/StatsRoutes.js';
import uploadRoutes from './routes/UploadRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('⚡ Socket client connected to Pioneer Academy:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔌 Socket client disconnected:', socket.id);
  });
});

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads directory for local fallback
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Attach io to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Register API Routes (Mounted on both /api/... and /... for seamless proxy/Vercel compatibility)
const routes = [
  { path: 'auth', handler: authRoutes },
  { path: 'attendance', handler: attendanceRoutes },
  { path: 'users', handler: userRoutes },
  { path: 'seats', handler: seatRoutes },
  { path: 'services', handler: serviceRoutes },
  { path: 'payments', handler: paymentRoutes },
  { path: 'athletes', handler: athleteRoutes },
  { path: 'coaches', handler: coachRoutes },
  { path: 'tournaments', handler: tournamentRoutes },
  { path: 'physio', handler: physioRoutes },
  { path: 'assessments', handler: assessmentRoutes },
  { path: 'inventory', handler: inventoryRoutes },
  { path: 'memberships', handler: membershipRoutes },
  { path: 'inquiries', handler: inquiryRoutes },
  { path: 'stats', handler: statsRoutes },
  { path: 'upload', handler: uploadRoutes }
];

routes.forEach(({ path, handler }) => {
  app.use(`/api/${path}`, handler);
  app.use(`/${path}`, handler);
});

// Health check endpoint
let lastDbError = null;
app.get('/api/health', (req, res) => {
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({
    status: 'healthy',
    message: 'PlayPeak Sports Academy Backend API & MongoDB Atlas is fully operational',
    timestamp: new Date().toISOString(),
    dbState: states[mongoose.connection.readyState] || 'unknown',
    readyState: mongoose.connection.readyState,
    dbHost: mongoose.connection.host || 'none',
    dbError: lastDbError
  });
});

app.get('/', (req, res) => {
  res.send('PlayPeak Sports Academy API Server is Running on MongoDB Atlas.');
});

// Database connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://pioneersportacademy_db_user:lxIk4lx6tZxdk5AU@cluster0.rvbq5qq.mongodb.net/pioneer?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000
})
  .then(() => {
    lastDbError = null;
    console.log('✅ MongoDB Connected successfully to PlayPeak Sports Cluster');
  })
  .catch(err => {
    lastDbError = err.message;
    console.error('❌ MongoDB Connection Error:', err);
  });

mongoose.connection.on('error', (err) => {
  lastDbError = err.message;
  console.error('❌ MongoDB runtime error:', err);
});

mongoose.connection.on('connected', () => {
  lastDbError = null;
  console.log('✅ MongoDB Atlas connection established');
});

server.listen(PORT, () => {
  console.log(`🚀 PlayPeak Sports Academy Server is listening on port ${PORT}`);
});