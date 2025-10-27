import React, { useState, useEffect } from 'react';
import { appointmentAPI } from '../../services/api';
import AppointmentCard from './AppointmentCard';
import Loader from '../shared/Loader';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const response = await appointmentAPI.getAll();
      // Handle nested data structure
      const appointmentsData = response.data.data || response.data || [];
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
    } catch (error) {
      console.error('Error loading appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  if (loading) {
    return <Loader message="Loading appointments..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">My Appointments</h1>
          <p className="text-sm sm:text-base text-gray-600">View and manage all your appointments</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg mb-6 overflow-hidden">
          <div className="flex overflow-x-auto scrollbar-hide">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 font-semibold transition-all whitespace-nowrap border-b-2 text-sm sm:text-base ${
                  filter === status
                    ? 'text-sky-600 bg-sky-50 border-sky-600'
                    : 'text-gray-600 hover:bg-gray-50 border-transparent hover:border-gray-300'
                }`}
              >
                <span className="capitalize">{status}</span>
                <span className="ml-1.5 sm:ml-2 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-gray-200 font-bold">
                  {status === 'all' 
                    ? appointments.length 
                    : appointments.filter(a => a.status === status).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Appointments Grid */}
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No {filter !== 'all' ? filter : ''} appointments
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              You don't have any {filter !== 'all' ? filter : ''} appointments yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
                onUpdate={loadAppointments}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentList;
