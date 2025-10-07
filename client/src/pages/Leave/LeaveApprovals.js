import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { leavesAPI } from '../../services/api';
import { format } from 'date-fns';
import {
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const LeaveApprovals = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    leaveType: '',
    year: new Date().getFullYear(),
  });

  const { data: leavesData, isLoading } = useQuery(
    ['leaves', currentPage, filters],
    () => leavesAPI.getLeaves({
      page: currentPage,
      limit: 10,
      ...filters,
    }),
    {
      select: (data) => data.data,
    }
  );

  const approveMutation = useMutation(leavesAPI.approveLeave, {
    onSuccess: () => {
      toast.success('Leave request approved successfully!');
      queryClient.invalidateQueries(['leaves']);
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to approve leave request';
      toast.error(message);
    },
  });

  const rejectMutation = useMutation(
    ({ id, rejectionReason }) => leavesAPI.rejectLeave(id, rejectionReason),
    {
      onSuccess: () => {
        toast.success('Leave request rejected');
        queryClient.invalidateQueries(['leaves']);
        setSelectedLeave(null);
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to reject leave request';
        toast.error(message);
      },
    }
  );

  const [selectedLeave, setSelectedLeave] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'badge-approved';
      case 'pending':
        return 'badge-pending';
      case 'rejected':
        return 'badge-rejected';
      case 'cancelled':
        return 'badge-cancelled';
      default:
        return 'badge-cancelled';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-600" />;
      case 'rejected':
        return <XCircleIcon className="w-5 h-5 text-red-600" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleApprove = (leaveId) => {
    approveMutation.mutate(leaveId);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    rejectMutation.mutate({ id: selectedLeave._id, rejectionReason });
  };

  const totalPages = leavesData?.totalPages || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leave Approvals</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review and approve leave requests from employees.
        </p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="input"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leave Type
              </label>
              <select
                value={filters.leaveType}
                onChange={(e) => handleFilterChange('leaveType', e.target.value)}
                className="input"
              >
                <option value="">All Types</option>
                <option value="sick">Sick Leave</option>
                <option value="vacation">Vacation Leave</option>
                <option value="personal">Personal Leave</option>
                <option value="maternity">Maternity Leave</option>
                <option value="paternity">Paternity Leave</option>
                <option value="emergency">Emergency Leave</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', parseInt(e.target.value))}
                className="input"
              >
                <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
                <option value={new Date().getFullYear() - 2}>{new Date().getFullYear() - 2}</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({ status: '', leaveType: '', year: new Date().getFullYear() })}
                className="btn btn-secondary w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Requests */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">
            Leave Requests ({leavesData?.total || 0})
          </h3>
        </div>
        <div className="card-body p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : leavesData?.leaves?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Leave Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Days
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leavesData.leaves.map((leave) => (
                    <tr key={leave._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {leave.employee?.firstName} {leave.employee?.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {leave.employee?.employeeId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <CalendarDaysIcon className="h-5 w-5 text-gray-400 mr-3" />
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {leave.leaveType}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(leave.startDate), 'MMM dd')} - {format(new Date(leave.endDate), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {leave.totalDays} day{leave.totalDays > 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(leave.status)}
                          <span className={`ml-2 badge ${getStatusColor(leave.status)}`}>
                            {leave.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(leave.appliedDate), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedLeave(leave)}
                            className="text-primary-600 hover:text-primary-500 flex items-center"
                          >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            View
                          </button>
                          {leave.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(leave._id)}
                                disabled={approveMutation.isLoading}
                                className="text-green-600 hover:text-green-500 flex items-center"
                              >
                                <CheckCircleIcon className="h-4 w-4 mr-1" />
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedLeave(leave);
                                  setRejectionReason('');
                                }}
                                className="text-red-600 hover:text-red-500 flex items-center"
                              >
                                <XCircleIcon className="h-4 w-4 mr-1" />
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No leave requests found</h3>
              <p className="text-gray-500">
                {Object.values(filters).some(filter => filter !== '' && filter !== new Date().getFullYear())
                  ? 'Try adjusting your filters to see more results.'
                  : 'There are no leave requests to review at the moment.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="card-footer">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn btn-secondary btn-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="btn btn-secondary btn-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Leave Details Modal */}
      {selectedLeave && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Leave Request Details</h3>
                <button
                  onClick={() => setSelectedLeave(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Employee</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedLeave.employee?.firstName} {selectedLeave.employee?.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedLeave.employee?.employeeId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Leave Type</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{selectedLeave.leaveType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Days</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedLeave.totalDays} days</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {format(new Date(selectedLeave.startDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {format(new Date(selectedLeave.endDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Reason</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedLeave.reason}</p>
                </div>

                {selectedLeave.status === 'rejected' && selectedLeave.rejectionReason && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rejection Reason</label>
                    <p className="mt-1 text-sm text-red-600">{selectedLeave.rejectionReason}</p>
                  </div>
                )}

                {selectedLeave.status === 'pending' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rejection Reason (if rejecting)
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                      className="input"
                      placeholder="Enter reason for rejection..."
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setSelectedLeave(null)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
                {selectedLeave.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(selectedLeave._id)}
                      disabled={approveMutation.isLoading}
                      className="btn btn-success"
                    >
                      Approve
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={rejectMutation.isLoading}
                      className="btn btn-danger"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveApprovals;
