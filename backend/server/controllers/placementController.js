const Placement = require('../models/Placement');

// @desc    Get placement drives (Master drives or user-specific)
// @route   GET /api/placements
// @access  Public
exports.getPlacements = async (req, res, next) => {
  try {
    const { email } = req.query;

    let query = {};
    if (email) {
      // Return drives that are master (studentEmail is null) or specific to this student
      query = {
        $or: [
          { studentEmail: null },
          { studentEmail: email.toLowerCase() }
        ]
      };
    }

    const placements = await Placement.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: placements.length, placements });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user-specific placement drives
// @route   GET /api/placements/user/:email
// @access  Public
exports.getUserPlacements = async (req, res, next) => {
  try {
    const { email } = req.params;
    const cleanEmail = email.toLowerCase();

    // Check if user has specific placement records; if none, fetch master drives
    let userDrives = await Placement.find({ studentEmail: cleanEmail }).sort({ createdAt: -1 });

    if (userDrives.length === 0) {
      // Duplicate master drives for this student if not initialized
      const masterDrives = await Placement.find({ studentEmail: null });
      if (masterDrives.length > 0) {
        const seededUserDrives = masterDrives.map(d => ({
          customId: `${d.customId || d._id}_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
          company: d.company,
          role: d.role,
          package: d.package,
          deadline: d.deadline,
          interviewDate: d.interviewDate,
          eligibility: d.eligibility,
          location: d.location,
          status: 'wishlist',
          link: d.link,
          notes: d.notes,
          studentEmail: cleanEmail,
          appliedDate: null,
          statusUpdatedAt: new Date()
        }));

        userDrives = await Placement.insertMany(seededUserDrives);
      }
    }

    res.status(200).json({ success: true, count: userDrives.length, placements: userDrives });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new placement drive
// @route   POST /api/placements
// @access  Public / Admin
exports.createPlacement = async (req, res, next) => {
  try {
    const {
      id,
      customId,
      company,
      role,
      package: pkg,
      deadline,
      interviewDate,
      eligibility,
      location,
      status,
      link,
      notes,
      studentEmail
    } = req.body;

    if (!company || !role) {
      return res.status(400).json({ success: false, message: 'Company and role are required' });
    }

    const newId = customId || id || `drive-${Date.now()}`;

    const drive = await Placement.create({
      customId: newId,
      company,
      role,
      package: pkg || '0.0',
      deadline: deadline || '',
      interviewDate: interviewDate || '',
      eligibility: eligibility || '',
      location: location || '',
      status: status || 'wishlist',
      link: link || '',
      notes: notes || '',
      studentEmail: studentEmail ? studentEmail.toLowerCase() : null,
      appliedDate: status === 'applied' ? new Date().toISOString().split('T')[0] : null,
      statusUpdatedAt: new Date()
    });

    res.status(201).json({ success: true, message: 'Placement drive created', placement: drive });
  } catch (error) {
    next(error);
  }
};

// @desc    Update placement drive (stage, dates, notes, etc.)
// @route   PUT /api/placements/:id
// @access  Public
exports.updatePlacement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.status && updateData.status === 'applied' && !updateData.appliedDate) {
      updateData.appliedDate = new Date().toISOString().split('T')[0];
    }
    updateData.statusUpdatedAt = new Date();

    let placement = await Placement.findOneAndUpdate(
      { customId: id },
      { $set: updateData },
      { new: true }
    );

    if (!placement && id.match(/^[0-9a-fA-F]{24}$/)) {
      placement = await Placement.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    }

    if (!placement) {
      return res.status(404).json({ success: false, message: 'Placement drive not found' });
    }

    res.status(200).json({ success: true, message: 'Placement drive updated', placement });
  } catch (error) {
    next(error);
  }
};

// @desc    Update placement status stage (Kanban drop / apply)
// @route   PATCH /api/placements/:id/status
// @access  Public
exports.updatePlacementStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, studentEmail } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    let query = { customId: id };
    if (studentEmail) {
      query = {
        $or: [
          { customId: id, studentEmail: studentEmail.toLowerCase() },
          { customId: id }
        ]
      };
    }

    let update = {
      status,
      statusUpdatedAt: new Date()
    };

    if (status === 'applied') {
      update.appliedDate = new Date().toISOString().split('T')[0];
    }

    let placement = await Placement.findOneAndUpdate(query, { $set: update }, { new: true });

    if (!placement && id.match(/^[0-9a-fA-F]{24}$/)) {
      placement = await Placement.findByIdAndUpdate(id, { $set: update }, { new: true });
    }

    if (!placement) {
      return res.status(404).json({ success: false, message: 'Placement drive not found' });
    }

    res.status(200).json({ success: true, message: `Status updated to ${status}`, placement });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete placement drive
// @route   DELETE /api/placements/:id
// @access  Public
exports.deletePlacement = async (req, res, next) => {
  try {
    const { id } = req.params;
    let placement = await Placement.findOneAndDelete({ customId: id });
    if (!placement && id.match(/^[0-9a-fA-F]{24}$/)) {
      placement = await Placement.findByIdAndDelete(id);
    }

    if (!placement) {
      return res.status(404).json({ success: false, message: 'Placement drive not found' });
    }

    res.status(200).json({ success: true, message: 'Placement drive deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk sync user placements
// @route   POST /api/placements/sync
// @access  Public
exports.syncUserPlacements = async (req, res, next) => {
  try {
    const { email, placements } = req.body;
    if (!email || !Array.isArray(placements)) {
      return res.status(400).json({ success: false, message: 'Invalid sync payload' });
    }

    const cleanEmail = email.toLowerCase();
    await Placement.deleteMany({ studentEmail: cleanEmail });

    const formatted = placements.map(p => ({
      customId: p.id || p.customId || `drive-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      company: p.company || 'Company',
      role: p.role || 'Software Engineer',
      package: p.package || '0.0',
      deadline: p.deadline || '',
      interviewDate: p.interviewDate || '',
      eligibility: p.eligibility || '',
      location: p.location || '',
      status: p.status || 'wishlist',
      link: p.link || '',
      notes: p.notes || '',
      isArchived: Boolean(p.isArchived),
      studentEmail: cleanEmail,
      appliedDate: p.appliedDate || null,
      statusUpdatedAt: p.statusUpdatedAt || new Date()
    }));

    const inserted = await Placement.insertMany(formatted);
    res.status(200).json({ success: true, count: inserted.length, placements: inserted });
  } catch (error) {
    next(error);
  }
};
