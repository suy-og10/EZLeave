const express = require('express');
const { body, validationResult } = require('express-validator');
const Department = require('../models/Department');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/departments
// @desc    Get all departments
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true })
      .populate('head', 'firstName lastName employeeId')
      .sort({ name: 1 });

    res.json(departments);
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/departments/:id
// @desc    Get department by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('head', 'firstName lastName employeeId email');

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json(department);
  } catch (error) {
    console.error('Get department error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/departments
// @desc    Create a new department
// @access  Private (Admin only)
router.post('/', adminAuth, [
  body('name').notEmpty().withMessage('Department name is required'),
  body('description').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, head } = req.body;

    // Check if department already exists
    const existingDepartment = await Department.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (existingDepartment) {
      return res.status(400).json({ message: 'Department already exists' });
    }

    // Validate head if provided
    if (head) {
      const headUser = await User.findById(head);
      if (!headUser) {
        return res.status(400).json({ message: 'Head user not found' });
      }
    }

    const department = new Department({
      name,
      description,
      head
    });

    await department.save();
    await department.populate('head', 'firstName lastName employeeId');

    res.status(201).json(department);
  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({ message: 'Server error during department creation' });
  }
});

// @route   PUT /api/departments/:id
// @desc    Update department
// @access  Private (Admin only)
router.put('/:id', adminAuth, [
  body('name').optional().notEmpty().withMessage('Department name cannot be empty'),
  body('description').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, head } = req.body;

    // Check if department exists
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Check if name already exists (excluding current department)
    if (name && name !== department.name) {
      const existingDepartment = await Department.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: req.params.id }
      });

      if (existingDepartment) {
        return res.status(400).json({ message: 'Department name already exists' });
      }
    }

    // Validate head if provided
    if (head) {
      const headUser = await User.findById(head);
      if (!headUser) {
        return res.status(400).json({ message: 'Head user not found' });
      }
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (description !== undefined) updateFields.description = description;
    if (head !== undefined) updateFields.head = head;

    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).populate('head', 'firstName lastName employeeId');

    res.json(updatedDepartment);
  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({ message: 'Server error during department update' });
  }
});

// @route   DELETE /api/departments/:id
// @desc    Delete department
// @access  Private (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Check if department has users
    const userCount = await User.countDocuments({ department: req.params.id });
    if (userCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete department with existing users' 
      });
    }

    // Soft delete - deactivate department
    department.isActive = false;
    await department.save();

    res.json({ message: 'Department deactivated successfully' });
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({ message: 'Server error during department deletion' });
  }
});

// @route   GET /api/departments/:id/users
// @desc    Get users in a department
// @access  Private
router.get('/:id/users', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const users = await User.find({ department: req.params.id, isActive: true })
      .select('-password')
      .populate('department', 'name')
      .sort({ firstName: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments({ department: req.params.id, isActive: true });

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get department users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/departments/:id/stats
// @desc    Get department statistics
// @access  Private
router.get('/:id/stats', auth, async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const userCount = await User.countDocuments({ department: req.params.id, isActive: true });
    
    const leaveStats = await User.aggregate([
      { $match: { department: department._id, isActive: true } },
      {
        $lookup: {
          from: 'leaves',
          localField: '_id',
          foreignField: 'employee',
          as: 'leaves'
        }
      },
      {
        $project: {
          totalLeaves: { $size: '$leaves' },
          pendingLeaves: {
            $size: {
              $filter: {
                input: '$leaves',
                cond: { $eq: ['$$this.status', 'pending'] }
              }
            }
          },
          approvedLeaves: {
            $size: {
              $filter: {
                input: '$leaves',
                cond: { $eq: ['$$this.status', 'approved'] }
              }
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          totalLeaves: { $sum: '$totalLeaves' },
          pendingLeaves: { $sum: '$pendingLeaves' },
          approvedLeaves: { $sum: '$approvedLeaves' }
        }
      }
    ]);

    res.json({
      department: department.name,
      userCount,
      leaveStats: leaveStats[0] || {
        totalLeaves: 0,
        pendingLeaves: 0,
        approvedLeaves: 0
      }
    });
  } catch (error) {
    console.error('Get department stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
