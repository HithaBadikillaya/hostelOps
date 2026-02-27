const Complaint = require('../models/Complaint');

/**
 * @desc    Create new complaint
 * @route   POST /api/complaints
 * @access  Private (Assumes req.user is populated by auth middleware)
 */
const createComplaint = async (req, res, next) => {
    try {
        const { category, description, priority } = req.body;

        if (!category || !description) {
            res.status(400);
            throw new Error('Please add a category and description');
        }

        const complaint = await Complaint.create({
            user: req.user?._id || req.body.userId, // Fallback to body for now if no auth middleware
            category,
            description,
            priority,
        });

        res.status(201).json(complaint);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all complaints
 * @route   GET /api/complaints
 * @access  Private
 */
const getComplaints = async (req, res, next) => {
    try {
        const complaints = await Complaint.find({}).populate('user', 'name email');
        res.status(200).json(complaints);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update complaint status
 * @route   PATCH /api/complaints/:id/status
 * @access  Private/Admin
 */
const updateComplaintStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
            res.status(400);
            throw new Error('Invalid status');
        }

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            res.status(404);
            throw new Error('Complaint not found');
        }

        complaint.status = status;
        const updatedComplaint = await complaint.save();

        res.status(200).json(updatedComplaint);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createComplaint,
    getComplaints,
    updateComplaintStatus,
};
