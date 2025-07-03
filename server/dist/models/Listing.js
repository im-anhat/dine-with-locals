import mongoose, { Schema } from 'mongoose';
const ListingSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    images: {
        type: [String],
        default: [],
    },
    category: {
        type: String,
        enum: ['dining', 'travel', 'event'],
        required: true,
    },
    // locationId refers to the _id field in the Location model, not place_id
    locationId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Location',
    },
    additionalInfo: {
        type: String,
        default: '',
        trim: true,
    },
    status: {
        type: String,
        enum: ['pending', 'waiting', 'approved'],
        default: 'waiting',
    },
    time: {
        type: Date,
    },
    duration: {
        type: Number,
    },
    interestTopic: {
        type: [String],
        default: [],
    },
    numGuests: {
        type: Number,
        default: 1,
    },
    cuisine: {
        type: [String],
        default: [],
    },
    dietary: {
        type: [String],
        default: [],
    },
}, { timestamps: true });
export default mongoose.model('Listing', ListingSchema);
