import mongoose from "mongoose";

const connectDB = async() =>{
    try {
        await mongoose.connect('mongodb+srv://shahbazansari8998:trH8T0rqMKFReMuz@cluster0.y4ft9.mongodb.net/health-facility');
        console.log(`MongoDB connected successfully!`);
    } catch (err) {
        console.error("MongoDB connection error:", err)
    }
}

export default connectDB