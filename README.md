# EZLeave - Employee Leave Management System

A comprehensive MERN stack application for managing employee leave requests, approvals, and tracking. Built with modern technologies and a beautiful, responsive user interface.

## 🚀 Features

### For Employees

- **Dashboard**: Overview of leave balance, recent requests, and quick actions
- **Apply Leave**: Submit leave requests with different types (sick, vacation, personal, etc.)
- **Leave History**: View all past and current leave requests with detailed status
- **Profile Management**: Update personal information and change password
- **Real-time Notifications**: Get notified about leave status changes

### For HR/Admin

- **Leave Approvals**: Review and approve/reject pending leave requests
- **Employee Management**: View and manage employee information
- **Department Management**: Organize employees by departments
- **Reports & Analytics**: Comprehensive reports with charts and statistics
- **System Settings**: Configure leave policies and system preferences

### Technical Features

- **Authentication & Authorization**: Secure JWT-based authentication with role-based access
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Real-time Updates**: Live data updates using React Query
- **Data Validation**: Comprehensive form validation on both client and server
- **Error Handling**: Graceful error handling with user-friendly messages
- **Modern UI/UX**: Clean, intuitive interface with smooth animations

## 🛠️ Tech Stack

### Backend

- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Moment.js** for date handling

### Frontend

- **React 18** with modern hooks
- **React Router** for navigation
- **React Query** for data fetching and caching
- **React Hook Form** for form management
- **Tailwind CSS** for styling
- **Headless UI** for accessible components
- **Recharts** for data visualization
- **React Hot Toast** for notifications

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Backend Setup

1. Navigate to the server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp config.env.example config.env
```

4. Update the `config.env` file with your MongoDB connection string and JWT secret:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/EZLeave
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d
```

5. Start the server:

```bash
# Development mode
npm run dev

# Production mode
npm start
```

### Frontend Setup

1. Navigate to the client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`

## 🌱 Seeding Sample Data

To populate the database with sample data (departments, users, and leave requests), run:

```bash
cd server
node seedData.js
```

This will create:

- 5 departments (HR, IT, Marketing, Finance, Operations)
- 6 users (1 admin, 1 HR, 4 employees)
- Sample leave requests with different statuses

### Demo Credentials

- **Admin**: admin@EZLeave.com / password123
- **HR**: hr@EZLeave.com / password123
- **Employee**: employee@EZLeave.com / password123

## 📱 Usage

### Getting Started

1. Start both the backend and frontend servers
2. Open your browser and navigate to `http://localhost:3000`
3. Use the demo credentials to log in
4. Explore different features based on your role

### Key Workflows

#### Employee Workflow

1. **Login** with employee credentials
2. **View Dashboard** to see leave balance and recent activity
3. **Apply for Leave** by clicking "Apply Leave" and filling the form
4. **Track Status** in the Leave History section
5. **Update Profile** in the Profile section

#### Admin/HR Workflow

1. **Login** with admin or HR credentials
2. **Review Pending Leaves** in the Leave Approvals section
3. **Approve/Reject** requests with comments
4. **Manage Employees** in the Employees section
5. **View Reports** for analytics and insights
6. **Configure Settings** for system preferences

## 🏗️ Project Structure

```
EZLeave/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts (Auth)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── App.js         # Main app component
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── seedData.js       # Database seeding script
│   ├── server.js         # Main server file
│   └── package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRE`: JWT token expiration time

### Leave Types

The system supports the following leave types:

- **Sick Leave**: For illness and medical appointments
- **Vacation Leave**: For holidays and personal time off
- **Personal Leave**: For personal matters
- **Maternity Leave**: For childbirth and maternity
- **Paternity Leave**: For new fathers
- **Emergency Leave**: For urgent personal situations

## 🚀 Deployment

### Backend Deployment

1. Set up a MongoDB Atlas cluster or use a cloud MongoDB service
2. Update the `MONGODB_URI` in your environment variables
3. Deploy to platforms like Heroku, Railway, or AWS
4. Set environment variables in your deployment platform

### Frontend Deployment

1. Build the React app: `npm run build`
2. Deploy the `build` folder to platforms like Netlify, Vercel, or AWS S3
3. Update API endpoints if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@EZLeave.com or create an issue in the repository.

## 🔮 Future Enhancements

- [ ] Email notifications for leave status changes
- [ ] Calendar integration for leave scheduling
- [ ] Mobile app development
- [ ] Advanced reporting with custom date ranges
- [ ] Integration with HR systems
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] File upload for leave documentation

---

**EZLeave** - Making employee leave management simple and efficient! 🎉
