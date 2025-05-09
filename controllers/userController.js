import userModel from "../models/userSchama.js";
import nodemailer from "nodemailer"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';

const addUser = async (req, res) => {
    try {
        const { name, last_name, email, password, role, country, state, city, phone } = req.body;

        if (!name || !last_name || !email || !password || !role || !country || !state || !city || !phone ) {
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
            role,
            country,
            state,
            city,
            phone
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
                country: newUser.country,
                state: newUser.state,
                city: newUser.city,
                phone: newUser.phone,
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
        const { password, name, last_name, role, country, state, city, phone } = req.body;

        // Prepare the fields to update
        const updateFields = {};

        // Check for password and hash it if present
        if (password) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            updateFields.password = hashedPassword;
        }

        if (name) updateFields.name = name;
        if (last_name) updateFields.last_name = last_name;
        if (role) updateFields.role = role;
        if (country) updateFields.country = country;
        if (state) updateFields.state = state;
        if (city) updateFields.city = city;
        if (phone) updateFields.phone = phone;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ error: "At least one field (password, firstName, lastName, or role) must be provided" });
        }

        // Update the user in the database
        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            updateFields,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.headers;

        // Find the user to delete
        const userToDelete = await userModel.findById(id);

        if (!userToDelete) {
            return res.status(404).json({ error: "User not found" });
        }

        // Prevent Super Admin from deleting an Admin
        if (userToDelete.role === "super admin") {
            return res.status(403).json({ error: "Super Admin cannot be deleted." });
        }

        // Proceed with deletion
        await userModel.findByIdAndDelete(id);

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log(error);
    }
};


// Get a single user
const getUser = async (req, res) => {
    try {

        const { id } = req.headers;

        const user = await userModel.findById(id).select('-password');

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
        const { email, password, role } = req.body; // Get role from request

        // Check if user exists
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found." });
        }

        if (user.isBlocked) {
            return res.status(403).json({ message: "Your account is banned by the admin." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Wrong password." });
        }

        if (user.role !== role) {
            return res.status(403).json({ message: "Incorrect role." });
        }

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


const blockUser = async (req, res) => {
    try {
        const { id } = req.headers;

        console.log(`id is ${id}`);
        
        if (!id) {
            return res.status(400).json({ message: "User ID is required in headers" });
        }

        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === "super admin") {
            return res.status(403).json({ message: "Cannot block a super admin" });
        }

        const updatedUser = await userModel.findByIdAndUpdate(id, { isBlocked: true }, { new: true });

        res.json({ message: "User blocked successfully", updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

const unblockUser = async (req, res) => {
    try {
        const { id } = req.headers;

        if (!id) {
            return res.status(400).json({ message: "User ID is required in headers" });
        }

        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === "super admin") {
            return res.status(403).json({ message: "Cannot modify a super admin" });
        }

        if (!user.isBlocked) {
            return res.status(400).json({ message: "User is not blocked" });
        }

        const updatedUser = await userModel.findByIdAndUpdate(id, { isBlocked: false }, { new: true });

        res.json({ message: "User unblocked successfully", updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};


const sendLoginDetails = async (req, res) => {
    const { name, email, password, role } = req.body

    const token = jwt.sign({ email }, 'healthcare', { expiresIn: '30d' });

    const loginLink = `https://globalcaregivers.healthcentreapp.com/login.html?token=${token}`;

    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: "nxtgenwebsites@gmail.com",
            pass: process.env.EMAIL_PASS
        },
    })
    const info = await transporter.sendMail({
        from: 'nxtgenwebsites@gmail.com',
        to: `${email}`,
        subject: `Welcome to Global Care Givers Database`,
        text: `Dear ${name},

Welcome to the Global Care Givers Database!

We are excited to have you onboard. Below are your login details to get started with your account:
Login Link:    https://globalcaregivers.healthcentreapp.com/login.html
Email Address: ${email}
Password:         ${password}
Role :    ${role}

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
                user: "nxtgenwebsites@gmail.com",
                pass: process.env.EMAIL_PASS
            },
        });

        const mailOptions = {
            from: "nxtgenwebsites@gmail.com",
            to: email,
            subject: "Your Updated Password for Global Care Givers Database",
            text: `Dear ${name},

We wanted to inform you that your password has been successfully changed by the admin.

To access your account, please use the following login details:
Login Link:   https://globalcaregivers.healthcentreapp.com/login.html
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


export { addUser, editUser, deleteUser, getUser, getAllUsers, loginUser, sendLoginDetails, passwordDetails, blockUser, unblockUser };