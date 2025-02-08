import xlsx from 'xlsx';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import reportModel from '../models/reportSchama.js';

// Process Uploaded File
const processFile = (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = req.file.path;
    const fileType = path.extname(filePath).substring(1);
    let data = [];

    if (fileType === "csv" || fileType === "txt") {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
                data.push(Object.values(row));
            })
            .on("end", () => {
                res.json({ dropdownData: data.slice(0, 5) });
            });
    } else {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
        res.json({ dropdownData: sheetData.slice(0, 5) });
    }
};

// Save Data to MongoDB
const saveData = async (req, res) => {
    try {
        const {
            organisation_name, facility_type, ownership, state, city,
            address, email, phone, google_maps_link, is_24_hours,
            opening_time, closing_time
        } = req.body;

        // Check for required fields
        if (!organisation_name || !facility_type || !ownership || !state || !city || !address || !email || !phone) {
            return res.status(400).json({ error: "Required fields are missing" });
        }

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
            opening_time,
            closing_time
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


export { processFile, saveData, getReports };
