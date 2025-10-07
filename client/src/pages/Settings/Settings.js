import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  DatabaseIcon,
} from '@heroicons/react/24/outline';

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure system-wide settings and preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center">
              <CogIcon className="h-6 w-6 text-gray-400 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
            </div>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Name
                </label>
                <input
                  type="text"
                  value="EZLeave"
                  disabled
                  className="input bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Version
                </label>
                <input
                  type="text"
                  value="1.0.0"
                  disabled
                  className="input bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Environment
                </label>
                <input
                  type="text"
                  value="Development"
                  disabled
                  className="input bg-gray-50 text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Leave Settings */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center">
              <BellIcon className="h-6 w-6 text-gray-400 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Leave Settings</h3>
            </div>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Sick Leave Days
                  </label>
                  <input
                    type="number"
                    defaultValue="12"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Vacation Leave Days
                  </label>
                  <input
                    type="number"
                    defaultValue="21"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Personal Leave Days
                  </label>
                  <input
                    type="number"
                    defaultValue="5"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Leave Days Per Request
                  </label>
                  <input
                    type="number"
                    defaultValue="30"
                    className="input"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  id="auto-approve"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="auto-approve" className="ml-2 block text-sm text-gray-900">
                  Enable auto-approval for leave requests under 3 days
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="email-notifications"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-900">
                  Send email notifications for leave status changes
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center">
              <ShieldCheckIcon className="h-6 w-6 text-gray-400 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
            </div>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  defaultValue="30"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password Policy
                </label>
                <select className="input">
                  <option>Minimum 6 characters</option>
                  <option>Minimum 8 characters with special characters</option>
                  <option>Strong password policy</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  id="two-factor"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="two-factor" className="ml-2 block text-sm text-gray-900">
                  Enable two-factor authentication for admin users
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Database Settings */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center">
              <DatabaseIcon className="h-6 w-6 text-gray-400 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Database Settings</h3>
            </div>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Database Type
                </label>
                <input
                  type="text"
                  value="MongoDB"
                  disabled
                  className="input bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Connection Status
                </label>
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-sm text-green-600">Connected</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="btn btn-secondary">
                  Test Connection
                </button>
                <button className="btn btn-primary">
                  Backup Database
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="btn btn-primary btn-lg">
            Save All Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
