import userModel from "../models/userSchama.js";

const addUser = async (req, res) => {
    try {
        const { name, last_name, email, password, role } = req.body;

        if (!name || !last_name || !email || !password || !role) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newUser = new userModel({ name, last_name, password, role, email });
        await newUser.save();

        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log(error);
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
        console.log(error);
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
        const { id } = req.headers;

        const user = await userModel.findById(id);

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

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        if (user.password !== password) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        res.status(200).json({
            message: "Login successful",
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
        text: `Dear [First Name],

Welcome to the Health Monitor System!

We are excited to have you onboard. Below are your login details to get started with your account:
Login Link:     https://health-care-facilities.vercel.app/login.html
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

export { addUser, editUser, deleteUser, getUser, getAllUsers, loginUser , sendLoginDetails };