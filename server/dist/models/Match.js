import mongoose, { Schema } from 'mongoose';
const MatchSchema = new Schema({
    hostId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    guestId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    listingId: {
        type: Schema.Types.ObjectId,
        ref: 'Listing',
    },
    requestId: {
        type: Schema.Types.ObjectId,
        ref: 'Request',
    },
    status: {
        type: String,
        enum: ['pending', 'approved'],
        default: 'pending',
    },
    time: {
        type: Date,
        required: true,
    },
}, { timestamps: true });
// Update composite index to use ObjectId fields
MatchSchema.index({ hostId: 1, guestId: 1, time: 1 }, { unique: true });
export default mongoose.model('Match', MatchSchema);
