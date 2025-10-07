import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import ThemeToggle from '../ThemeToggle';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 lg:pl-64">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300"
            onClick={onMenuClick}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <h1 className="ml-2 text-xl font-semibold text-gray-900 dark:text-gray-100 lg:ml-0">
            Welcome back, {user?.firstName}!
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <button
            type="button"
            className="relative rounded-full bg-white dark:bg-gray-800 p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>

          {/* Profile dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-3 rounded-full bg-white dark:bg-gray-800 p-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
              <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <span className="text-sm font-medium text-primary-600 dark:text-primary-200">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
              </div>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-600 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/profile"
                      className={clsx(
                        active ? 'bg-gray-100 dark:bg-gray-700' : '',
                        'flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300'
                      )}
                    >
                      <UserCircleIcon className="mr-3 h-4 w-4" />
                      Your Profile
                    </Link>
                  )}
                </Menu.Item>
                
                {user?.role === 'admin' && (
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/settings"
                        className={clsx(
                          active ? 'bg-gray-100 dark:bg-gray-700' : '',
                          'flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300'
                        )}
                      >
                        <CogIcon className="mr-3 h-4 w-4" />
                        Settings
                      </Link>
                    )}
                  </Menu.Item>
                )}

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={clsx(
                        active ? 'bg-gray-100 dark:bg-gray-700' : '',
                        'flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300'
                      )}
                    >
                      <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
};

export default Header;
