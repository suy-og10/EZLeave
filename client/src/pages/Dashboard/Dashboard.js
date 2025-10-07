import React from 'react';
import { useQuery } from 'react-query';
import { useAuth } from '../../contexts/AuthContext';
import { leavesAPI, usersAPI } from '../../services/api';
import {
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserGroupIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  const { data: leaveStats } = useQuery(
    'leaveStats',
    () => leavesAPI.getLeaveStats({ year: new Date().getFullYear() }),
    {
      select: (data) => data.data,
    }
  );

  const { data: adminStats } = useQuery(
    'adminStats',
    usersAPI.getUserStats,
    {
      enabled: user?.role === 'admin' || user?.role === 'hr',
      select: (data) => data.data,
    }
  );

  const { data: recentLeaves } = useQuery(
    'recentLeaves',
    () => leavesAPI.getLeaves({ limit: 5 }),
    {
      enabled: user?.role === 'admin' || user?.role === 'hr',
      select: (data) => data.data.leaves,
    }
  );

  const { data: userLeaves } = useQuery(
    'userLeaves',
    () => leavesAPI.getLeaves({ limit: 5 }),
    {
      enabled: user?.role === 'employee',
      select: (data) => data.data.leaves,
    }
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5" />;
      case 'rejected':
        return <XCircleIcon className="w-5 h-5" />;
      default:
        return <ClockIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-primary-100">
          Here's what's happening with your leave requests today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarDaysIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Leaves</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {leaveStats?.summary?.totalLeaves || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {leaveStats?.summary?.pendingLeaves || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Approved</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {leaveStats?.summary?.approvedLeaves || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Rejected</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {leaveStats?.summary?.rejectedLeaves || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Stats */}
      {(user?.role === 'admin' || user?.role === 'hr') && adminStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserGroupIcon className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Employees</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {adminStats.userStats.activeUsers}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Departments</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {adminStats.departmentStats.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {adminStats.leaveStats.pendingLeaves}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leave Balance */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Your Leave Balance</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(user?.leaveBalance || {}).map(([type, balance]) => (
              <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 capitalize">{type}</h4>
                <p className="text-2xl font-bold text-primary-600 mt-1">{balance}</p>
                <p className="text-xs text-gray-400">days remaining</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Leaves */}
      <div className="card">
        <div className="card-header flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            {user?.role === 'employee' ? 'Your Recent Leaves' : 'Recent Leave Requests'}
          </h3>
          <Link
            to={user?.role === 'employee' ? '/leave/history' : '/leave/approvals'}
            className="text-sm text-primary-600 hover:text-primary-500"
          >
            View all
          </Link>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {(user?.role === 'employee' ? userLeaves : recentLeaves)?.map((leave) => (
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
            )) || (
              <div className="text-center py-8 text-gray-500">
                <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p>No recent leave requests</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-body">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/leave/apply"
                className="w-full btn btn-primary flex items-center justify-center"
              >
                <CalendarDaysIcon className="w-5 h-5 mr-2" />
                Apply for Leave
              </Link>
              <Link
                to="/leave/history"
                className="w-full btn btn-secondary flex items-center justify-center"
              >
                <ClockIcon className="w-5 h-5 mr-2" />
                View Leave History
              </Link>
            </div>
          </div>
        </div>

        {(user?.role === 'admin' || user?.role === 'hr') && (
          <div className="card">
            <div className="card-body">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Admin Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/leave/approvals"
                  className="w-full btn btn-primary flex items-center justify-center"
                >
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  Review Pending Leaves
                </Link>
                <Link
                  to="/employees"
                  className="w-full btn btn-secondary flex items-center justify-center"
                >
                  <UserGroupIcon className="w-5 h-5 mr-2" />
                  Manage Employees
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
