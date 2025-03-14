const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { authenticateUser, requireAdmin } = require('../middleware/authMiddleware');

router.use(authenticateUser, requireAdmin); // Protect all admin routes

router.post('/books', bookController.addBook);
router.put('/books/:id', bookController.updateBook);
router.delete('/books/:id', bookController.deleteBook);
// router.get('/book-requests', bookController.getBookRequests);
router.put('/book-requests/:id/approve', bookController.approveBookRequest);
router.put('/book-requests/:id/deny', bookController.denyBookRequest);

router.get('/book-requests/all', bookController.getAllBookRequests);

// Require admin to provide a denial reason when denying a borrow request
router.put('/book-requests/:id/deny', async (req, res, next) => {
    if (!req.body.denial_reason) {
        return res.status(400).json({ error: 'Denial reason is required' });
    }
    next();
}, bookController.denyBookRequest);

module.exports = router;