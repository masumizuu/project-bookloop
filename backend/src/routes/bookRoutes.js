const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const {authenticateUser} = require("../middleware/authMiddleware");

router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBookById);
router.post('/', bookController.addBook);
router.get('/owned/:owner_id', bookController.getBooksByOwner);

// Borrow request route (Users must be authenticated)
router.post('/:id/request', authenticateUser, bookController.requestBorrowBook);

module.exports = router;
