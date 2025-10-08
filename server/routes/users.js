const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Department = require('../models/Department');
const Leave = require('../models/Leave');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private
router.get('/', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, department, role, search } = req.query;
    const query = {};

    if (department) query.department = department;
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .populate('department', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    // Check if user can access this profile
    if (req.user.role !== 'admin' && req.user.role !== 'hr' && req.params.id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('department', 'name');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Admin only or own profile)
router.put('/:id', auth, [
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('email').optional().isEmail().withMessage('Please enter a valid email'),
  body('phone').optional().notEmpty().withMessage('Phone cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user can update this profile
    if (req.user.role !== 'admin' && req.user.role !== 'hr' && req.params.id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      role,
      leaveBalance,
      isActive
    } = req.body;

    const updateFields = {};

    // Non-admin users can only update limited fields
    if (req.user.role === 'admin' || req.user.role === 'hr') {
      if (firstName) updateFields.firstName = firstName;
      if (lastName) updateFields.lastName = lastName;
      if (email) updateFields.email = email;
      if (phone) updateFields.phone = phone;
      if (position) updateFields.position = position;
      if (department) updateFields.department = department;
      if (role) updateFields.role = role;
      if (leaveBalance) updateFields.leaveBalance = leaveBalance;
      if (typeof isActive === 'boolean') updateFields.isActive = isActive;
    } else {
      // Regular users can only update basic info
      if (firstName) updateFields.firstName = firstName;
      if (lastName) updateFields.lastName = lastName;
      if (phone) updateFields.phone = phone;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password').populate('department', 'name');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error during user update' });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Private
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has pending leaves
    const activeLeaves = await Leave.find({
      employee: req.params.id,
      status: { $in: ['pending', 'approved'] },
      endDate: { $gte: new Date() } 
    });

    if (activeLeaves.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot deactivate user with active or future approved leave requests. Please cancel or reject them first.' 
      });
    }
    // Soft delete - deactivate user
    user.isActive = false;
    await user.save();

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error during user deletion' });
  }
});

// @route   GET /api/users/:id/leaves
// @desc    Get leaves for a specific user
// @access  Private
router.get('/:id/leaves', auth, async (req, res) => {
  try {
    // Check if user can access this data
    if (req.user.role !== 'admin' && req.user.role !== 'hr' && req.params.id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { page = 1, limit = 10, year } = req.query;
    const query = { employee: req.params.id };

    if (year) {
      const startOfYear = new Date(year, 0, 1);
      const endOfYear = new Date(year, 11, 31);
      query.appliedDate = { $gte: startOfYear, $lte: endOfYear };
    }

    const leaves = await Leave.find(query)
      .populate('approvedBy', 'firstName lastName employeeId')
      .sort({ appliedDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Leave.countDocuments(query);

    res.json({
      leaves,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get user leaves error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/stats/overview
// @desc    Get user statistics overview (Admin only)
// @access  Private
router.get('/stats/overview', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: { $in: ['admin', 'hr'] } });
    const employeeUsers = await User.countDocuments({ role: 'employee' });

    const departmentStats = await User.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'departments',
          localField: '_id',
          foreignField: '_id',
          as: 'department'
        }
      },
      {
        $unwind: '$department'
      },
      {
        $project: {
          departmentName: '$department.name',
          count: 1
        }
      }
    ]);

    const pendingLeaves = await Leave.countDocuments({ status: 'pending' });
    const approvedLeaves = await Leave.countDocuments({ status: 'approved' });
    const rejectedLeaves = await Leave.countDocuments({ status: 'rejected' });

    res.json({
      userStats: {
        totalUsers,
        activeUsers,
        adminUsers,
        employeeUsers
      },
      departmentStats,
      leaveStats: {
        pendingLeaves,
        approvedLeaves,
        rejectedLeaves
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
