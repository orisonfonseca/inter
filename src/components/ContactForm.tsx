'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';

interface FormValues {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  favoriteSport: string;
  favoriteTeam: string;
  favoriteSportsIcon: string;
}

const validationSchema = Yup.object({
  fullName: Yup.string()
    .required('Full Name is required')
    .min(3, 'Full Name must be at least 3 characters'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(
      /^[0-9]{10}$/,
      'Phone number must be a valid 10-digit number'
    ),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  city: Yup.string()
    .required('City is required')
    .min(3, 'City must be at least 3 characters'),
  favoriteSport: Yup.string()
    .required('Favorite Sport is required'),
  favoriteTeam: Yup.string()
    .required('Favorite Team is required'),
  favoriteSportsIcon: Yup.string()
    .required('Favorite Sports Icon is required'),
});

export default function ContactForm() {
  const [showPopup, setShowPopup] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [shakeField, setShakeField] = useState(false);

  const formFields: { name: keyof FormValues; label: string; type: string; }[] = [
    { name: 'fullName', label: 'Full Name*', type: 'text' },
    { name: 'phone', label: 'Phone*', type: 'tel' },
    { name: 'email', label: 'Email*', type: 'email' },
    { name: 'city', label: 'City*', type: 'text' },
    { name: 'favoriteSport', label: 'Favorite Sport*', type: 'text' },
    { name: 'favoriteTeam', label: 'Favorite Team*', type: 'text' },
    { name: 'favoriteSportsIcon', label: 'Favorite Sports Icon*', type: 'text' },
  ];

  const formik = useFormik<FormValues>({
    initialValues: {
      fullName: '',
      phone: '',
      email: '',
      city: '',
      favoriteSport: '',
      favoriteTeam: '',
      favoriteSportsIcon: '',
    },
    validationSchema,
    onSubmit: (values) => {
      setShowPopup(true);
    },
  });

  const handleNext = async () => {
    const fieldName = formFields[currentStep].name;
    await formik.setFieldTouched(fieldName, true, true);
    const errors = await formik.validateForm();
    if (!errors[fieldName]) {
      if (currentStep < formFields.length) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      setShakeField(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    if (shakeField) {
      const timer = setTimeout(() => setShakeField(false), 500); // Duration of the shake animation
      return () => clearTimeout(timer);
    }
  }, [shakeField]);

  return (
    <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-200 bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-center text-indigo-700 drop-shadow-lg tracking-tight">
        {currentStep === formFields.length ? 'Review Your Details' : 'Contact Form'}
      </h2>
      {currentStep < formFields.length && (
      <div className="mb-8">
          <div className="flex justify-between mb-2">
              <span className="text-base font-semibold text-indigo-700">Step {currentStep + 1} of {formFields.length}</span>
              <span className="text-sm font-semibold text-indigo-700">{Math.round(((currentStep + 1) / formFields.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-gradient-to-r from-indigo-500 to-pink-500 h-2.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${((currentStep + 1) / formFields.length) * 100}%` }}></div>
          </div>
      </div>
      )}
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {currentStep < formFields.length ? (
        (() => {
          const currentField = formFields[currentStep];
          const fieldName = currentField.name;
          const inputClasses = `mt-1 block w-full rounded-lg border-2 border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm ${
            formik.touched[fieldName] && formik.errors[fieldName] ? 'border-red-400' : ''
          } ${shakeField && formik.errors[fieldName] ? 'shake' : ''}`;
          return (
            <>
              <div className="relative h-28">
                <div key={currentStep}>
                  <label htmlFor={fieldName} className="block text-sm font-semibold text-indigo-700 mb-1">{currentField.label}</label>
                    <input
                      id={fieldName}
                      type={currentField.type}
                      {...formik.getFieldProps(fieldName)}
                      className={inputClasses}
                    />
                  {formik.touched[fieldName] && formik.errors[fieldName] && (
                    <div className="text-red-500 text-xs mt-1 font-medium">{formik.errors[fieldName]}</div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                {currentStep > 0 ? (
                   <button
                    type="button"
                    onClick={handleBack}
                    className="bg-transparent hover:bg-indigo-50 text-indigo-700 font-semibold hover:text-indigo-800 py-2 px-4 border border-indigo-200 hover:border-transparent rounded-lg transition-all duration-200"
                  >
                    Back
                  </button>
                ) : <div />}

               {currentStep < formFields.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-2 px-6 rounded-lg font-bold shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200"
                  >
                    Next
                  </button>
                ) : (
                   <button
                      type="button"
                      onClick={handleNext}
                      className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-2 px-6 rounded-lg font-bold shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200"
                    >
                      Review
                    </button>
                )}
              </div>
            </>
          );
        })()
        ) : (
          <>
            <div className="space-y-4">
              {formFields.map((field, index) => (
                <div key={field.name} className="flex items-center justify-between bg-white/80 p-3 rounded-lg shadow-sm">
                  <div>
                    <label className="block text-sm font-semibold text-indigo-700">{field.label}</label>
                    <p className="text-gray-800">{formik.values[field.name]}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(index)}
                    className="bg-transparent hover:bg-indigo-50 text-indigo-700 font-semibold py-1 px-3 border border-indigo-200 rounded-lg text-sm"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-8">
               <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="bg-transparent hover:bg-indigo-50 text-indigo-700 font-semibold hover:text-indigo-800 py-2 px-4 border border-indigo-200 hover:border-transparent rounded-lg transition-all duration-200"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 via-pink-400 to-indigo-400 text-white py-3 px-6 rounded-lg font-bold text-lg shadow-lg hover:scale-105 hover:from-pink-500 hover:to-indigo-500 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-pink-200 focus:ring-offset-2"
              >
                Submit
              </button>
            </div>
          </>
        )}
      </form>
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-pink-200">
            <h3 className="text-2xl font-bold mb-4 text-indigo-700 text-center">Form Submission Details</h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>Full Name:</strong> {formik.values.fullName}</p>
              <p><strong>Phone:</strong> {formik.values.phone}</p>
              <p><strong>Email:</strong> {formik.values.email}</p>
              <p><strong>City:</strong> {formik.values.city}</p>
              <p><strong>Favorite Sport:</strong> {formik.values.favoriteSport}</p>
              <p><strong>Favorite Team:</strong> {formik.values.favoriteTeam}</p>
              <p><strong>Favorite Sports Icon:</strong> {formik.values.favoriteSportsIcon}</p>
            </div>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-6 w-full bg-gradient-to-r from-pink-400 to-indigo-500 text-white py-2 px-4 rounded-lg font-semibold shadow hover:scale-105 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 