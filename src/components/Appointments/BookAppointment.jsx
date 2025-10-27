import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, appointmentAPI } from '../../services/api';

const BookAppointment = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctor: '',
    department: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);

  const departments = [
    { 
      name: 'Cardiology', 
      description: 'Heart and cardiovascular care',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    { 
      name: 'Neurology', 
      description: 'Brain and nervous system',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    { 
      name: 'Orthopedics', 
      description: 'Bones, joints and muscles',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
      )
    },
    { 
      name: 'Pediatrics', 
      description: 'Children\'s health and care',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      name: 'Dermatology', 
      description: 'Skin care and treatment',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    { 
      name: 'General Medicine', 
      description: 'General health concerns',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
  ];

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  ];

  useEffect(() => {
    if (formData.department) {
      loadDoctors(formData.department);
    }
  }, [formData.department]);

  const loadDoctors = async (department) => {
    try {
      const response = await userAPI.getDoctors(department);
      // FIX: Check if data is nested
      const doctorsData = response.data.data || response.data || [];
      console.log('Loaded doctors:', doctorsData);
      setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
    } catch (error) {
      console.error('Error loading doctors:', error);
      setDoctors([]); // Set empty array on error
      setError('Failed to load doctors. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await appointmentAPI.create(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/patient/dashboard');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !formData.department) {
      setError('Please select a department');
      return;
    }
    if (step === 2 && !formData.doctor) {
      setError('Please select a doctor');
      return;
    }
    if (step === 3 && (!formData.appointmentDate || !formData.appointmentTime)) {
      setError('Please select date and time');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
    setError('');
  };

  const stepTitles = [
    'Select Department',
    'Choose Doctor',
    'Schedule Date & Time',
    'Consultation Details'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/patient/dashboard')}
            className="inline-flex items-center text-sky-700 hover:text-sky-800 mb-6 font-medium transition group"
          >
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Book an Appointment
            </h1>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
              Complete the following steps to schedule your consultation with our healthcare professionals
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-10">
          <div className="relative">
            <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded"></div>
            <div 
              className="absolute top-5 left-0 h-1 bg-sky-600 rounded transition-all duration-500"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>

            <div className="relative flex justify-between">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                      step >= num
                        ? 'bg-sky-600 text-white shadow-lg ring-4 ring-sky-100'
                        : 'bg-white text-gray-400 border-2 border-gray-300'
                    }`}
                  >
                    {step > num ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      num
                    )}
                  </div>
                  <span className={`text-xs mt-2 font-medium text-center max-w-[80px] hidden sm:block ${
                    step >= num ? 'text-sky-700' : 'text-gray-500'
                  }`}>
                    {stepTitles[num - 1]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-8 bg-white border-2 border-emerald-200 rounded-xl shadow-lg p-6 animate-slideIn">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-emerald-900">Appointment Confirmed!</h3>
                <p className="text-emerald-700 mt-1">You will receive confirmation via SMS and email shortly. Redirecting to dashboard...</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200">
          <div className="bg-gradient-to-r from-sky-600 to-blue-600 px-6 py-5 rounded-t-xl">
            <h2 className="text-xl font-semibold text-white">
              Step {step} of 4: {stepTitles[step - 1]}
            </h2>
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

            <form onSubmit={handleSubmit}>
              {/* Step 1: Department Selection */}
              {step === 1 && (
                <div className="animate-fadeIn">
                  <p className="text-gray-600 mb-6">
                    Please select the medical department that best matches your healthcare needs
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {departments.map((dept) => (
                      <button
                        key={dept.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, department: dept.name })}
                        className={`group p-5 rounded-xl border-2 transition-all text-left hover:shadow-md ${
                          formData.department === dept.name
                            ? 'border-sky-500 bg-sky-50 shadow-md'
                            : 'border-gray-200 hover:border-sky-300'
                        }`}
                      >
                        <div className={`w-14 h-14 rounded-lg flex items-center justify-center mb-3 ${
                          formData.department === dept.name
                            ? 'bg-sky-600 text-white'
                            : 'bg-gray-100 text-gray-600 group-hover:bg-sky-100 group-hover:text-sky-600'
                        } transition-colors`}>
                          {dept.icon}
                        </div>
                        <h4 className="font-semibold text-gray-900 text-base mb-1">{dept.name}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{dept.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Doctor Selection */}
              {step === 2 && (
                <div className="animate-fadeIn">
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-600">Select a doctor from the {formData.department} department</p>
                    <span className="text-sm font-medium text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                      {formData.department}
                    </span>
                  </div>
                  
                  {doctors.length === 0 ? (
                    <div className="text-center py-12">
                      <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="text-gray-500">No approved doctors available in this department</p>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="mt-4 text-sky-600 hover:text-sky-700 font-medium"
                      >
                        Choose different department
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {doctors.map((doctor) => (
                        <button
                          key={doctor._id}
                          type="button"
                          onClick={() => setFormData({ ...formData, doctor: doctor._id })}
                          className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center hover:shadow-md ${
                            formData.doctor === doctor._id
                              ? 'border-sky-500 bg-sky-50 shadow-md'
                              : 'border-gray-200 hover:border-sky-300'
                          }`}
                        >
                          <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 shadow-sm">
                            <span className="text-xl font-bold text-white">{doctor.name.charAt(0)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-base">Dr. {doctor.name}</h4>
                            <p className="text-sm text-gray-600">{doctor.specialization}</p>
                            {doctor.experience && (
                              <p className="text-xs text-gray-500 mt-1">
                                <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {doctor.experience} years of experience
                              </p>
                            )}
                          </div>
                          {formData.doctor === doctor._id && (
                            <div className="ml-4 flex-shrink-0">
                              <div className="w-8 h-8 bg-sky-600 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Date & Time */}
              {step === 3 && (
                <div className="animate-fadeIn">
                  <p className="text-gray-600 mb-6">Choose your preferred appointment date and time slot</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">
                        Appointment Date
                      </label>
                      <input
                        type="date"
                        name="appointmentDate"
                        value={formData.appointmentDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Select a date from today onwards
                      </p>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">
                        Available Time Slots
                      </label>
                      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto p-2 bg-gray-50 rounded-lg border border-gray-200">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setFormData({ ...formData, appointmentTime: time })}
                            className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                              formData.appointmentTime === time
                                ? 'bg-sky-600 text-white shadow-md ring-2 ring-sky-300'
                                : 'bg-white text-gray-700 border border-gray-200 hover:border-sky-300 hover:bg-sky-50'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Reason & Summary */}
              {step === 4 && (
                <div className="animate-fadeIn space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Reason for Consultation
                    </label>
                    <textarea
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition resize-none"
                      placeholder="Please describe your symptoms, concerns, or reason for this medical consultation in detail..."
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Provide detailed information to help the doctor prepare for your consultation
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-sky-50 to-blue-50 border-2 border-sky-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Appointment Summary
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start justify-between py-2 border-b border-sky-200">
                        <span className="text-gray-600 font-medium">Department</span>
                        <span className="font-semibold text-gray-900 text-right">{formData.department}</span>
                      </div>
                      <div className="flex items-start justify-between py-2 border-b border-sky-200">
                        <span className="text-gray-600 font-medium">Doctor</span>
                        <span className="font-semibold text-gray-900 text-right">
                          Dr. {doctors.find(d => d._id === formData.doctor)?.name || 'Not selected'}
                        </span>
                      </div>
                      <div className="flex items-start justify-between py-2 border-b border-sky-200">
                        <span className="text-gray-600 font-medium">Date</span>
                        <span className="font-semibold text-gray-900 text-right">
                          {formData.appointmentDate ? new Date(formData.appointmentDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'Not selected'}
                        </span>
                      </div>
                      <div className="flex items-start justify-between py-2">
                        <span className="text-gray-600 font-medium">Time</span>
                        <span className="font-semibold text-gray-900 text-right">{formData.appointmentTime || 'Not selected'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="sm:w-auto px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>
                )}
                
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 py-3 px-6 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-semibold shadow-md transition flex items-center justify-center"
                  >
                    Next Step
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || success}
                    className="flex-1 py-3 px-6 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : success ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Confirmed
                      </>
                    ) : (
                      <>
                        Confirm Appointment
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Information Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Important Information</h4>
              <ul className="text-sm text-blue-800 space-y-1.5">
                <li className="flex items-start">
                  <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  You will receive confirmation via SMS and email
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Please arrive 10 minutes before your scheduled appointment time
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Bring any relevant medical records, prescriptions, or test results
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Cancellations must be made at least 24 hours in advance
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
