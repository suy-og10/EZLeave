const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './config.env' });

const User = require('./models/User');
const Department = require('./models/Department');
const Leave = require('./models/Leave');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/EZLeave');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Department.deleteMany({});
    await Leave.deleteMany({});
    console.log('Cleared existing data');

    // Create departments
    const departments = await Department.insertMany([
      {
        name: 'Human Resources',
        description: 'Manages employee relations, recruitment, and HR policies',
      },
      {
        name: 'Information Technology',
        description: 'Handles software development, IT infrastructure, and technical support',
      },
      {
        name: 'Marketing',
        description: 'Responsible for brand promotion, campaigns, and market research',
      },
      {
        name: 'Finance',
        description: 'Manages financial planning, accounting, and budgeting',
      },
      {
        name: 'Operations',
        description: 'Oversees daily business operations and process improvement',
      },
    ]);
    console.log('Created departments');

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = await User.insertMany([
      {
        employeeId: 'EMP001',
        firstName: 'John',
        lastName: 'Admin',
        email: 'admin@EZLeave.com',
        password: hashedPassword,
        role: 'admin',
        department: departments[0]._id,
        position: 'HR Manager',
        phone: '+1 (555) 123-4567',
        dateOfJoining: new Date('2020-01-15'),
        leaveBalance: { sick: 12, vacation: 21, personal: 5 },
      },
      {
        employeeId: 'EMP002',
        firstName: 'Sarah',
        lastName: 'HR',
        email: 'hr@EZLeave.com',
        password: hashedPassword,
        role: 'hr',
        department: departments[0]._id,
        position: 'HR Specialist',
        phone: '+1 (555) 123-4568',
        dateOfJoining: new Date('2021-03-20'),
        leaveBalance: { sick: 12, vacation: 21, personal: 5 },
      },
      {
        employeeId: 'EMP003',
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'employee@EZLeave.com',
        password: hashedPassword,
        role: 'employee',
        department: departments[1]._id,
        position: 'Software Developer',
        phone: '+1 (555) 123-4569',
        dateOfJoining: new Date('2022-06-10'),
        leaveBalance: { sick: 12, vacation: 21, personal: 5 },
      },
      {
        employeeId: 'EMP004',
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'emily.davis@EZLeave.com',
        password: hashedPassword,
        role: 'employee',
        department: departments[2]._id,
        position: 'Marketing Coordinator',
        phone: '+1 (555) 123-4570',
        dateOfJoining: new Date('2022-08-15'),
        leaveBalance: { sick: 12, vacation: 21, personal: 5 },
      },
      {
        employeeId: 'EMP005',
        firstName: 'David',
        lastName: 'Wilson',
        email: 'david.wilson@EZLeave.com',
        password: hashedPassword,
        role: 'employee',
        department: departments[3]._id,
        position: 'Financial Analyst',
        phone: '+1 (555) 123-4571',
        dateOfJoining: new Date('2021-11-05'),
        leaveBalance: { sick: 12, vacation: 21, personal: 5 },
      },
      {
        employeeId: 'EMP006',
        firstName: 'Lisa',
        lastName: 'Brown',
        email: 'lisa.brown@EZLeave.com',
        password: hashedPassword,
        role: 'employee',
        department: departments[4]._id,
        position: 'Operations Manager',
        phone: '+1 (555) 123-4572',
        dateOfJoining: new Date('2020-09-12'),
        leaveBalance: { sick: 12, vacation: 21, personal: 5 },
      },
    ]);
    console.log('Created users');

    // Update department heads
    departments[0].head = users[0]._id; // HR Manager as head of HR
    departments[1].head = users[2]._id; // Software Developer as head of IT
    departments[2].head = users[3]._id; // Marketing Coordinator as head of Marketing
    departments[3].head = users[4]._id; // Financial Analyst as head of Finance
    departments[4].head = users[5]._id; // Operations Manager as head of Operations

    await Promise.all(departments.map(dept => dept.save()));
    console.log('Updated department heads');

    // Create sample leave requests
    const leaveRequests = await Leave.insertMany([
      {
        employee: users[2]._id, // Mike Johnson
        leaveType: 'vacation',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-19'),
        totalDays: 5,
        reason: 'Family vacation to Hawaii',
        status: 'approved',
        appliedDate: new Date('2023-12-20'),
        approvedBy: users[0]._id,
        approvedDate: new Date('2023-12-21'),
      },
      {
        employee: users[3]._id, // Emily Davis
        leaveType: 'sick',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-02-01'),
        totalDays: 1,
        reason: 'Fever and flu symptoms',
        status: 'approved',
        appliedDate: new Date('2024-01-31'),
        approvedBy: users[1]._id,
        approvedDate: new Date('2024-01-31'),
      },
      {
        employee: users[4]._id, // David Wilson
        leaveType: 'personal',
        startDate: new Date('2024-02-10'),
        endDate: new Date('2024-02-12'),
        totalDays: 3,
        reason: 'Personal matters to attend to',
        status: 'pending',
        appliedDate: new Date('2024-01-25'),
      },
      {
        employee: users[5]._id, // Lisa Brown
        leaveType: 'maternity',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-06-01'),
        totalDays: 90,
        reason: 'Maternity leave for childbirth',
        status: 'approved',
        appliedDate: new Date('2024-01-15'),
        approvedBy: users[0]._id,
        approvedDate: new Date('2024-01-16'),
      },
      {
        employee: users[2]._id, // Mike Johnson
        leaveType: 'emergency',
        startDate: new Date('2024-02-05'),
        endDate: new Date('2024-02-05'),
        totalDays: 1,
        reason: 'Medical emergency for family member',
        status: 'rejected',
        appliedDate: new Date('2024-02-04'),
        approvedBy: users[1]._id,
        approvedDate: new Date('2024-02-04'),
        rejectionReason: 'Insufficient documentation provided',
      },
    ]);
    console.log('Created leave requests');

    // Update leave balances for approved leaves
    users[2].leaveBalance.vacation -= 5; // Mike's vacation leave
    users[3].leaveBalance.sick -= 1; // Emily's sick leave
    users[5].leaveBalance.maternity = Math.max(0, users[5].leaveBalance.maternity - 90); // Lisa's maternity leave

    await Promise.all([users[2].save(), users[3].save(), users[5].save()]);
    console.log('Updated leave balances');

    console.log('✅ Seed data created successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('Admin: admin@EZLeave.com / password123');
    console.log('HR: hr@EZLeave.com / password123');
    console.log('Employee: employee@EZLeave.com / password123');
    console.log('Other Employees: emily.davis@EZLeave.com, david.wilson@EZLeave.com, lisa.brown@EZLeave.com / password123');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seed function
seedData();
