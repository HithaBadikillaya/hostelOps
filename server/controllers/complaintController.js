const Complaint = require('../models/Complaint');

/**
 * @desc    Create new complaint
 * @route   POST /api/complaints
 * @access  Private (student + admin allowed as per request)
 */
const createComplaint = async (req, res, next) => {
    try {
        const { category, description, priority } = req.body;

        if (!category || !description) {
            res.status(400);
            return next(new Error('Please provide category and description'));
        }

        const complaint = await Complaint.create({
            createdBy: req.user._id,
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
 * @desc    Get complaints
 * @route   GET /api/complaints
 * @access  Private
 */
const getComplaints = async (req, res, next) => {
    try {
        let query = {};

        // If student, filter by their own complaints
        if (req.user.role === 'student') {
            query = { createdBy: req.user._id };
        }
        // If admin, no filter (return all)

        const complaints = await Complaint.find(query)
            .sort({ createdAt: -1 })
            .populate('createdBy', 'name email');

        res.status(200).json(complaints);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update complaint status
 * @route   PATCH /api/complaints/:id
 * @access  Private/Admin
 */
const updateComplaintStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const allowedStatuses = ['Pending', 'In Progress', 'Resolved'];

        if (!status || !allowedStatuses.includes(status)) {
            res.status(400);
            return next(new Error('Please provide a valid status'));
        }

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            res.status(404);
            return next(new Error('Complaint not found'));
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
