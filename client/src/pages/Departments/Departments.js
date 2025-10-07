import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useAuth } from '../../contexts/AuthContext';
import { departmentsAPI } from '../../services/api';
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';

const Departments = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: departments = [], isLoading } = useQuery(
    'departments',
    departmentsAPI.getDepartments,
    {
      select: (data) => data.data,
    }
  );

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage departments and their information.
        </p>
      </div>

      {/* Search */}
      <div className="card">
        <div className="card-body">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
              placeholder="Search departments..."
            />
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredDepartments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((department) => (
            <div key={department._id} className="card">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <BuildingOfficeIcon className="h-8 w-8 text-primary-600 mr-3" />
                    <h3 className="text-lg font-medium text-gray-900">{department.name}</h3>
                  </div>
                  <span className={`badge ${department.isActive ? 'badge-approved' : 'badge-rejected'}`}>
                    {department.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {department.description && (
                  <p className="text-sm text-gray-500 mb-4">{department.description}</p>
                )}

                <div className="flex items-center mb-4">
                  <UserGroupIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500">
                    {department.head ? `${department.head.firstName} ${department.head.lastName}` : 'No head assigned'}
                  </span>
                </div>

                <div className="flex justify-end space-x-2">
                  <button className="text-primary-600 hover:text-primary-500 flex items-center">
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View
                  </button>
                  {(user?.role === 'admin' || user?.role === 'hr') && (
                    <button className="text-indigo-600 hover:text-indigo-500 flex items-center">
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No departments found' : 'No departments yet'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? 'Try adjusting your search terms.'
              : 'Departments will appear here once they are created.'
            }
          </p>
          {!searchTerm && (user?.role === 'admin' || user?.role === 'hr') && (
            <button className="btn btn-primary">
              Create Department
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Departments;
