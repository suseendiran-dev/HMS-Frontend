import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const response = await appointmentAPI.getAll();
      const appointmentsData = response.data.data || response.data || [];
      console.log('Loaded appointments:', appointmentsData);
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
    } catch (error) {
      console.error('Error loading appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      await appointmentAPI.updateStatus(appointmentId, { status });
      alert(`Appointment ${status} successfully!`);
      loadAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Failed to update appointment status');
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

  const filteredAppointments = appointments.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
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
          <div className="relative inline-flex mb-4">
            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-700 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              {getGreeting()}, Dr. {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-emerald-100 text-base sm:text-lg">
              {user?.specialization} • {user?.department}
            </p>
            <p className="text-emerald-200 text-sm">
              {stats.pending} pending approval{stats.pending !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Appointments */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border-l-4 border-sky-500 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sky-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-7 sm:h-7 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-xs text-gray-500 mt-1 sm:mt-2 hidden sm:block">All time</p>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border-l-4 border-amber-500 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-7 sm:h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Pending</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.pending}</p>
            <p className="text-xs text-amber-600 mt-1 sm:mt-2 font-medium hidden sm:block">Action needed</p>
          </div>

          {/* Confirmed */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border-l-4 border-emerald-500 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-7 sm:h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Confirmed</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.confirmed}</p>
            <p className="text-xs text-emerald-600 mt-1 sm:mt-2 font-medium hidden sm:block">Upcoming</p>
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
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl mb-6 overflow-hidden">
          <div className="flex overflow-x-auto scrollbar-hide">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 font-semibold transition-all whitespace-nowrap border-b-2 text-sm sm:text-base ${
                  filter === status
                    ? 'text-emerald-600 bg-emerald-50 border-emerald-600'
                    : 'text-gray-600 hover:bg-gray-50 border-transparent hover:border-gray-300'
                }`}
              >
                <span className="capitalize">{status}</span>
                <span className="ml-2 px-2 sm:px-2.5 py-0.5 text-xs rounded-full bg-gray-200 font-bold">
                  {status === 'all' 
                    ? appointments.length 
                    : appointments.filter(a => a.status === status).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Appointment Requests</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage and review patient appointments</p>
          </div>
          <div className="p-4 sm:p-6">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No {filter !== 'all' ? filter : ''} appointments</h3>
                <p className="text-sm sm:text-base text-gray-600">You don't have any {filter !== 'all' ? filter : ''} appointments at the moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="border-2 border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-xl transition-all bg-gradient-to-r from-white to-gray-50 hover:border-emerald-300"
                  >
                    {/* Patient Info Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
                      <div className="flex items-start flex-1">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0 shadow-lg">
                          <span className="text-lg sm:text-2xl font-bold text-white">
                            {appointment.patient?.name?.charAt(0)}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-gray-900 text-base sm:text-xl mb-1 truncate">
                            {appointment.patient?.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 truncate">{appointment.patient?.email}</p>
                          <div className="flex items-center text-xs sm:text-sm text-gray-700">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="truncate">{appointment.patient?.phone}</span>
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

                    {/* Appointment Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                      <div className="bg-sky-50 rounded-lg sm:rounded-xl p-3 border border-sky-200">
                        <p className="text-xs font-semibold text-sky-700 mb-1 flex items-center">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Date
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-gray-900">
                          {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>

                      <div className="bg-emerald-50 rounded-lg sm:rounded-xl p-3 border border-emerald-200">
                        <p className="text-xs font-semibold text-emerald-700 mb-1 flex items-center">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Time
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-gray-900">{appointment.appointmentTime}</p>
                      </div>

                      <div className="bg-purple-50 rounded-lg sm:rounded-xl p-3 border border-purple-200 sm:col-span-1 col-span-1">
                        <p className="text-xs font-semibold text-purple-700 mb-1 flex items-center">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Department
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">{appointment.department}</p>
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 border border-gray-200">
                      <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Reason for Visit
                      </p>
                      <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">{appointment.reason}</p>
                    </div>

                    {/* Action Buttons */}
                    {appointment.status === 'pending' && (
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <button
                          onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
                          className="flex-1 flex items-center justify-center px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg sm:rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all font-bold shadow-lg hover:shadow-xl text-sm sm:text-base"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Confirm
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                          className="flex-1 flex items-center justify-center px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-lg sm:rounded-xl hover:from-rose-600 hover:to-red-700 transition-all font-bold shadow-lg hover:shadow-xl text-sm sm:text-base"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Reject
                        </button>
                      </div>
                    )}

                    {appointment.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                        className="w-full flex items-center justify-center px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all font-bold shadow-lg hover:shadow-xl text-sm sm:text-base"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Mark as Completed
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
