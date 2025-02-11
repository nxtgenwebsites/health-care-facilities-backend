import reportModel from '../models/reportSchama.js';
import xlsx from 'xlsx';
import csv from 'csv-parser';

// Process Uploaded File
const uploadFile = async (req, res) => {
  try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const fileType = req.file.mimetype;
        let data = [];

        if (fileType === "text/csv" || fileType === "text/plain") {
            // For CSV or TXT files, process directly from buffer
            const stream = streamifier.createReadStream(req.file.buffer);

            stream
                .pipe(csv())
                .on("data", (row) => {
                    data.push(Object.values(row));
                })
                .on("end", () => {
                    res.json({ dropdownData: data.slice(0, 5) });
                })
                .on("error", (error) => {
                    console.error("Error reading CSV/TXT file:", error);
                    res.status(500).json({ error: "Error reading the file" });
                });

        } else if (fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            // ✅ For Excel files (xlsx), process directly from buffer
            const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
            const sheetName = workbook.SheetNames[0];
            const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

            res.json({ dropdownData: sheetData.slice(0, 5) });

        } else {
            res.status(400).json({ error: "Invalid file type" });
        }
    } catch (error) {
        console.error("Error in file processing:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


// Save All Data with to MongoDB
const savefileData = async (req, res) => {
        try {
            // Assuming data comes as an array from the frontend (req.body)
            const data = req.body;  // Accessing the data sent in the request body

            // Check if the data is an array
            if (!Array.isArray(data)) {
                return res.status(400).json({ success: false, message: 'Invalid data format. Expected an array.' });
            }

            // Map through each entry in the data array and save it to the database
            for (const item of data) {
                const {
                    organisation_name,
                    facility_type,
                    ownership,
                    state,
                    city,
                    country,
                    address,
                    email_address,
                    phone_number,
                    google_maps_link,
                    is_24_hours,
                    is_A_E
                } = item;

                // Create a new document based on the data from the frontend
                const newData = new reportModel({
                    organisation_name,
                    facility_type,
                    ownership,
                    state,
                    city,
                    country,
                    address,
                    email: email_address,
                    phone: phone_number,
                    google_maps_link,
                    is_24_hours,
                    facility_a_e: is_A_E
                });

                // Save each entry to the database
                await newData.save();
            }

            // Send success response after saving all data
            res.status(200).json({ success: true, message: "Data saved successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Server Error", message: error.message });
        }
    };

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

const editData = async (req , res) => {
    try {
        const { id } = req.headers;

        if (!id) {
            return res.status(400).json({ error: 'id is required in the headers' });
        }

        const {
            organisation_name, facility_type, ownership, state, city, country,
            address, email, phone, google_maps_link, is_24_hours, facility_a_e
        } = req.body;
        await reportModel.findByIdAndUpdate(id, {
            organisation_name: organisation_name,
            facility_type: facility_type,
            ownership: ownership,
            state: state,
            city: city,
            country: country,
            address: address,
            email: email,
            phone: phone,
            google_maps_link: google_maps_link,
            is_24_hours: is_24_hours,
            facility_a_e: facility_a_e
        });
        return res.status(200).json({ message: "updated successfully" });
    } catch (error) {
        console.log(error);
    }
} 

const deleteData = async (req, res) => {
    try {
        const { id } = req.headers;

        if (!id) {
            return res.status(400).json({ error: 'id is required in the headers' });
        }

        const deletedData = await reportModel.findByIdAndDelete(id);

        if (!deletedData) {
            return res.status(404).json({ error: 'Data not found' });
        }

        return res.status(200).json({ message: 'Data deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

const getReport = async (req, res) => {
    try {
        const { id } = req.headers;
        if (!id) {
            return res.status(400).json({ message: "Id not provided in headers" });
        }

        const data = await reportModel.findById(id);

        if (!data) {
            return res.status(404).json({ message: "data not found" });
        }

       return res.status(200).json({ message: "Success", data: data });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};
export { saveData, getReports, editData, deleteData, getReport, uploadFile, savefileData };
