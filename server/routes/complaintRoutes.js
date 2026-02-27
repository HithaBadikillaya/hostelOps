const express = require('express');
const router = express.Router();
const {
    createComplaint,
    getComplaints,
    updateComplaint,
    deleteComplaint,
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/')
    .post(authorize('student', 'admin'), createComplaint)
    .get(getComplaints); // Filtering logic is inside controller

router.route('/:id')
    .patch(authorize('student', 'admin'), updateComplaint)
    .delete(authorize('student', 'admin'), deleteComplaint);

module.exports = router;
