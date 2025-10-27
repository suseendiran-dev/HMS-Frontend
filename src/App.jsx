import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Navbar from './components/Layout/Navbar';
import ScrollToTop from './components/shared/ScrollToTop';

// Auth Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Dashboard Components
import PatientDashboard from './components/Dashboard/PatientDashboard';
import DoctorDashboard from './components/Dashboard/DoctorDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';

// Appointment Components
import BookAppointment from './components/Appointments/BookAppointment';
import AppointmentList from './components/Appointments/AppointmentList';

// Message Components
import MessageList from './components/Messages/MessageList';

// Record Components
import PatientRecordList from './components/Records/PatientRecordList';
import UploadRecord from './components/Records/UploadRecord';

// Admin Components
import DoctorApprovals from './components/Admin/DoctorApprovals';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Patient Routes */}
            <Route
              path="/patient/dashboard"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <>
                    <Navbar />
                    <PatientDashboard />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/book-appointment"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <>
                    <Navbar />
                    <BookAppointment />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/appointments"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <>
                    <Navbar />
                    <AppointmentList />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/messages"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <>
                    <Navbar />
                    <MessageList />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/records"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <>
                    <Navbar />
                    <PatientRecordList />
                  </>
                </ProtectedRoute>
              }
            />

            {/* Doctor Routes */}
            <Route
              path="/doctor/dashboard"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <>
                    <Navbar />
                    <DoctorDashboard />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/appointments"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <>
                    <Navbar />
                    <AppointmentList />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/messages"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <>
                    <Navbar />
                    <MessageList />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/patients"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <>
                    <Navbar />
                    <UploadRecord />
                  </>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <>
                    <Navbar />
                    <AdminDashboard />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/doctor-approvals"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <>
                    <Navbar />
                    <DoctorApprovals />
                  </>
                </ProtectedRoute>
              }
            />

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
