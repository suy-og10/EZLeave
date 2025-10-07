import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { usersAPI, departmentsAPI } from '../../services/api';
import { format } from 'date-fns';
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Employees = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    role: '',
  });

  const { data: employeesData, isLoading } = useQuery(
    ['employees', currentPage, filters],
    () => usersAPI.getUsers({
      page: currentPage,
      limit: 10,
      ...filters,
    }),
    {
      select: (data) => data.data,
    }
  );

  const { data: departments = [] } = useQuery(
    'departments',
    departmentsAPI.getDepartments,
    {
      select: (data) => data.data,
    }
  );

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'hr':
        return 'bg-purple-100 text-purple-800';
      case 'employee':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPages = employeesData?.totalPages || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage employee information and profiles.
        </p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="input pl-10"
                  placeholder="Search employees..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                className="input"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
                className="input"
              >
                <option value="">All Roles</option>
                <option value="employee">Employee</option>
                <option value="hr">HR</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({ search: '', department: '', role: '' })}
                className="btn btn-secondary w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Employees List */}
      <div className="card">
        <div className="card-header flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Employees ({employeesData?.total || 0})
          </h3>
          <Link to="/employees/new" className="btn btn-primary">
            Add New Employee
          </Link>
        </div>
        <div className="card-body p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : employeesData?.users?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employeesData.users.map((employee) => (
                    <tr key={employee._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary-600">
                                {employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {employee.firstName} {employee.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {employee.employeeId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${getRoleBadgeColor(employee.role)}`}>
                          {employee.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.department?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(employee.dateOfJoining), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${employee.isActive ? 'badge-approved' : 'badge-rejected'}`}>
                          {employee.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/employees/${employee._id}`}
                            className="text-primary-600 hover:text-primary-500 flex items-center"
                          >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            View
                          </Link>
                          <Link
                            to={`/employees/${employee._id}/edit`}
                            className="text-indigo-600 hover:text-indigo-500 flex items-center"
                          >
                            <PencilIcon className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
              <p className="text-gray-500 mb-4">
                {Object.values(filters).some(filter => filter !== '')
                  ? 'Try adjusting your filters to see more results.'
                  : 'No employees have been added yet.'
                }
              </p>
              {!Object.values(filters).some(filter => filter !== '') && (
                <Link to="/employees/new" className="btn btn-primary">
                  Add First Employee
                </Link>
              )}
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
    </div>
  );
};

export default Employees;
