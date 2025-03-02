import mongoose from "mongoose";

const connectDB = async() =>{
    try {
        await mongoose.connect('mongodb+srv://nxtgenwebsites:DKXOMCeEaleBXLVG@healthcarefacilities.6zml0.mongodb.net/health-facility');
        console.log(`MongoDB connected successfully!`);
    } catch (err) {
        console.error("MongoDB connection error:", err)
    }
}

export default connectDB