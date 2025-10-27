import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

const DoctorApprovals = () => {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const [pendingRes, allRes] = await Promise.all([
        adminAPI.getPendingDoctors(),
        adminAPI.getAllDoctors(),
      ]);
      
      // Handle nested data
      const pendingData = pendingRes.data.data || pendingRes.data || [];
      const allData = allRes.data.data || allRes.data || [];
      
      setPendingDoctors(Array.isArray(pendingData) ? pendingData : []);
      setAllDoctors(Array.isArray(allData) ? allData : []);
    } catch (error) {
      console.error('Error loading doctors:', error);
      setPendingDoctors([]);
      setAllDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (doctorId) => {
    if (!confirm('Are you sure you want to approve this doctor?')) return;

    setActionLoading(true);
    try {
      await adminAPI.approveDoctor(doctorId);
      alert('Doctor approved successfully! Email notification sent.');
      loadDoctors();
    } catch (error) {
      console.error('Error approving doctor:', error);
      alert('Failed to approve doctor');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectClick = (doctor) => {
    setSelectedDoctor(doctor);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setActionLoading(true);
    try {
      await adminAPI.rejectDoctor(selectedDoctor._id, rejectionReason);
      alert('Doctor application rejected. Email notification sent.');
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedDoctor(null);
      loadDoctors();
    } catch (error) {
      console.error('Error rejecting doctor:', error);
      alert('Failed to reject doctor');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-700 font-medium">Loading doctor applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Doctor Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Review and approve doctor applications</p>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-4 sm:px-6 py-4 sm:py-5 rounded-t-xl">
            <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pending Approvals ({pendingDoctors.length})
            </h2>
          </div>
          <div className="p-4 sm:p-6">
            {pendingDoctors.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Pending Applications</h3>
                <p className="text-sm sm:text-base text-gray-600">All doctor applications have been processed.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingDoctors.map((doctor) => (
                  <div key={doctor._id} className="border-2 border-amber-200 rounded-xl p-4 sm:p-5 bg-amber-50 hover:shadow-md transition">
                    <div className="flex flex-col gap-4">
                      {/* Doctor Info */}
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                          <span className="text-xl sm:text-2xl font-bold text-white">{doctor.name.charAt(0)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">Dr. {doctor.name}</h3>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">{doctor.email}</p>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                        <div className="flex items-center text-xs sm:text-sm">
                          <svg className="w-4 h-4 mr-2 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-gray-700 truncate">{doctor.phone}</span>
                        </div>
                        <div className="flex items-center text-xs sm:text-sm">
                          <svg className="w-4 h-4 mr-2 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <span className="text-gray-700 truncate">{doctor.specialization}</span>
                        </div>
                        <div className="flex items-center text-xs sm:text-sm">
                          <svg className="w-4 h-4 mr-2 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span className="text-gray-700 truncate">{doctor.department}</span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500">
                        Applied on: {new Date(doctor.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          onClick={() => handleApprove(doctor._id)}
                          disabled={actionLoading}
                          className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold shadow-md disabled:opacity-50 flex items-center justify-center text-sm"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectClick(doctor)}
                          disabled={actionLoading}
                          className="px-4 py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition font-semibold shadow-md disabled:opacity-50 flex items-center justify-center text-sm"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* All Doctors - Mobile Card View & Desktop Table */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200">
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-4 sm:px-6 py-4 sm:py-5 rounded-t-xl">
            <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              All Registered Doctors ({allDoctors.length})
            </h2>
          </div>

          {/* Mobile Card View */}
          <div className="block lg:hidden p-4 space-y-3">
            {allDoctors.map((doctor) => (
              <div key={doctor._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white">{doctor.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm truncate">Dr. {doctor.name}</div>
                    <div className="text-xs text-gray-500 truncate">{doctor.specialization}</div>
                  </div>
                  {doctor.isApproved ? (
                    <span className="px-2 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                      Approved
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-700 border border-amber-200 whitespace-nowrap">
                      Pending
                    </span>
                  )}
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="truncate">{doctor.email}</div>
                  <div>{doctor.phone}</div>
                  <div>{doctor.department}</div>
                  <div className="text-gray-500">Registered: {new Date(doctor.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Registered</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allDoctors.map((doctor) => (
                  <tr key={doctor._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-sm font-bold text-white">{doctor.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">Dr. {doctor.name}</div>
                          <div className="text-xs text-gray-500">{doctor.specialization}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doctor.email}</div>
                      <div className="text-xs text-gray-500">{doctor.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {doctor.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(doctor.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {doctor.isApproved ? (
                        <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                          Approved
                        </span>
                      ) : (
                        <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Reject Doctor Application</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Please provide a reason for rejecting Dr. {selectedDoctor?.name}'s application:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows="4"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 resize-none text-sm sm:text-base"
              placeholder="Enter rejection reason..."
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                  setSelectedDoctor(null);
                }}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 font-semibold transition disabled:opacity-50 text-sm sm:text-base"
              >
                {actionLoading ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorApprovals;
