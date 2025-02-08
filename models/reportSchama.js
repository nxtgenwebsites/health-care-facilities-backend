import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    organisation_name: String,
    facility_type: String,
    ownership: String,
    ownership: String,
    state: String,
    city: String,
    address: String,
    email: String,
    phone: String,
    google_maps_link: String,
    is_24_hours: String,
    opening_time: String,
    closing_time: String,
});

const DataModel = mongoose.model('data', reportSchema);

export default DataModel;
