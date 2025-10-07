import React from 'react';
import { useQuery } from 'react-query';
import { useAuth } from '../../contexts/AuthContext';
import { leavesAPI, usersAPI } from '../../services/api';
import {
  ChartBarIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Reports = () => {
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

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const leaveTypeData = leaveStats?.leaveTypeStats?.map((stat, index) => ({
    name: stat._id.charAt(0).toUpperCase() + stat._id.slice(1),
    value: stat.count,
    color: COLORS[index % COLORS.length],
  })) || [];

  const statusData = [
    { name: 'Approved', value: leaveStats?.summary?.approvedLeaves || 0, color: '#10B981' },
    { name: 'Pending', value: leaveStats?.summary?.pendingLeaves || 0, color: '#F59E0B' },
    { name: 'Rejected', value: leaveStats?.summary?.rejectedLeaves || 0, color: '#EF4444' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          View comprehensive reports and analytics for leave management.
        </p>
      </div>

      {/* Summary Cards */}
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leave Types Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Leave Types Distribution</h3>
          </div>
          <div className="card-body">
            {leaveTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={leaveTypeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <ChartBarIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>No data available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Leave Status Distribution</h3>
          </div>
          <div className="card-body">
            {statusData.some(item => item.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <ChartBarIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>No data available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Department Statistics */}
      {adminStats && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Department Statistics</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminStats.departmentStats.map((dept, index) => (
                <div key={dept._id} className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">{dept.departmentName}</h4>
                  <div className="flex items-center justify-center mb-2">
                    <UserGroupIcon className="h-8 w-8 text-primary-600" />
                  </div>
                  <p className="text-2xl font-bold text-primary-600">{dept.count}</p>
                  <p className="text-sm text-gray-500">employees</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* User Statistics */}
      {adminStats && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">User Statistics</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <UserGroupIcon className="mx-auto h-8 w-8 text-blue-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{adminStats.userStats.totalUsers}</p>
                <p className="text-sm text-gray-500">Total Users</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <CheckCircleIcon className="mx-auto h-8 w-8 text-green-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{adminStats.userStats.activeUsers}</p>
                <p className="text-sm text-gray-500">Active Users</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <UserIcon className="mx-auto h-8 w-8 text-purple-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{adminStats.userStats.adminUsers}</p>
                <p className="text-sm text-gray-500">Admins</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <UserGroupIcon className="mx-auto h-8 w-8 text-indigo-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{adminStats.userStats.employeeUsers}</p>
                <p className="text-sm text-gray-500">Employees</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
