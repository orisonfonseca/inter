'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';

interface FormValues {
  name: string;
  email: string;
  phone: string;
  message: string;
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
});

export default function ContactForm() {
  const [showPopup, setShowPopup] = useState(false);

  const formik = useFormik<FormValues>({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
    validationSchema,
    onSubmit: (values) => {
      setShowPopup(true);
    },
  });

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Contact Form</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name*
          </label>
          <input
            id="name"
            type="text"
            {...formik.getFieldProps('name')}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
              formik.touched.name && formik.errors.name ? 'border-red-500' : ''
            }`}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email*
          </label>
          <input
            id="email"
            type="email"
            {...formik.getFieldProps('email')}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
              formik.touched.email && formik.errors.email ? 'border-red-500' : ''
            }`}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number*
          </label>
          <input
            id="phone"
            type="tel"
            {...formik.getFieldProps('phone')}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
              formik.touched.phone && formik.errors.phone ? 'border-red-500' : ''
            }`}
          />
          {formik.touched.phone && formik.errors.phone && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.phone}</div>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message*
          </label>
          <textarea
            id="message"
            {...formik.getFieldProps('message')}
            rows={4}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
              formik.touched.message && formik.errors.message ? 'border-red-500' : ''
            }`}
          />
          {formik.touched.message && formik.errors.message && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.message}</div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </form>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Form Submission Details</h3>
            <div className="space-y-2">
              <p><strong>Name:</strong> {formik.values.name}</p>
              <p><strong>Email:</strong> {formik.values.email}</p>
              <p><strong>Phone:</strong> {formik.values.phone}</p>
              <p><strong>Message:</strong> {formik.values.message}</p>
            </div>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 