const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'techprep_ai_super_secret_jwt_key_2026_production', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role,
      profilePic,
      contact,
      dob,
      address,
      college,
      degree,
      branch,
      specialization,
      gradYear,
      cgpa,
      marks10,
      marks12,
      skills,
      leetcode,
      github,
      linkedin,
      portfolio
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const userExists = await User.findOne({ email: cleanEmail });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    const user = await User.create({
      name: name || 'Student',
      email: cleanEmail,
      password,
      role: role || (cleanEmail === 'khushboo2006june@admin.com' ? 'admin' : 'student'),
      profilePic: profilePic || '',
      contact: contact || '',
      dob: dob || '',
      address: address || '',
      college: college || '',
      degree: degree || '',
      branch: branch || '',
      specialization: specialization || '',
      gradYear: gradYear || '',
      cgpa: cgpa || '',
      marks10: marks10 || '',
      marks12: marks12 || '',
      skills: skills || '',
      leetcode: leetcode || '',
      github: github || '',
      linkedin: linkedin || '',
      portfolio: portfolio || ''
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
        contact: user.contact,
        dob: user.dob,
        address: user.address,
        college: user.college,
        degree: user.degree,
        branch: user.branch,
        specialization: user.specialization,
        gradYear: user.gradYear,
        cgpa: user.cgpa,
        marks10: user.marks10,
        marks12: user.marks12,
        skills: user.skills,
        leetcode: user.leetcode,
        github: user.github,
        linkedin: user.linkedin,
        portfolio: user.portfolio,
        suspended: user.suspended,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      // Special default admin fallback creation if not yet seeded
      if (cleanEmail === 'khushboo2006june@admin.com' && password === 'khushboo') {
        const adminUser = await User.create({
          name: 'Khushboo (Admin)',
          email: 'khushboo2006june@admin.com',
          password: 'khushboo',
          role: 'admin',
          college: 'Admin Suite',
          branch: 'Operations',
          cgpa: '10.0'
        });
        const token = generateToken(adminUser._id);
        return res.status(200).json({
          success: true,
          token,
          user: adminUser
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if account suspended
    if (user.suspended) {
      return res.status(403).json({ success: false, message: 'Account is suspended by administrator' });
    }

    // Check password
    let isMatch = await user.matchPassword(password);

    // Special admin password fallback & auto-sync
    if (!isMatch && cleanEmail === 'khushboo2006june@admin.com' && password === 'khushboo') {
      user.password = 'khushboo';
      await user.save();
      isMatch = true;
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
        contact: user.contact,
        dob: user.dob,
        address: user.address,
        college: user.college,
        degree: user.degree,
        branch: user.branch,
        specialization: user.specialization,
        gradYear: user.gradYear,
        cgpa: user.cgpa,
        marks10: user.marks10,
        marks12: user.marks12,
        skills: user.skills,
        leetcode: user.leetcode,
        github: user.github,
        linkedin: user.linkedin,
        portfolio: user.portfolio,
        suspended: user.suspended,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Public / Token Protected
exports.getMe = async (req, res, next) => {
  try {
    const email = req.query.email || (req.user ? req.user.email : null);
    if (!email) {
      return res.status(400).json({ success: false, message: 'User email required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Public / Protected
exports.updateProfile = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required to update profile' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const updateData = { ...req.body };
    delete updateData.password; // Handle password updates separately if needed
    delete updateData.email;

    const user = await User.findOneAndUpdate(
      { email: cleanEmail },
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered users (Admin only)
// @route   GET /api/auth/users
// @access  Public (with optional role check)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user suspension (Admin only)
// @route   PUT /api/auth/users/:id/toggle-suspend
// @access  Public / Admin
exports.toggleSuspend = async (req, res, next) => {
  try {
    const { id } = req.params;
    let user;

    if (id.includes('@')) {
      user = await User.findOne({ email: id.toLowerCase() });
    } else {
      user = await User.findById(id);
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.suspended = !user.suspended;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account has been ${user.suspended ? 'suspended' : 'activated'}`,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset user password (Admin)
// @route   PUT /api/auth/users/:id/reset-password
// @access  Public / Admin
exports.resetPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    let user;
    if (id.includes('@')) {
      user = await User.findOne({ email: id.toLowerCase() });
    } else {
      user = await User.findById(id);
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
};
