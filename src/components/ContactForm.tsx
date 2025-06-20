'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';

interface FormValues {
  name: string;
  email: string;
  phone: string;
  message: string;
  car: string;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(
      /^[0-9]{10}$/,
      'Phone number must be exactly 10 digits'
    ),
  message: Yup.string()
    .required('Message is required')
    .min(10, 'Message must be at least 10 characters'),
  car: Yup.string()
    .required('Car is required')
    .min(2, 'Car must be at least 2 characters'),
});

export default function ContactForm() {
  const [showPopup, setShowPopup] = useState(false);

  const formik = useFormik<FormValues>({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      car: '',
    },
    validationSchema,
    onSubmit: (values) => {
      setShowPopup(true);
    },
  });

  return (
    <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-200 bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-indigo-700 drop-shadow-lg tracking-tight">Contact Form</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-indigo-700 mb-1">Name*</label>
            <input
              id="name"
              type="text"
              {...formik.getFieldProps('name')}
              className={`mt-1 block w-full rounded-lg border-2 border-gray-200 shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all duration-200 bg-white/80 backdrop-blur-sm ${formik.touched.name && formik.errors.name ? 'border-red-400' : ''}`}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-xs mt-1 font-medium">{formik.errors.name}</div>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-indigo-700 mb-1">Email*</label>
            <input
              id="email"
              type="email"
              {...formik.getFieldProps('email')}
              className={`mt-1 block w-full rounded-lg border-2 border-gray-200 shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all duration-200 bg-white/80 backdrop-blur-sm ${formik.touched.email && formik.errors.email ? 'border-red-400' : ''}`}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-xs mt-1 font-medium">{formik.errors.email}</div>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-indigo-700 mb-1">Phone Number*</label>
            <input
              id="phone"
              type="tel"
              {...formik.getFieldProps('phone')}
              className={`mt-1 block w-full rounded-lg border-2 border-gray-200 shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all duration-200 bg-white/80 backdrop-blur-sm ${formik.touched.phone && formik.errors.phone ? 'border-red-400' : ''}`}
            />
            {formik.touched.phone && formik.errors.phone && (
              <div className="text-red-500 text-xs mt-1 font-medium">{formik.errors.phone}</div>
            )}
          </div>
          <div>
            <label htmlFor="car" className="block text-sm font-semibold text-indigo-700 mb-1">Car*</label>
            <input
              id="car"
              type="text"
              {...formik.getFieldProps('car')}
              className={`mt-1 block w-full rounded-lg border-2 border-gray-200 shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all duration-200 bg-white/80 backdrop-blur-sm ${formik.touched.car && formik.errors.car ? 'border-red-400' : ''}`}
            />
            {formik.touched.car && formik.errors.car && (
              <div className="text-red-500 text-xs mt-1 font-medium">{formik.errors.car}</div>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-indigo-700 mb-1">Message*</label>
          <textarea
            id="message"
            {...formik.getFieldProps('message')}
            rows={4}
            className={`mt-1 block w-full rounded-lg border-2 border-gray-200 shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all duration-200 bg-white/80 backdrop-blur-sm ${formik.touched.message && formik.errors.message ? 'border-red-400' : ''}`}
          />
          {formik.touched.message && formik.errors.message && (
            <div className="text-red-500 text-xs mt-1 font-medium">{formik.errors.message}</div>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 via-pink-400 to-indigo-400 text-white py-3 px-6 rounded-lg font-bold text-lg shadow-lg hover:scale-105 hover:from-pink-500 hover:to-indigo-500 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-pink-200 focus:ring-offset-2"
        >
          Submit
        </button>
      </form>
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-pink-200">
            <h3 className="text-2xl font-bold mb-4 text-indigo-700 text-center">Form Submission Details</h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>Name:</strong> {formik.values.name}</p>
              <p><strong>Email:</strong> {formik.values.email}</p>
              <p><strong>Phone:</strong> {formik.values.phone}</p>
              <p><strong>Car:</strong> {formik.values.car}</p>
              <p><strong>Message:</strong> {formik.values.message}</p>
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