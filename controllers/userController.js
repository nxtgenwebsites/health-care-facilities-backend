import userModel from "../models/userSchama.js";

const addUser = async (req, res) => {
    try {
        const { name, last_name, password, role } = req.body;

        if (!name || !last_name || !password || !role) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newUser = new userModel({ name, last_name, password, role });
        await newUser.save();

        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};


const editUser = async (req, res) => {
    try {
        const { id } = req.headers;
        const { name, last_name, password, role } = req.body;

        const updatedUser = await userModel.findByIdAndUpdate(id, { name, last_name, password, role }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
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
    }
};

// Get a single user
const getUser = async (req, res) => {
    try {
        const { id } = req.headers;

        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export {addUser , editUser , deleteUser , getUser , getAllUsers};