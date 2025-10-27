import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentAPI, userAPI } from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [appointmentsRes, recordsRes] = await Promise.all([
        appointmentAPI.getAll(),
        userAPI.getRecords(),
      ]);

      // FIX: Handle nested data structure
      const appointmentsData = appointmentsRes.data.data || appointmentsRes.data || [];
      const recordsData = recordsRes.data.data || recordsRes.data || [];

      // Ensure they are arrays
      const safeAppointments = Array.isArray(appointmentsData) ? appointmentsData : [];
      const safeRecords = Array.isArray(recordsData) ? recordsData : [];

      setAppointments(safeAppointments);
      setRecords(safeRecords);

      // Calculate stats
      setStats({
        total: safeAppointments.length,
        upcoming: safeAppointments.filter(a => a.status === 'confirmed').length,
        completed: safeAppointments.filter(a => a.status === 'completed').length,
        cancelled: safeAppointments.filter(a => a.status === 'cancelled').length,
      });
    } catch (error) {
      console.error('Error loading data:', error);
      setAppointments([]);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cancelled':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'completed':
        return 'bg-sky-100 text-sky-700 border-sky-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-700 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                {getGreeting()}, {user?.name?.split(' ')[0]}!
              </h1>
              <p className="text-sky-100 text-sm sm:text-base md:text-lg">Here's what's happening with your health today</p>
            </div>
            <Link
              to="/patient/book-appointment"
              className="flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 bg-white text-sky-600 rounded-lg sm:rounded-xl hover:bg-sky-50 transition-all shadow-md hover:shadow-lg font-semibold text-sm sm:text-base w-full md:w-auto"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Appointment
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          {/* Total */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border-l-4 border-sky-500 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sky-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-7 sm:h-7 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-xs text-gray-500 mt-1 sm:mt-2 hidden sm:block">All time</p>
          </div>

          {/* Upcoming */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border-l-4 border-emerald-500 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-7 sm:h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Upcoming</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.upcoming}</p>
            <p className="text-xs text-emerald-600 mt-1 sm:mt-2 font-medium hidden sm:block">Confirmed</p>
          </div>

          {/* Completed */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-7 sm:h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Completed</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.completed}</p>
            <p className="text-xs text-gray-500 mt-1 sm:mt-2 hidden sm:block">Past visits</p>
          </div>

          {/* Records */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-7 sm:h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Records</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{records.length}</p>
            <p className="text-xs text-gray-500 mt-1 sm:mt-2 hidden sm:block">Documents</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Link
            to="/patient/book-appointment"
            className="group relative overflow-hidden bg-gradient-to-br from-sky-500 to-blue-600 text-white p-5 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full"></div>
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-white/30 transition">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Book Appointment</h3>
              <p className="text-sm sm:text-base text-sky-100">Schedule your next visit</p>
            </div>
          </Link>

          <Link
            to="/patient/messages"
            className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-green-600 text-white p-5 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full"></div>
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-white/30 transition">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Messages</h3>
              <p className="text-sm sm:text-base text-emerald-100">Chat with your doctors</p>
            </div>
          </Link>

          <Link
            to="/patient/records"
            className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-5 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full"></div>
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-white/30 transition">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Medical Records</h3>
              <p className="text-sm sm:text-base text-purple-100">View health history</p>
            </div>
          </Link>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Recent Appointments</h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Your upcoming and past visits</p>
            </div>
            <Link
              to="/patient/appointments"
              className="text-sky-600 hover:text-sky-700 font-semibold flex items-center text-sm sm:text-base"
            >
              View All
              <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="p-4 sm:p-6">
            {appointments.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No appointments yet</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-6">Start your healthcare journey by booking your first appointment</p>
                <Link
                  to="/patient/book-appointment"
                  className="inline-flex items-center px-5 sm:px-6 py-2.5 sm:py-3 bg-sky-600 text-white rounded-lg sm:rounded-xl hover:bg-sky-700 transition font-semibold shadow-lg text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Book Your First Appointment
                </Link>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {appointments.slice(0, 5).map((appointment) => (
                  <div
                    key={appointment._id}
                    className="group border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-5 hover:border-sky-300 hover:shadow-lg transition-all bg-gradient-to-r from-white to-gray-50 hover:from-sky-50 hover:to-blue-50"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-start flex-1">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0 shadow-md">
                          <span className="text-lg sm:text-xl font-bold text-white">
                            {appointment.doctor?.name?.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 truncate">
                            Dr. {appointment.doctor?.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mb-2 truncate">{appointment.department}</p>
                          <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700">
                            <div className="flex items-center">
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-sky-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="truncate">{new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}</span>
                            </div>
                            <div className="flex items-center">
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-sky-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {appointment.appointmentTime}
                            </div>
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold border whitespace-nowrap self-start ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Health Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-6 text-white">
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 flex items-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Health Tip
            </h3>
            <p className="text-sm sm:text-base text-blue-100">Regular check-ups can help detect health issues early. Don't forget to schedule your annual physical examination!</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-6 text-white">
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 flex items-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Next Appointment
            </h3>
            <p className="text-sm sm:text-base text-emerald-100">
              {stats.upcoming > 0 
                ? `You have ${stats.upcoming} upcoming appointment${stats.upcoming > 1 ? 's' : ''}.`
                : 'No upcoming appointments scheduled.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
