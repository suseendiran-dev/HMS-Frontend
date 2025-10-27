import React, { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import Loader from '../shared/Loader';

const PatientRecordList = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const response = await userAPI.getRecords();
      // FIX: Check if data is nested
      const recordsData = response.data.data || response.data || [];
      console.log('Loaded records:', recordsData);
      setRecords(Array.isArray(recordsData) ? recordsData : []);
    } catch (error) {
      console.error('Error loading records:', error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Loading medical records..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Medical Records</h1>
          <p className="text-sm sm:text-base text-gray-600">View your complete medical history</p>
        </div>

        {/* Records List */}
        {records.length === 0 ? (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No medical records</h3>
            <p className="text-sm sm:text-base text-gray-600">Your medical records will appear here once created by your doctor.</p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {records.map((record) => (
              <div key={record._id} className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-all">
                {/* Record Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                      Visit Date: {new Date(record.visitDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Dr. {record.doctor?.name || 'N/A'} - {record.doctor?.specialization || 'N/A'}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-semibold self-start">
                    #{record._id.slice(-8)}
                  </span>
                </div>

                {/* Record Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
                  {/* Diagnosis */}
                  <div className="bg-rose-50 rounded-lg p-3 sm:p-4">
                    <p className="text-xs font-semibold text-rose-600 mb-2">Diagnosis</p>
                    <p className="text-sm text-gray-900 break-words">{record.diagnosis}</p>
                  </div>

                  {/* Prescription */}
                  {record.prescription && (
                    <div className="bg-emerald-50 rounded-lg p-3 sm:p-4">
                      <p className="text-xs font-semibold text-emerald-600 mb-2">Prescription</p>
                      <p className="text-sm text-gray-900 break-words">{record.prescription}</p>
                    </div>
                  )}

                  {/* Test Results */}
                  {record.testResults && (
                    <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                      <p className="text-xs font-semibold text-blue-600 mb-2">Test Results</p>
                      <p className="text-sm text-gray-900 break-words">{record.testResults}</p>
                    </div>
                  )}

                  {/* Notes */}
                  {record.notes && (
                    <div className="bg-amber-50 rounded-lg p-3 sm:p-4">
                      <p className="text-xs font-semibold text-amber-600 mb-2">Notes</p>
                      <p className="text-sm text-gray-900 break-words">{record.notes}</p>
                    </div>
                  )}
                </div>

                {/* Documents */}
                {record.documents && record.documents.length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Attached Documents</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {record.documents.map((doc, index) => (
                        <a
                          key={index}
                          href={`http://localhost:5000/${doc.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm group"
                        >
                          <svg className="w-4 h-4 mr-2 text-gray-600 group-hover:text-sky-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <span className="truncate">{doc.filename}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientRecordList;
