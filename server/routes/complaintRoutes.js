const express = require('express');
const router = express.Router();
const {
    createComplaint,
    getComplaints,
    updateComplaintStatus,
} = require('../controllers/complaintController');

// All routes are prefixed with /api/complaints
router.route('/')
    .post(createComplaint)
    .get(getComplaints);

router.patch('/:id/status', updateComplaintStatus);

module.exports = router;
