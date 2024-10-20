const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); 
const UserController = require('../controllers/UserController'); 
const User = require('../database/models/User'); 

// GET all users
router.get('/users', async (req, res) => {
    try {
        const users = await UserController.getAllUsers(); 
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error accessing user data", error: error.toString() });
    }
});

// POST create a new user
router.post('/users', async (req, res) => {
    try {
        const newUser = await UserController.createUser(req.body); 
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: "Error creating user", error: error.toString() });
    }
});

// POST login user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        res.send('Login successful');
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Server error');
    }
});

// POST register (signup) user
router.post('/signup', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }

    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).send('User already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
