import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema({
    day: { type: String, required: true, default: "all" },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true }
});

const reportSchema = new mongoose.Schema({
    organisation_name: String,
    facility_type: String,
    ownership: String,
    state: String,
    email: String,
    phone: String,
    country: String,
    city: String,
    address: String,
    google_maps_link: String,
    is_24_hours: String,
    zip_code: String,
    facility_a_e: String,
    time_slots: { type: [timeSlotSchema], default: [] } // Stores start and end times for each day
}, { timestamps: true });

const reportModel = mongoose.model('data', reportSchema);

export default reportModel;
