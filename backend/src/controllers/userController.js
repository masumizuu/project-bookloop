const initModels = require('../models');
const { getSequelizeInstance } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {authenticateUser} = require("../middleware/authMiddleware");

exports.getUsers = async (req, res) => {
    try {
        const sequelize = getSequelizeInstance();
        const models = await initModels(sequelize);
        const { User } = models;

        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const sequelize = getSequelizeInstance();
        const models = await initModels(sequelize);
        const { User } = models;

        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve user' });
    }
};

exports.registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password, user_type } = req.body;

        const sequelize = getSequelizeInstance();
        const models = await initModels(sequelize);
        const { User } = models;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            user_type: user_type || 'USER'
        });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const sequelize = getSequelizeInstance();
        const models = await initModels(sequelize);
        const { User } = models;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { user_id: user.user_id, user_type: user.user_type },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Remove sensitive fields like password
        const { password: _, ...safeUser } = user.get({ plain: true });

        res.json({
            message: 'Login successful',
            token,
            user: safeUser
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to login user' });
    }
};

// Get Current User
exports.getCurrentUser = async (req, res) => {
    try {
        const decoded = authenticateUser(req);
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

        const sequelize = getSequelizeInstance();
        const models = await initModels(sequelize);
        const { User } = models;

        const user = await User.findByPk(decoded.user_id, {
            attributes: { exclude: ['password'] } // Exclude password from response
        });

        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    } catch (error) {
        console.error("Error fetching current user:", error);
        res.status(500).json({ error: "Failed to retrieve current user" });
    }
};
