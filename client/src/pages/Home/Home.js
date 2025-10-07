import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';
import {
  CalendarDaysIcon,
  UserGroupIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ClockIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: CalendarDaysIcon,
      title: 'Easy Leave Application',
      description: 'Submit leave requests with just a few clicks. Choose your dates, select leave type, and add notes.',
    },
    {
      icon: UserGroupIcon,
      title: 'Team Management',
      description: 'HR and managers can easily view team calendars and manage employee leave requests.',
    },
    {
      icon: ChartBarIcon,
      title: 'Analytics & Reports',
      description: 'Comprehensive reports on leave patterns, department analytics, and workforce insights.',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Compliant',
      description: 'Enterprise-grade security with role-based access control and audit trails.',
    },
    {
      icon: ClockIcon,
      title: 'Real-time Updates',
      description: 'Instant notifications for leave approvals, rejections, and important updates.',
    },
    {
      icon: DocumentTextIcon,
      title: 'Document Management',
      description: 'Upload supporting documents and maintain complete leave records.',
    },
  ];

  const benefits = [
    'Streamlined leave management process',
    'Reduced administrative overhead',
    'Better visibility into team availability',
    'Automated approval workflows',
    'Mobile-responsive design',
    'Integration with HR systems',
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <CalendarDaysIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">EZLeave</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Leave Management System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {isAuthenticated ? (
                <Link
                  to="/app/dashboard"
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center"
                >
                  Go to Dashboard
                  <ArrowRightIcon className="ml-2 w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 dark:text-gray-300 hover:text-primary-600 px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Modern Leave Management
              <span className="block text-primary-600">Made Simple</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Streamline your HR operations with EZLeave. A comprehensive leave management system 
              designed for modern teams that value efficiency and transparency.
            </p>
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition-colors duration-200 text-lg font-semibold inline-flex items-center justify-center"
                >
                  Start Free Trial
                  <ArrowRightIcon className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="border border-primary-600 text-primary-600 px-8 py-4 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors duration-200 text-lg font-semibold inline-flex items-center justify-center"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Everything You Need for Leave Management
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools your organization needs 
              to manage employee leave efficiently and transparently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Why Choose EZLeave?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Join thousands of organizations that have transformed their leave management 
                process with EZLeave. Experience the difference that modern technology makes.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <div className="text-center">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CalendarDaysIcon className="w-12 h-12 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Ready to Get Started?</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Transform your leave management process today. 
                  Start with a free trial and see the difference.
                </p>
                {!isAuthenticated && (
                  <Link
                    to="/register"
                    className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-semibold inline-flex items-center"
                  >
                    Create Account
                    <ArrowRightIcon className="ml-2 w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <CalendarDaysIcon className="w-5 h-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold">EZLeave</span>
              </div>
              <p className="text-gray-400 mb-4">
                Modern leave management system designed for efficiency, 
                transparency, and user experience.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Sign In</Link></li>
                <li><Link to="/register" className="text-gray-400 hover:text-white transition-colors">Get Started</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 EZLeave. All rights reserved. Built with modern web technologies.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
