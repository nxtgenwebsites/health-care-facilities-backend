import reportModel from '../models/reportSchama.js';

// Save Data to MongoDB
const saveData = async (req, res) => {
    try {
        const {
            organisation_name, facility_type, ownership, state, city, country,
            address, email, phone, google_maps_link, is_24_hours, facility_a_e
        } = req.body;


        const newData = new reportModel({
            organisation_name,
            facility_type,
            ownership,
            state,
            city,
            address,
            email,
            phone,
            google_maps_link,
            is_24_hours,
            facility_a_e,
            country
        });

        await newData.save();
        res.status(200).json({ success: true, message: "Data saved successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error", message: error.message });
    }
};

// Get Reports From MongoDB
const getReports = async (req, res) => {
    try {
        const reports = await reportModel.find({});
        res.status(200).json({ message: "Success", data: reports });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


export { saveData, getReports };
