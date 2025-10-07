const express = require('express');
const { body, validationResult } = require('express-validator');
const Leave = require('../models/Leave');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');
const moment = require('moment');

const router = express.Router();

// @route   POST /api/leaves
// @desc    Create a new leave request
// @access  Private
router.post('/', auth, [
  body('leaveType').notEmpty().withMessage('Leave type is required'),
  body('startDate').notEmpty().withMessage('Start date is required'),
  body('endDate').notEmpty().withMessage('End date is required'),
  body('reason').notEmpty().withMessage('Reason is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { leaveType, startDate, endDate, reason } = req.body;

    // Validate dates
    const start = moment(startDate);
    const end = moment(endDate);
    
    if (!start.isValid() || !end.isValid()) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    if (start.isBefore(moment(), 'day')) {
      return res.status(400).json({ message: 'Cannot apply for leave in the past' });
    }

    if (end.isBefore(start)) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    // Calculate total days
    const totalDays = end.diff(start, 'days') + 1;

    // Check leave balance
    const user = await User.findById(req.user.id);
    const availableBalance = user.leaveBalance[leaveType];
    
    if (availableBalance < totalDays) {
      return res.status(400).json({ 
        message: `Insufficient leave balance. Available: ${availableBalance} days` 
      });
    }

    // Check for overlapping leaves
    const overlappingLeaves = await Leave.find({
      employee: req.user.id,
      status: { $in: ['pending', 'approved'] },
      $or: [
        {
          startDate: { $lte: end.toDate() },
          endDate: { $gte: start.toDate() }
        }
      ]
    });

    if (overlappingLeaves.length > 0) {
      return res.status(400).json({ message: 'You have overlapping leave requests' });
    }

    // Create leave request
    const leave = new Leave({
      employee: req.user.id,
      leaveType,
      startDate: start.toDate(),
      endDate: end.toDate(),
      totalDays,
      reason
    });

    await leave.save();
    await leave.populate('employee', 'firstName lastName employeeId email');

    res.status(201).json(leave);
  } catch (error) {
    console.error('Create leave error:', error);
    res.status(500).json({ message: 'Server error during leave creation' });
  }
});

// @route   GET /api/leaves
// @desc    Get all leaves for current user or all leaves for admin
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, leaveType } = req.query;
    const query = {};

    // If not admin, only show user's own leaves
    if (req.user.role !== 'admin' && req.user.role !== 'hr') {
      query.employee = req.user.id;
    }

    // Add filters
    if (status) query.status = status;
    if (leaveType) query.leaveType = leaveType;

    const leaves = await Leave.find(query)
      .populate('employee', 'firstName lastName employeeId email')
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
    console.error('Get leaves error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/leaves/:id
// @desc    Get leave by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate('employee', 'firstName lastName employeeId email department position')
      .populate('approvedBy', 'firstName lastName employeeId')
      .populate('comments.user', 'firstName lastName employeeId');

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Check if user can view this leave
    if (req.user.role !== 'admin' && req.user.role !== 'hr' && leave.employee._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(leave);
  } catch (error) {
    console.error('Get leave error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/leaves/:id/approve
// @desc    Approve a leave request
// @access  Private (Admin/HR only)
router.put('/:id/approve', adminAuth, async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id).populate('employee');

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({ message: 'Leave request is not pending' });
    }

    // Update leave status
    leave.status = 'approved';
    leave.approvedBy = req.user.id;
    leave.approvedDate = new Date();

    await leave.save();

    // Update user's leave balance
    const user = await User.findById(leave.employee._id);
    user.leaveBalance[leave.leaveType] -= leave.totalDays;
    await user.save();

    res.json(leave);
  } catch (error) {
    console.error('Approve leave error:', error);
    res.status(500).json({ message: 'Server error during leave approval' });
  }
});

// @route   PUT /api/leaves/:id/reject
// @desc    Reject a leave request
// @access  Private (Admin/HR only)
router.put('/:id/reject', adminAuth, [
  body('rejectionReason').notEmpty().withMessage('Rejection reason is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rejectionReason } = req.body;
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({ message: 'Leave request is not pending' });
    }

    // Update leave status
    leave.status = 'rejected';
    leave.approvedBy = req.user.id;
    leave.approvedDate = new Date();
    leave.rejectionReason = rejectionReason;

    await leave.save();

    res.json(leave);
  } catch (error) {
    console.error('Reject leave error:', error);
    res.status(500).json({ message: 'Server error during leave rejection' });
  }
});

// @route   PUT /api/leaves/:id/cancel
// @desc    Cancel a leave request
// @access  Private
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Check if user can cancel this leave
    if (req.user.role !== 'admin' && req.user.role !== 'hr' && leave.employee.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (leave.status === 'cancelled') {
      return res.status(400).json({ message: 'Leave request is already cancelled' });
    }

    if (leave.status === 'approved' && moment(leave.startDate).isBefore(moment(), 'day')) {
      return res.status(400).json({ message: 'Cannot cancel approved leave that has already started' });
    }

    // Update leave status
    leave.status = 'cancelled';

    // If leave was approved, restore leave balance
    if (leave.status === 'approved') {
      const user = await User.findById(leave.employee);
      user.leaveBalance[leave.leaveType] += leave.totalDays;
      await user.save();
    }

    await leave.save();

    res.json(leave);
  } catch (error) {
    console.error('Cancel leave error:', error);
    res.status(500).json({ message: 'Server error during leave cancellation' });
  }
});

// @route   POST /api/leaves/:id/comments
// @desc    Add comment to leave request
// @access  Private
router.post('/:id/comments', auth, [
  body('comment').notEmpty().withMessage('Comment is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { comment } = req.body;
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Check if user can comment on this leave
    if (req.user.role !== 'admin' && req.user.role !== 'hr' && leave.employee.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    leave.comments.push({
      user: req.user.id,
      comment
    });

    await leave.save();
    await leave.populate('comments.user', 'firstName lastName employeeId');

    res.json(leave);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error during comment addition' });
  }
});

// @route   GET /api/leaves/stats/summary
// @desc    Get leave statistics
// @access  Private
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    const startOfYear = moment(`${year}-01-01`).toDate();
    const endOfYear = moment(`${year}-12-31`).toDate();

    const matchQuery = {
      employee: req.user.role === 'admin' || req.user.role === 'hr' ? {} : req.user.id,
      appliedDate: { $gte: startOfYear, $lte: endOfYear }
    };

    const stats = await Leave.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalLeaves: { $sum: 1 },
          approvedLeaves: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
          pendingLeaves: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          rejectedLeaves: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
          totalDays: { $sum: '$totalDays' }
        }
      }
    ]);

    const leaveTypeStats = await Leave.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$leaveType',
          count: { $sum: 1 },
          totalDays: { $sum: '$totalDays' }
        }
      }
    ]);

    res.json({
      summary: stats[0] || {
        totalLeaves: 0,
        approvedLeaves: 0,
        pendingLeaves: 0,
        rejectedLeaves: 0,
        totalDays: 0
      },
      leaveTypeStats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
