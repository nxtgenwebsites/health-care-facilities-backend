import userModel from "../models/userSchama.js";
import nodemailer from "nodemailer"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';


const addUser = async (req, res) => {
    try {
        const { name, last_name, email, password, role } = req.body;

        if (!name || !last_name || !email || !password || !role) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists" });
        }

        // Hash the password before saving
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user instance with hashed password
        const newUser = new userModel({
            name,
            last_name,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email, role: newUser.role },
            'healthcare',
            { expiresIn: '30d' }
        );

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                last_name: newUser.last_name,
                email: newUser.email,
                role: newUser.role
            },
            token
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log(error);
    }
};


const editUser = async (req, res) => {
    try {
        const { id } = req.headers;

        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ error: "New password is required" });
        }

        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Update the user password in the database
        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


// Delete a user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.headers;

        const deletedUser = await userModel.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log(error);
    }
};

// Get a single user
const getUser = async (req, res) => {
    try {
        // Extract user ID from JWT (added by authenticateToken middleware)
        const {id} = req.headers;

        const user = await userModel.findById(id).select('-password'); // Exclude password

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log(error);
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log(error);
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found." });
        }

        // Compare hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Wrong password." });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            'healthcare',
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                last_name: user.last_name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const sendLoginDetails = async (req, res) => {
    const { name, email, password } = req.body

    const token = jwt.sign({ email }, 'healthcare', { expiresIn: '30d' });

    const loginLink = `https://health-care-facilities.vercel.app/login.html?token=${token}`;

    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: "shahbazansari8199@gmail.com",
            pass: 'nyaj zfxg ktjr iztq'
        },
    })
    const info = await transporter.sendMail({
        from: 'shahbazansari8199@gmail.com',
        to: `${email}`,
        subject: `Welcome to Health Monitor System`,
        text: `Dear ${name},

Welcome to the Health Monitor System!

We are excited to have you onboard. Below are your login details to get started with your account:
Login Link:     ${loginLink}
Email Address: ${email}
Password:         ${password}

If you encounter any issues or have questions regarding your account, don’t hesitate to contact our support team at [support@nxtgenwebsites.com].

We look forward to helping you monitor and manage your user role effectively.

Best regards,  
The Health Monitor Team`,
    })

    console.log("Message send:%s", info.messageId);
    console.log(req.body.email);
    res.send(info)
}

const passwordDetails = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log(email);

        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: "shahbazansari8199@gmail.com", // Your email
                pass: "nyaj zfxg ktjr iztq", // Your email app password
            },
        });

        const mailOptions = {
            from: "shahbazansari8199@gmail.com",
            to: email,
            subject: "Your Updated Password for Health Monitor System",
            text: `Dear ${name},

We wanted to inform you that your password has been successfully changed by the admin.

To access your account, please use the following login details:
Login Link:   https://health-care-facilities.vercel.app/login.html
Email Address: ${email}
Password:         ${password}

If you encounter any issues or have questions regarding your account, don’t hesitate to contact our support team at support@nxtgenwebsites.com.

We look forward to helping you monitor and manage your user role effectively.

Best regards,  
The Health Monitor Team`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);

        res.status(200).json({ success: true, message: "Email sent successfully", messageId: info.messageId });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
};


export { addUser, editUser, deleteUser, getUser, getAllUsers, loginUser, sendLoginDetails, passwordDetails };