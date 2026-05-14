const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

console.log("User Model:", User);

// REGISTER
router.post("/register", async (req, res) => {
    try {
            console.log("Incoming Data:", req.body);

        const { name, phone, email, password, role } = req.body;

        const existing = await User.findOne({ email });
        if (existing) {
            return res.json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            phone,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();

        res.json({ message: "Registered Successfully" });

    } catch (err) {
        res.status(500).json({ message: "Error in registration" });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ message: "Wrong password" });

        res.json({
            message: "Login Successful",
            user
        });

    } catch (err) {
        res.status(500).json({ message: "Login error" });
    }
});



module.exports = router;