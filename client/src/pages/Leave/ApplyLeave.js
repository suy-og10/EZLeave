import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../../contexts/AuthContext';
import { leavesAPI } from '../../services/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

const ApplyLeave = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const createLeaveMutation = useMutation(leavesAPI.createLeave, {
    onSuccess: () => {
      toast.success('Leave application submitted successfully!');
      queryClient.invalidateQueries(['leaves']);
      reset();
      setStartDate(null);
      setEndDate(null);
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to submit leave application';
      toast.error(message);
    },
  });

  const onSubmit = (data) => {
    if (!startDate || !endDate) {
      toast.error('Please select start and end dates');
      return;
    }

    const leaveData = {
      ...data,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    createLeaveMutation.mutate(leaveData);
  };

  const leaveTypes = [
    { value: 'sick', label: 'Sick Leave' },
    { value: 'vacation', label: 'Vacation Leave' },
    { value: 'personal', label: 'Personal Leave' },
    { value: 'maternity', label: 'Maternity Leave' },
    { value: 'paternity', label: 'Paternity Leave' },
    { value: 'emergency', label: 'Emergency Leave' },
  ];

  const calculateDays = () => {
    if (startDate && endDate) {
      const timeDiff = endDate.getTime() - startDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
      return daysDiff > 0 ? daysDiff : 0;
    }
    return 0;
  };

  const getAvailableBalance = (leaveType) => {
    return user?.leaveBalance?.[leaveType] || 0;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Apply for Leave</h1>
        <p className="mt-1 text-sm text-gray-500">
          Submit a new leave request for approval.
        </p>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Leave Type */}
            <div>
              <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700">
                Leave Type *
              </label>
              <select
                {...register('leaveType', {
                  required: 'Please select a leave type',
                })}
                className={`input mt-1 ${errors.leaveType ? 'input-error' : ''}`}
              >
                <option value="">Select leave type</option>
                {leaveTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label} ({getAvailableBalance(type.value)} days available)
                  </option>
                ))}
              </select>
              {errors.leaveType && (
                <p className="mt-1 text-sm text-red-600">{errors.leaveType.message}</p>
              )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date *
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                    if (date && endDate && date > endDate) {
                      setEndDate(null);
                    }
                  }}
                  minDate={new Date()}
                  dateFormat="MMM dd, yyyy"
                  className={`input mt-1 w-full ${errors.startDate ? 'input-error' : ''}`}
                  placeholderText="Select start date"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date *
                </label>
                <DatePicker
                  selected={endDate}
                  onChange={setEndDate}
                  minDate={startDate || new Date()}
                  dateFormat="MMM dd, yyyy"
                  className={`input mt-1 w-full ${errors.endDate ? 'input-error' : ''}`}
                  placeholderText="Select end date"
                />
              </div>
            </div>

            {/* Calculated Days */}
            {calculateDays() > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CalendarDaysIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-800">
                    Total days requested: {calculateDays()} day{calculateDays() > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            )}

            {/* Reason */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                Reason for Leave *
              </label>
              <textarea
                {...register('reason', {
                  required: 'Please provide a reason for your leave',
                  minLength: {
                    value: 10,
                    message: 'Reason must be at least 10 characters',
                  },
                })}
                rows={4}
                className={`input mt-1 ${errors.reason ? 'input-error' : ''}`}
                placeholder="Please provide a detailed reason for your leave request..."
              />
              {errors.reason && (
                <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>
              )}
            </div>

            {/* Leave Balance Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Your Leave Balance</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(user?.leaveBalance || {}).map(([type, balance]) => (
                  <div key={type} className="text-center">
                    <p className="text-xs text-gray-500 capitalize">{type}</p>
                    <p className="text-lg font-semibold text-gray-900">{balance}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  reset();
                  setStartDate(null);
                  setEndDate(null);
                }}
                className="btn btn-secondary"
              >
                Clear Form
              </button>
              <button
                type="submit"
                disabled={createLeaveMutation.isLoading}
                className="btn btn-primary"
              >
                {createLeaveMutation.isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit Leave Request'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;
