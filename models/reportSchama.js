import mongoose from 'mongoose';

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
    facility_a_e: String,
}, { timestamps: true });

const DataModel = mongoose.model('data', reportSchema);

export default DataModel;
