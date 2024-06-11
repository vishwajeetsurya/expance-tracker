const validator = require('validator'); // Fixed the typo
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Added missing jwt require
const asyncHandler = require("express-async-handler"); // Added missing asyncHandler require

exports.registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!validator.isEmail(email) || !validator.isStrongPassword(password)) {
        return res.status(400).json({ message: "Invalid email or password format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, { expiresIn: "7d" });
    res.cookie('user', token, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true }); // maxAge set to 7 days

    res.status(201).json({ message: "User registered successfully" });
});

// User login
exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!validator.isEmail(email) || !password) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY, { expiresIn: "1d" });
    res.cookie("user", token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true }); // maxAge set to 1 day

    res.status(200).json({ message: "User logged in successfully", result: user });
});
