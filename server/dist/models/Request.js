import mongoose, { Schema } from 'mongoose';
const RequestSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    locationType: {
        type: String,
        enum: ['home', 'res', 'either'],
        required: true,
    },
    locationId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Location',
    },
    interestTopic: {
        type: [String],
        default: [],
        trim: true,
    },
    time: {
        type: Date,
        required: true,
    },
    cuisine: {
        type: [String],
        default: [],
    },
    dietaryRestriction: {
        type: [String],
        default: [],
    },
    numGuests: {
        type: Number,
        default: 1,
    },
    additionalInfo: {
        type: String,
        default: '',
        trim: true,
    },
    status: {
        type: String,
        enum: ['waiting', 'pending', 'approved'],
        default: 'waiting',
        trim: true,
    },
}, { timestamps: true });
export default mongoose.model('RequestModels', RequestSchema);
