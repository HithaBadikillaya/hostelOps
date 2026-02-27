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
 * @desc    Update complaint
 * @route   PATCH /api/complaints/:id
 * @access  Private
 */
const updateComplaint = async (req, res, next) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            res.status(404);
            return next(new Error('Complaint not found'));
        }

        // Admin can update status
        if (req.user.role === 'admin') {
            if (req.body.status) {
                const allowedStatuses = ['Pending', 'In Progress', 'Resolved'];
                if (!allowedStatuses.includes(req.body.status)) {
                    res.status(400);
                    return next(new Error('Please provide a valid status'));
                }
                complaint.status = req.body.status;
            }
        } else {
            // Student can update their own pending complaints
            if (complaint.createdBy.toString() !== req.user._id.toString()) {
                res.status(403);
                return next(new Error('Not authorized to update this complaint'));
            }

            if (complaint.status !== 'Pending') {
                res.status(400);
                return next(new Error('Cannot update complaint after it has been processed'));
            }

            const { category, description, priority } = req.body;
            if (category) complaint.category = category;
            if (description) complaint.description = description;
            if (priority) complaint.priority = priority;
        }

        const updatedComplaint = await complaint.save();
        res.status(200).json(updatedComplaint);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete complaint
 * @route   DELETE /api/complaints/:id
 * @access  Private
 */
const deleteComplaint = async (req, res, next) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            res.status(404);
            return next(new Error('Complaint not found'));
        }

        // Admin can delete any
        // Student can delete their own if pending
        if (req.user.role !== 'admin') {
            if (complaint.createdBy.toString() !== req.user._id.toString()) {
                res.status(403);
                return next(new Error('Not authorized to delete this complaint'));
            }

            if (complaint.status !== 'Pending') {
                res.status(400);
                return next(new Error('Cannot delete complaint after it has been processed'));
            }
        }

        await complaint.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createComplaint,
    getComplaints,
    updateComplaint,
    deleteComplaint,
};
