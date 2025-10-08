import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../../contexts/AuthContext';
import { usersAPI, leavesAPI } from '../../services/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import {
  UserIcon,
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

const EmployeeDetails = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth(); // Renamed to currentUser to avoid conflict

  const queryClient = useQueryClient();

  const { data: employee, isLoading: employeeLoading } = useQuery(
    ['employee', id],
    () => usersAPI.getUser(id),
    {
      select: (data) => data.data,
    }
  );

  const { data: leavesData, isLoading: leavesLoading } = useQuery(
    ['employeeLeaves', id],
    () => leavesAPI.getLeaves({ employee: id, limit: 10 }),
    {
      select: (data) => data.data,
    }
  );

  // Mutation to toggle approval status
  const approveUserMutation = useMutation(
    () => usersAPI.updateUser(id, { isApproved: true, isActive: true }),
    {
      onSuccess: (updatedUser) => {
        toast.success(`${updatedUser.data.firstName} has been approved and activated.`);
        queryClient.invalidateQueries(['employee', id]);
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to approve user.';
        toast.error(message);
      },
    }
  );

  // Helper function to render action buttons
  const renderAdminActions = () => {
    if (currentUser?.role === 'admin' || currentUser?.role === 'hr') {
        return (
            <>
                <Link
                  to={`/app/employees/${employee._id}/edit`}
                  className="w-full btn btn-primary flex items-center justify-center"
                >
                  <UserIcon className="w-5 h-5 mr-2" />
                  Edit Employee
                </Link>

                {/* NEW: Approval/Activation Button */}
                {!employee.isApproved && (
                    <button 
                        onClick={() => approveUserMutation.mutate()}
                        disabled={approveUserMutation.isLoading}
                        className="w-full btn btn-success flex items-center justify-center"
                    >
                        {approveUserMutation.isLoading ? 'Approving...' : 'Approve Registration'}
                    </button>
                )}

                <Link
                  to={`/app/employees/${employee._id}/leaves`}
                  className="w-full btn btn-secondary flex items-center justify-center"
                >
                  <CalendarDaysIcon className="w-5 h-5 mr-2" />
                  View All Leaves
                </Link>
                
                {/* Deactivate button visible only to Admin */}
                {currentUser?.role === 'admin' && (
                  <button className="w-full btn btn-danger">
                    Deactivate Employee
                  </button>
                )}
            </>
        );
    }
    return null;
  };

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

  if (employeeLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-12">
        <UserIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Employee not found</h3>
        <p className="text-gray-500 mb-4">The employee you're looking for doesn't exist.</p>
        <Link to="/app/employees" className="btn btn-primary">
          Back to Employees
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          to="/app/employees"
          className="flex items-center text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to Employees
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Employee Details</h1>
        <p className="mt-1 text-sm text-gray-500">
          View detailed information about {employee.firstName} {employee.lastName}.
        </p>
      </div>

      {/* Employee Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <p className="mt-1 text-sm text-gray-900">{employee.firstName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <p className="mt-1 text-sm text-gray-900">{employee.lastName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                  <p className="mt-1 text-sm text-gray-900">{employee.employeeId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{employee.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{employee.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Position</label>
                  <p className="mt-1 text-sm text-gray-900">{employee.position}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <p className="mt-1 text-sm text-gray-900">{employee.department?.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{employee.role}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Joining</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {format(new Date(employee.dateOfJoining), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Approval Status</label>
                  <span className={`badge ${employee.isApproved ? 'badge-approved' : 'badge-pending'}`}>
                    {employee.isApproved ? 'Approved' : 'Pending Approval'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Active Status</label>
                  <span className={`badge ${employee.isActive ? 'badge-approved' : 'badge-rejected'}`}>
                    {employee.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Leave History */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Recent Leave Requests</h3>
            </div>
            <div className="card-body">
              {leavesLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                </div>
              ) : leavesData?.leaves?.length > 0 ? (
                <div className="space-y-4">
                  {leavesData.leaves.map((leave) => (
                    <div key={leave._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${getStatusColor(leave.status)}`}>
                          {getStatusIcon(leave.status)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 capitalize">
                            {leave.leaveType} Leave
                          </p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(leave.startDate), 'MMM dd')} - {format(new Date(leave.endDate), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`badge ${getStatusColor(leave.status)}`}>
                          {leave.status}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          {leave.totalDays} day{leave.totalDays > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>No leave requests found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Leave Balance & Quick Actions */}
        <div className="space-y-6">
          {/* Leave Balance */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Leave Balance</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                {Object.entries(employee.leaveBalance || {}).map(([type, balance]) => (
                  <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 capitalize">{type}</h4>
                    <p className="text-2xl font-bold text-primary-600 mt-1">{balance}</p>
                    <p className="text-xs text-gray-400">days remaining</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                {renderAdminActions()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
