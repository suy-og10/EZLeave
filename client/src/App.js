import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layout
import Layout from './components/Layout/Layout';

// Home Page
import Home from './pages/Home/Home';

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
  // Rely on the top-level App component to handle the isLoading state.
  const { isAuthenticated } = useAuth(); 

  // If we reach this point and are not authenticated, redirect to login.
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Admin Route Component (logic slightly adjusted for cleaner role access)
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // If not authenticated, the parent ProtectedRoute handles the redirect to /login,
    // but this redirect is kept as a safeguard if the route is accessed directly.
    return <Navigate to="/login" />;
  }
  
  // If authenticated but not an admin or HR, redirect to dashboard.
  if (user?.role !== 'admin' && user?.role !== 'hr') {
    // Note: Changed target to '/app/dashboard' for proper nested routing context
    return <Navigate to="/app/dashboard" replace />; 
  }

  return children;
};

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  // IMPORTANT: Show global loading screen while authentication is initializing.
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        // After loading, if authenticated, go to dashboard, otherwise show home
        element={isAuthenticated ? <Navigate to="/app/dashboard" replace /> : <Home />}
      />
      <Route
        path="/home"
        element={<Home />}
      />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/app/dashboard" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/app/dashboard" replace /> : <Register />}
      />

      {/* Protected Routes - All nested under /app */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
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

      {/* Catch all route - redirect to / (which handles auth redirect) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
