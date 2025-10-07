import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layout
import Layout from './components/Layout/Layout';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Dashboard Pages
import Dashboard from './pages/Dashboard/Dashboard';

// Leave Pages
import ApplyLeave from './pages/Leave/ApplyLeave';
import LeaveHistory from './pages/Leave/LeaveHistory';
import LeaveApprovals from './pages/Leave/LeaveApprovals';

// Employee Pages
import Employees from './pages/Employees/Employees';
import EmployeeDetails from './pages/Employees/EmployeeDetails';

// Department Pages
import Departments from './pages/Departments/Departments';

// Reports Pages
import Reports from './pages/Reports/Reports';

// Profile Pages
import Profile from './pages/Profile/Profile';

// Settings Pages
import Settings from './pages/Settings/Settings';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'admin' && user?.role !== 'hr') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Leave Management */}
        <Route path="leave/apply" element={<ApplyLeave />} />
        <Route path="leave/history" element={<LeaveHistory />} />
        <Route
          path="leave/approvals"
          element={
            <AdminRoute>
              <LeaveApprovals />
            </AdminRoute>
          }
        />

        {/* Employee Management (Admin/HR only) */}
        <Route
          path="employees"
          element={
            <AdminRoute>
              <Employees />
            </AdminRoute>
          }
        />
        <Route
          path="employees/:id"
          element={
            <AdminRoute>
              <EmployeeDetails />
            </AdminRoute>
          }
        />

        {/* Department Management (Admin/HR only) */}
        <Route
          path="departments"
          element={
            <AdminRoute>
              <Departments />
            </AdminRoute>
          }
        />

        {/* Reports (Admin/HR only) */}
        <Route
          path="reports"
          element={
            <AdminRoute>
              <Reports />
            </AdminRoute>
          }
        />

        {/* Profile */}
        <Route path="profile" element={<Profile />} />

        {/* Settings (Admin only) */}
        <Route
          path="settings"
          element={
            <AdminRoute>
              <Settings />
            </AdminRoute>
          }
        />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;
