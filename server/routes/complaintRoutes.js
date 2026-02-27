const express = require('express');
const router = express.Router();
const {
    createComplaint,
    getComplaints,
    updateComplaintStatus,
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/')
    .post(authorize('student', 'admin'), createComplaint)
    .get(getComplaints); // Filtering logic is inside controller

router.route('/:id')
    .patch(authorize('admin'), updateComplaintStatus);

module.exports = router;
