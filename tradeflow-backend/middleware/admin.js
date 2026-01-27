import express from 'express';
import { verifyAdmin } from '../middleware/roles.js';
import { verifyToken } from '../middleware/auth.js';
// ... other imports

const router = express.Router();

// Example Admin Route
// FIXED: Added verifyToken first
router.get('/all-users', verifyToken, verifyAdmin, async (req, res) => {
    // admin logic here...
});

export default router;