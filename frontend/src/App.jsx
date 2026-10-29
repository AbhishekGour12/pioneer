import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Catalog from './pages/Catalog';
import BookDetail from './pages/BookDetail';
import QRCheckIn from './pages/QRCheckIn';
import Payments from './pages/Payments';
import AthleteEnroll from './pages/AthleteEnroll';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import axios from 'axios';
import { userinfo } from './features/userinfo';
import { attendanceinfo } from './features/attendance';
import PioneerLoader from './components/PioneerLoader';

import { useLocation } from 'react-router-dom';

function AppContent({ user, ProtectedRoute }) {
  const location = useLocation();
  const isAuthOrAdmin = location.pathname.startsWith('/admin') || location.pathname.startsWith('/enroll');

  return (
    <div className="App min-h-screen text-slate-800 flex flex-col selection:bg-[#FF6A1A] selection:text-white bg-white">
      {!isAuthOrAdmin && <Header />}

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/reviews" element={<Navigate to="/" replace />} />
            <Route path="/membership" element={<Payments />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/facilities" element={<Catalog />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/enroll" element={<AthleteEnroll />} />
            <Route path="/register-athlete" element={<AthleteEnroll />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="/payments" element={
              <ProtectedRoute>
                <Payments />
              </ProtectedRoute>
            } />
            <Route path="/admin/*" element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </AnimatePresence>
      </main>

      {!isAuthOrAdmin && <Footer />}
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => state.user.value);
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("libraryUser");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && (!user || user._id !== parsed._id)) {
          dispatch(userinfo(parsed));
        }
      } catch (e) {}
    }

    if (token && token !== 'playpeak-demo-token') {
      const getUser = async () => {
        try {
          const result = await axios.get(`${url}users/profile/${token}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          });
          if (result && result.data) {
            dispatch(userinfo(result.data));
          }

          const result1 = await axios.get(`${url}attendance/live`);
          if (result1.data && result1.data.success) {
            dispatch(attendanceinfo(result1.data.data));
          }
        } catch (err) {
          console.warn("Backend auth background sync:", err.message);
        }
      };
      getUser();
    }
  }, [dispatch, url]);

  // Protected Route component with resilient session recovery
  const ProtectedRoute = ({ children, adminOnly = false }) => {
    let activeUser = user;
    if (!activeUser) {
      try {
        const saved = localStorage.getItem('libraryUser');
        if (saved) activeUser = JSON.parse(saved);
      } catch (e) {}
    }

    if (!activeUser) {
      return (
        <div className="flex justify-center items-center min-h-[70vh] bg-slate-50 p-4">
          <div className="bg-white p-8 rounded-3xl text-center max-w-md border border-slate-200 shadow-xl">
            <div className="w-14 h-14 bg-orange-50 text-[#FF6A1A] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-200">
              <span className="text-2xl">🎯</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2 font-display">Pioneer Portal Restricted</h2>
            <p className="text-slate-500 mb-6 text-sm">Please authenticate with your Athlete or Coach credentials to access this shooting academy sector.</p>
            <a
              href="/login"
              className="inline-block px-6 py-2.5 bg-[#FF6A1A] hover:bg-[#EA580C] text-white font-bold rounded-xl shadow-md transition-all"
            >
              Sign In To Pioneer Portal
            </a>
          </div>
        </div>
      );
    }

    if (adminOnly && activeUser.role !== 'admin') {
      return (
        <div className="flex justify-center items-center min-h-[70vh] bg-slate-50 p-4">
          <div className="bg-white p-8 rounded-3xl text-center max-w-md border border-slate-200 shadow-xl">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <span className="text-2xl">⚡</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2 font-display">Head Coach & Admin Required</h2>
            <p className="text-slate-500 mb-6 text-sm">You need Pioneer Academy Administrator privileges to enter this management console.</p>
            <a
              href="/dashboard"
              className="inline-block px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
            >
              Go to Athlete Dashboard
            </a>
          </div>
        </div>
      );
    }

    return children;
  };

  // Initial loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <PioneerLoader 
        message="Calibrating 10M Target Range..." 
        subMessage="Precision • Discipline • Focus" 
        fullScreen={true} 
      />
    );
  }

  return (
    <AuthProvider>
      <Router>
        <AppContent user={user} ProtectedRoute={ProtectedRoute} />
      </Router>
    </AuthProvider>
  );
}

export default App;