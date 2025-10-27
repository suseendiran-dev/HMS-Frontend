import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI, appointmentAPI } from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('today');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, appointmentsRes] = await Promise.all([
        userAPI.getStats(),
        appointmentAPI.getAllAdmin(),
      ]);

      // FIX: Handle nested data structure properly
      const statsData = statsRes.data.data || statsRes.data || {};
      const appointmentsData = appointmentsRes.data.data || appointmentsRes.data || [];

      console.log('Stats data:', statsData);
      console.log('Appointments data:', appointmentsData);

      // Ensure appointments is an array
      const safeAppointments = Array.isArray(appointmentsData) ? appointmentsData : [];

      setStats(statsData);
      setAppointments(safeAppointments);
    } catch (error) {
      console.error('Error loading data:', error);
      setStats({});
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const getRecentAppointments = () => {
    if (!Array.isArray(appointments) || appointments.length === 0) {
      return [];
    }

    const now = new Date();
    try {
      return appointments.filter(app => {
        if (!app || !app.appointmentDate) return false;

        const appDate = new Date(app.appointmentDate);
        if (timeFilter === 'today') {
          return appDate.toDateString() === now.toDateString();
        } else if (timeFilter === 'week') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return appDate >= weekAgo;
        }
        return true;
      });
    } catch (error) {
      console.error('Error filtering appointments:', error);
      return [];
    }
  };

  const getTodayStats = () => {
    if (!Array.isArray(appointments) || appointments.length === 0) {
      return { newPatients: 0, todayAppointments: 0, completed: 0 };
    }

    const now = new Date();
    const today = now.toDateString();

    try {
      return {
        newPatients: appointments.filter(a => {
          return a.createdAt && new Date(a.createdAt).toDateString() === today;
        }).length,
        todayAppointments: appointments.filter(a => {
          return a.appointmentDate && new Date(a.appointmentDate).toDateString() === today;
        }).length,
        completed: appointments.filter(a => a.status === 'completed').length
      };
    } catch (error) {
      console.error('Error calculating today stats:', error);
      return { newPatients: 0, todayAppointments: 0, completed: 0 };
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
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-700 font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    );
  };

  const recentAppointments = getRecentAppointments();
  const todayStats = getTodayStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                {getGreeting()}, {user?.name?.split(' ')[0]}!
              </h1>
              <p className="text-purple-100 text-sm sm:text-base md:text-lg">System Administrator Dashboard</p>
              <p className="text-purple-200 text-xs sm:text-sm mt-1">
                Overview of all system activities and statistics
              </p>
            </div>

            {/* Doctor Approval Button */}
            <Link
              to="/admin/doctor-approvals"
              className="group bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-white/20 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-center md:justify-start"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-xs sm:text-sm">Doctor Approvals</p>
                <p className="text-xs text-purple-100">
                  {stats.pendingDoctors || 0} pending
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Patients */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-6 hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-xs sm:text-sm font-semibold opacity-90">Total Patients</h3>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-bold mb-2">{stats.totalPatients || 0}</p>
            <div className="flex items-center text-xs sm:text-sm opacity-90">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>Registered users</span>
            </div>
          </div>

          {/* Total Doctors */}
          <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-6 hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-xs sm:text-sm font-semibold opacity-90">Total Doctors</h3>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-bold mb-2">{stats.totalDoctors || 0}</p>
            <div className="flex items-center text-xs sm:text-sm opacity-90">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Active practitioners</span>
            </div>
          </div>

          {/* Total Appointments */}
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-6 hover:shadow-2xl transition-all sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-xs sm:text-sm font-semibold opacity-90">Total Appointments</h3>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-bold mb-2">{stats.totalAppointments || 0}</p>
            <div className="flex items-center text-xs sm:text-sm opacity-90">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Total bookings</span>
            </div>
          </div>
        </div>

        {/* Activity Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-6 border-l-4 border-sky-500">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">System Health</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600">Active Users</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-600">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600">Server Status</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-600">Running</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600">Database</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-600">Connected</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-6 border-l-4 border-emerald-500">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Today's Summary</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600">New Patients</span>
                <span className="text-xs sm:text-sm font-bold text-gray-900">{todayStats.newPatients}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600">Appointments Today</span>
                <span className="text-xs sm:text-sm font-bold text-gray-900">{todayStats.todayAppointments}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600">Completed</span>
                <span className="text-xs sm:text-sm font-bold text-gray-900">{todayStats.completed}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-6 border-l-4 border-purple-500">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Quick Stats</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600">Departments</span>
                <span className="text-xs sm:text-sm font-bold text-gray-900">6</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600">Pending Approvals</span>
                <span className="text-xs sm:text-sm font-bold text-amber-600">{stats.pendingDoctors || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600">Total Appointments</span>
                <span className="text-xs sm:text-sm font-bold text-gray-900">{appointments.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100">
          <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Recent Appointments</h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Overview of all appointment activities</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
              {['today', 'week', 'all'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition whitespace-nowrap ${
                    timeFilter === filter
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {recentAppointments.length === 0 ? (
            <div className="text-center py-12 sm:py-16 px-4">
              <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-500 text-base sm:text-lg">No appointments found</p>
              <p className="text-gray-400 text-xs sm:text-sm mt-2">
                {timeFilter === 'today' && 'No appointments scheduled for today'}
                {timeFilter === 'week' && 'No appointments this week'}
                {timeFilter === 'all' && 'No appointments in the system'}
              </p>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block lg:hidden p-4 space-y-3">
                {recentAppointments.slice(0, 10).map((appointment) => (
                  <div key={appointment._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-white">
                          {appointment.patient?.name?.charAt(0) || 'P'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-sm truncate">
                          {appointment.patient?.name || 'Unknown'}
                        </div>
                        <div className="text-xs text-gray-500 truncate">{appointment.patient?.email || 'N/A'}</div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-bold rounded-full border whitespace-nowrap ${
                          appointment.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                            : appointment.status === 'pending'
                            ? 'bg-amber-100 text-amber-700 border-amber-200'
                            : appointment.status === 'cancelled'
                            ? 'bg-rose-100 text-rose-700 border-rose-200'
                            : 'bg-sky-100 text-sky-700 border-sky-200'
                        }`}
                      >
                        {appointment.status?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div>Dr. {appointment.doctor?.name || 'Unknown'} - {appointment.doctor?.specialization || 'N/A'}</div>
                      <div>{appointment.department || 'N/A'}</div>
                      <div className="text-gray-500">
                        {appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'N/A'} at {appointment.appointmentTime || 'N/A'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Patient</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Doctor</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentAppointments.slice(0, 10).map((appointment) => (
                      <tr key={appointment._id} className="hover:bg-sky-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-11 h-11 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-md">
                              <span className="text-sm font-bold text-white">
                                {appointment.patient?.name?.charAt(0) || 'P'}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {appointment.patient?.name || 'Unknown'}
                              </div>
                              <div className="text-xs text-gray-500">{appointment.patient?.email || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            Dr. {appointment.doctor?.name || 'Unknown'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {appointment.doctor?.specialization || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">{appointment.department || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            }) : 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">{appointment.appointmentTime || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1.5 inline-flex text-xs leading-5 font-bold rounded-full border
                            ${
                              appointment.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                : appointment.status === 'pending'
                                ? 'bg-amber-100 text-amber-700 border-amber-200'
                                : appointment.status === 'cancelled'
                                ? 'bg-rose-100 text-rose-700 border-rose-200'
                                : 'bg-sky-100 text-sky-700 border-sky-200'
                            }`}
                          >
                            {appointment.status?.toUpperCase() || 'UNKNOWN'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
