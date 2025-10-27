import React from 'react';
import { useAuth } from '../../context/AuthContext';

const AppointmentCard = ({ appointment, onUpdate }) => {
  const { user } = useAuth();

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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all">
      {/* Status Badge */}
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(appointment.status)}`}>
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </span>
        <div className="text-right">
          <p className="text-xs text-gray-500">Appointment ID</p>
          <p className="text-xs font-mono text-gray-700">#{appointment._id.slice(-8)}</p>
        </div>
      </div>

      {/* Doctor/Patient Info */}
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
          <span className="text-lg font-bold text-white">
            {user?.role === 'patient' 
              ? appointment.doctor?.name?.charAt(0) 
              : appointment.patient?.name?.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">
            {user?.role === 'patient' 
              ? `Dr. ${appointment.doctor?.name}` 
              : appointment.patient?.name}
          </h3>
          <p className="text-sm text-gray-600">
            {user?.role === 'patient' 
              ? appointment.doctor?.specialization 
              : appointment.patient?.email}
          </p>
        </div>
      </div>

      {/* Appointment Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-700">
          <svg className="w-5 h-5 mr-3 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-medium">{formatDate(appointment.appointmentDate)}</span>
        </div>

        <div className="flex items-center text-sm text-gray-700">
          <svg className="w-5 h-5 mr-3 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">{appointment.appointmentTime}</span>
        </div>

        <div className="flex items-center text-sm text-gray-700">
          <svg className="w-5 h-5 mr-3 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="font-medium">{appointment.department}</span>
        </div>
      </div>

      {/* Reason */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-xs font-semibold text-gray-600 mb-1">Reason for Visit:</p>
        <p className="text-sm text-gray-800">{appointment.reason}</p>
      </div>

      {/* Actions */}
      {appointment.status === 'pending' && user?.role === 'patient' && (
        <button className="w-full bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 transition font-medium">
          Cancel Appointment
        </button>
      )}

      {appointment.status === 'confirmed' && (
        <div className="flex items-center justify-center text-sm text-emerald-600 font-medium">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Appointment Confirmed
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
