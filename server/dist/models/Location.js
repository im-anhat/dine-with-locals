import mongoose, { Schema } from 'mongoose';
const LocationSchema = new Schema({
    address: {
        type: String,
        default: '',
        trim: true,
    },
    city: {
        type: String,
        required: true,
        trim: true,
    },
    state: {
        type: String,
        default: '',
        trim: true,
    },
    country: {
        type: String,
        default: 'USA',
        trim: true,
    },
    zipCode: {
        type: String,
        default: '',
        trim: true,
    },
    coordinates: {
        lat: { type: Number },
        lng: { type: Number },
    },
    name: {
        type: String,
        default: '',
        trim: true,
    },
    //Google Maps place_id
    place_id: {
        type: String,
        default: '',
        trim: true,
    },
}, { timestamps: true });
export default mongoose.model('Location', LocationSchema);
