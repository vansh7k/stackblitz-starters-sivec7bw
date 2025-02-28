const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./db/connectDB');

const app = express();
const PORT = 5000;


connectDB();

app.use(express.json());

app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

    
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        
        await newUser.save();

        res.status(201).json({ message: "User registered successfully",user:newUser });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
