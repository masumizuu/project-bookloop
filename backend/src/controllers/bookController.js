const initModels = require('../models');
const { getSequelizeInstance } = require('../config/db');
const { Op } = require('sequelize'); //Bryan's comment: import Op from sequelize


exports.getBooks = async (req, res) => {
    try {
        const sequelize = getSequelizeInstance();
        const models = await initModels(sequelize);
        const { Book } = models;

        const { page = 1, limit = 6, search = "", genre } = req.query;

        const offset = (page - 1) * limit;

        const whereCondition = {
            ...(search ? { title: { [Op.like]: `%${search}%` } } : {}), //Bryan's comment: instead of using sequelize.Op.like, just use Op.like
            ...(genre ? { genre } : {})  // Add this
        };

        const books = await Book.findAndCountAll({
            where: whereCondition,
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        res.json({
            total: books.count,
            totalPages: Math.ceil(books.count / limit),
            currentPage: parseInt(page),
            books: books.rows
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve books" });
    }
};

exports.getBookById = async (req, res) => {
    try {
        const sequelize = getSequelizeInstance();
        const models = await initModels(sequelize);
        const { Book } = models;

        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).json({ error: 'Book not found' });
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve book' });
    }
};

// admin methods //
exports.addBook = async (req, res) => {
    try {
        const sequelize = getSequelizeInstance();
        const models = await initModels(sequelize);
        const { Book } = models;

        const book = await Book.create(req.body);
        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add book' });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const sequelize = getSequelizeInstance();
        const models = await initModels(sequelize);
        const { Book } = models;

        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).json({ error: 'Book not found' });

        await book.update(req.body);
        res.json({ message: 'Book updated successfully', book });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update book' });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const sequelize = getSequelizeInstance();
        const models = await initModels(sequelize);
        const { Book } = models;

        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).json({ error: 'Book not found' });

        await book.destroy();
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete book' });
    }
};

exports.getBooksByOwner = async (req, res) => {
    try {
        const sequelize = getSequelizeInstance();
        const models = await initModels(sequelize);
        const { Book } = models;

        const { owner_id } = req.params;

        const books = await Book.findAll({
            where: {
                owner_id: owner_id
            }
        });

        res.json({ books });
    } catch (error) {
        console.error("Error fetching books by owner:", error);
        res.status(500).json({ error: "Failed to retrieve books by owner" });
    }
};

// last push

exports.requestBorrowBook = async (req, res) => {
    try {
        const sequelize = getSequelizeInstance();
        const models = await initModels(sequelize);
        const { Book, BorrowTransaction } = models;
        const { user_id } = req.user; // Get user from auth middleware

        const book = await Book.findByPk(req.params.id);
        if (!book || book.status !== 'Available') {
            return res.status(400).json({ error: 'Book is not available for borrowing' });
        }

        // Calculate return date (3 months from now)
        const returnDate = new Date();
        returnDate.setMonth(returnDate.getMonth() + 3);

        // Create borrow transaction with return_date
        await BorrowTransaction.create({
            user_id,
            book_id: book.book_id,
            status: 'Requested',
            return_date: returnDate // ✅ Default return date set here
        });

        // Update book status to 'Requested'
        await book.update({ status: 'Requested' });

        res.json({ message: 'Borrow request sent successfully' });
    } catch (error) {
        console.error("❌ Error requesting book:", error);
        res.status(500).json({ error: 'Failed to request book' });
    }
};

exports.approveBookRequest = async (req, res) => {
    try {
        const sequelize = getSequelizeInstance();
        const models = await initModels(sequelize);
        const { Book, BorrowTransaction } = models;

        const book = await Book.findByPk(req.params.id);
        if (!book || book.status !== 'Requested') {
            return res.status(400).json({ error: 'Book is not requested or does not exist' });
        }

        const borrowTransaction = await BorrowTransaction.findOne({
            where: { book_id: book.book_id, status: 'Requested' }
        });
        if (!borrowTransaction) return res.status(404).json({ error: 'Borrow request not found' });

        // Approve request and assign the book to the borrower
        await book.update({
            status: 'Borrowed',
            owner_id: borrowTransaction.user_id,
            borrowedCount: book.borrowedCount + 1
        });
        await borrowTransaction.update({ status: 'Approved' });

        res.json({ message: 'Book request approved and assigned to the borrower' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to approve book request' });
    }
};

exports.denyBookRequest = async (req, res) => {
    try {
        const sequelize = getSequelizeInstance();
        const models = await initModels(sequelize);
        const { Book, BorrowTransaction } = models;
        const { denial_reason } = req.body;

        const book = await Book.findByPk(req.params.id);
        if (!book || book.status !== 'Requested') {
            return res.status(400).json({ error: 'Book is not requested or does not exist' });
        }

        const borrowTransaction = await BorrowTransaction.findOne({
            where: { book_id: book.book_id, status: 'Requested' }
        });
        if (!borrowTransaction) return res.status(404).json({ error: 'Borrow request not found' });

        await book.update({ status: 'Available' });
        await borrowTransaction.update({ status: 'Denied', denial_reason });

        res.json({ message: 'Book request denied, status reset to Available' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to deny book request' });
    }
};

exports.getAllBookRequests = async (req, res) => {
    try {
        const sequelize = getSequelizeInstance();
        const models = await initModels(sequelize);
        const { BorrowTransaction, Book, User } = models;

        const requests = await BorrowTransaction.findAll({
            include: [
                { model: Book, attributes: ['title', 'status'] },
                { model: User, attributes: ['first_name', 'last_name', 'email'] }
            ],
            order: [['borrow_date', 'DESC']] // ✅ Use `borrow_date` instead
        });

        res.json(requests);
    } catch (error) {
        console.error("❌ Error fetching all borrow requests:", error);
        res.status(500).json({ error: 'Failed to retrieve all borrow requests' });
    }
};
