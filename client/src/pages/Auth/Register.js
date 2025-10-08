import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useAuth } from '../../contexts/AuthContext';
import { departmentsAPI } from '../../services/api';
import ThemeToggle from '../../components/ThemeToggle';
import { EyeIcon, EyeSlashIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'; // Added CalendarDaysIcon
import toast from 'react-hot-toast'; 

// Component for the simple navigation header
const AuthHeader = () => (
  <header className="absolute top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
      {/* Logo/Title */}
      <Link to="/" className="flex items-center space-x-2">
        <CalendarDaysIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        <span className="text-xl font-bold text-gray-900 dark:text-gray-100">EZLeave</span>
      </Link>

      {/* Navigation and Theme Toggle */}
      <nav className="flex items-center space-x-4">
        <Link 
          to="/" 
          className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 text-sm font-medium hidden sm:inline"
        >
          Home
        </Link>
        <Link 
          to="/login" 
          className="btn btn-secondary btn-sm"
        >
          Sign In
        </Link>
        <ThemeToggle />
      </nav>
    </div>
  </header>
);

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Renamed register to signUp for clarity, as it no longer grants immediate login
  const { register: signUpUser, isLoading: authLoading } = useAuth(); 
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const {
    data: departments = [],
    isLoading: departmentsLoading,
    isError: departmentsError,
  } = useQuery('departments', departmentsAPI.getDepartments, {
    // FIX: Select the inner 'data' array from the Axios response object
    select: (response) => response.data, 
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    const { confirmPassword, ...userData } = data;
    const result = await signUpUser(userData);

    if (result.success) {
      toast.success("Registration successful! Your account is pending admin approval and you will be notified when active.", { duration: 6000 });
      // Redirect to login page
      navigate('/login'); 
    }
  };

  if (departmentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="ml-4 text-gray-700 dark:text-gray-300">Loading departments...</p>
      </div>
    );
  }

  if (departmentsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-4 text-center">
          <h2 className="text-2xl font-bold text-red-600">Error Loading Departments</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Could not fetch the list of departments. Please ensure the backend server is running and accessible.
          </p>
          <Link to="/" className="font-medium text-primary-600 hover:text-primary-500">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    // Added relative positioning to anchor the absolute header
    <div className="min-h-screen relative pt-16 flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <AuthHeader /> {/* New Header component */}
      <div className="max-w-md w-full space-y-8">
        <div className="relative">
          {/* Removed ThemeToggle from here since it's now in AuthHeader */}
          
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
            <svg
              className="h-8 w-8 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  {...register('firstName', {
                    required: 'First name is required',
                  })}
                  type="text"
                  autoComplete="given-name"
                  className={`input mt-1 ${errors.firstName ? 'input-error' : ''}`}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  {...register('lastName', {
                    required: 'Last name is required',
                  })}
                  type="text"
                  autoComplete="family-name"
                  className={`input mt-1 ${errors.lastName ? 'input-error' : ''}`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">
                Employee ID
              </label>
              <input
                {...register('employeeId', {
                  required: 'Employee ID is required',
                })}
                type="text"
                className={`input mt-1 ${errors.employeeId ? 'input-error' : ''}`}
                placeholder="EMP001"
              />
              {errors.employeeId && (
                <p className="mt-1 text-sm text-red-600">{errors.employeeId.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                type="email"
                autoComplete="email"
                className={`input mt-1 ${errors.email ? 'input-error' : ''}`}
                placeholder="john.doe@company.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                {...register('phone', {
                  required: 'Phone number is required',
                })}
                type="tel"
                autoComplete="tel"
                className={`input mt-1 ${errors.phone ? 'input-error' : ''}`}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                Position
              </label>
              <input
                {...register('position', {
                  required: 'Position is required',
                })}
                type="text"
                className={`input mt-1 ${errors.position ? 'input-error' : ''}`}
                placeholder="Software Engineer"
              />
              {errors.position && (
                <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                {...register('department', {
                  required: 'Department is required',
                })}
                className={`input mt-1 ${errors.department ? 'input-error' : ''}`}
              >
                <option value="">Select a department</option>
                {/* The map function now correctly receives an array */}
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="dateOfJoining" className="block text-sm font-medium text-gray-700">
                Date of Joining
              </label>
              <input
                {...register('dateOfJoining', {
                  required: 'Date of joining is required',
                })}
                type="date"
                className={`input mt-1 ${errors.dateOfJoining ? 'input-error' : ''}`}
              />
              {errors.dateOfJoining && (
                <p className="mt-1 text-sm text-red-600">{errors.dateOfJoining.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`input pr-10 ${errors.password ? 'input-error' : ''}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === password || 'Passwords do not match',
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`input pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={authLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting for Approval...
                </div>
              ) : (
                'Request Account Approval'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
