import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../../services/api';

const UploadRecord = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patient: '',
    diagnosis: '',
    prescription: '',
    testResults: '',
    notes: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const response = await userAPI.getPatients();
      const patientsData = response.data.data || response.data || [];
      console.log('Loaded patients:', patientsData);
      setPatients(Array.isArray(patientsData) ? patientsData : []);
    } catch (error) {
      console.error('Error loading patients:', error);
      setError('Failed to load patients');
      setPatients([]);
    } finally {
      setLoadingPatients(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handlePatientSelect = (patient) => {
    setFormData({ ...formData, patient: patient._id });
    setSearchTerm(patient.name);
    setIsDropdownOpen(false);
  };

  const getSelectedPatient = () => {
    return patients.find(p => p._id === formData.patient);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        e.target.value = '';
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await userAPI.createRecord(formData);
      
      if (file && response.data._id) {
        const fileFormData = new FormData();
        fileFormData.append('document', file);
        await userAPI.uploadDocument(response.data._id, fileFormData);
      }

      alert('Medical record created successfully!');
      navigate('/doctor/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create record');
    } finally {
      setLoading(false);
    }
  };

  if (loadingPatients) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mb-4"></div>
          <p className="text-gray-700 font-medium">Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Create Medical Record
            </h1>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
              Add patient medical records, diagnosis, and prescriptions
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200">
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-5 rounded-t-xl">
            <h2 className="text-xl font-semibold text-white">Patient Medical Record Form</h2>
          </div>

          <div className="p-6 md:p-8">
            {error && (
              <div className="mb-6 bg-rose-50 border-l-4 border-rose-500 p-4 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-rose-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-rose-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {patients.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Patients Available</h3>
                <p className="text-gray-600">There are no registered patients in the system yet.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Custom Patient Selection Dropdown */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Patient *
                  </label>
                  
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-left flex items-center justify-between bg-white hover:border-emerald-400"
                    >
                      {getSelectedPatient() ? (
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-sm">
                              {getSelectedPatient().name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{getSelectedPatient().name}</p>
                            <p className="text-sm text-gray-500">{getSelectedPatient().email}</p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500">Choose a patient...</span>
                      )}
                      <svg 
                        className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-80 overflow-hidden">
                        {/* Search Input */}
                        <div className="p-3 border-b border-gray-200 bg-gray-50">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Search patients by name or email..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                        </div>

                        {/* Patient List */}
                        <div className="max-h-64 overflow-y-auto">
                          {filteredPatients.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                              <svg className="mx-auto h-12 w-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                              <p className="text-sm">No patients found</p>
                            </div>
                          ) : (
                            filteredPatients.map((patient) => (
                              <button
                                key={patient._id}
                                type="button"
                                onClick={() => handlePatientSelect(patient)}
                                className={`w-full px-4 py-3 flex items-center hover:bg-emerald-50 transition border-b border-gray-100 last:border-b-0 ${
                                  formData.patient === patient._id ? 'bg-emerald-50' : ''
                                }`}
                              >
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                  <span className="text-white font-bold text-sm">
                                    {patient.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="flex-1 text-left">
                                  <p className="font-semibold text-gray-900 text-sm">{patient.name}</p>
                                  <p className="text-xs text-gray-500">{patient.email}</p>
                                  {patient.phone && (
                                    <p className="text-xs text-gray-400 mt-0.5">{patient.phone}</p>
                                  )}
                                </div>
                                {formData.patient === patient._id && (
                                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </button>
                            ))
                          )}
                        </div>

                        {/* Footer */}
                        <div className="p-3 bg-gray-50 border-t border-gray-200">
                          <button
                            type="button"
                            onClick={() => setIsDropdownOpen(false)}
                            className="w-full py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Selected Patient Info */}
                  {getSelectedPatient() && (
                    <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <p className="text-xs font-medium text-emerald-800 mb-1">Selected Patient</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-emerald-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-semibold text-emerald-900">{getSelectedPatient().name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, patient: '' });
                            setSearchTerm('');
                          }}
                          className="text-emerald-600 hover:text-emerald-700 text-xs font-medium"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Diagnosis */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Diagnosis *
                  </label>
                  <textarea
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition resize-none"
                    placeholder="Enter the medical diagnosis..."
                  />
                </div>

                {/* Prescription */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Prescription
                  </label>
                  <textarea
                    name="prescription"
                    value={formData.prescription}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition resize-none"
                    placeholder="List medications and dosage instructions..."
                  />
                </div>

                {/* Test Results */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Test Results
                  </label>
                  <textarea
                    name="testResults"
                    value={formData.testResults}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition resize-none"
                    placeholder="Enter laboratory or diagnostic test results..."
                  />
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition resize-none"
                    placeholder="Any additional observations or instructions..."
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Document (Optional)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-emerald-400 transition">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF, PNG, JPG up to 5MB</p>
                      {file && (
                        <div className="mt-3 flex items-center justify-center">
                          <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center">
                            <svg className="w-5 h-5 text-emerald-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-emerald-700 font-medium">{file.name}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate('/doctor/dashboard')}
                    className="sm:w-auto px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 px-6 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Record...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Create Medical Record
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadRecord;
