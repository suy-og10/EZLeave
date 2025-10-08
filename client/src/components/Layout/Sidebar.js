import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  XMarkIcon,
  HomeIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  CogIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const Sidebar = ({ open, setOpen }) => {
  const { user } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/app/dashboard', icon: HomeIcon },
    { name: 'Apply Leave', href: '/app/leave/apply', icon: CalendarDaysIcon },
    { name: 'Leave History', href: '/app/leave/history', icon: DocumentTextIcon },
    ...(user?.role === 'admin' || user?.role === 'hr' ? [
      { name: 'Leave Approvals', href: '/app/leave/approvals', icon: DocumentTextIcon },
      { name: 'Employees', href: '/app/employees', icon: UsersIcon },
      { name: 'Departments', href: '/app/departments', icon: BuildingOfficeIcon },
      { name: 'Reports', href: '/app/reports', icon: ChartBarIcon },
    ] : []),
    { name: 'Profile', href: '/app/profile', icon: UserCircleIcon },
    ...(user?.role === 'admin' ? [
      { name: 'Settings', href: '/app/settings', icon: CogIcon },
    ] : []),
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Updated: Removed bg-primary-600 for a minimalist, flat header look */}
      <div className="flex items-center justify-between h-16 px-4">
        <Link to="/app/dashboard" className="flex items-center">
          <div className="flex-shrink-0">
            {/* Adjusted icon color for better contrast against white/dark mode background */}
            <CalendarDaysIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          {/* Adjusted text color for minimalist theme */}
          <span className="ml-3 text-xl font-bold text-gray-900 dark:text-gray-100">EZLeave</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname.startsWith(item.href); // Use startsWith for nested routes like /leave/history/123
          return (
            <Link
              key={item.name}
              to={item.href}
              className={clsx(
                'sidebar-item',
                isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'
              )}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center px-1 py-1">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-600 dark:text-primary-200">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar (unchanged transition logic) */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1 bg-white dark:bg-gray-800">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    {/* Adjusted mobile close button color for better visibility against dark overlay */}
                    <button
                      type="button"
                      className="-m-2.5 p-2.5 text-white"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                {/* Note: The outer div used to be here, moved content up to Dialog.Panel for minimalism */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-800 px-6 pb-2">
                  <SidebarContent />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700">
          <SidebarContent />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
