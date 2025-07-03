import { Schema, model } from 'mongoose';
const UserSchema = new Schema({
    userName: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    firstName: {
        type: String,
        trim: true,
        required: true,
    },
    lastName: {
        type: String,
        trim: true,
        required: true,
    },
    phone: {
        type: String,
        trim: true,
        required: function () {
            return this.provider === 'Local';
        },
    },
    provider: {
        type: String,
        enum: ['Local', 'Google'],
        default: 'Local',
    },
    password: {
        type: String,
        required: function () {
            return this.provider === 'Local';
        },
    },
    avatar: {
        type: String,
        default: '',
        trim: true,
    },
    cover: {
        type: String,
        default: '',
        required: function () {
            return this.provider === 'Local';
        },
    },
    socialLink: {
        type: String,
        default: '',
        trim: true,
    },
    role: {
        type: String,
        enum: ['Host', 'Guest'],
        required: function () {
            return this.provider === 'Local';
        },
        default: 'Guest',
    },
    hobbies: {
        type: [String],
        default: [],
    },
    cuisines: {
        type: [String],
        default: [],
    },
    ethnicity: {
        type: String,
        enum: ['Asian', 'Black', 'Hispanic', 'White', 'Other'],
        trim: true,
    },
    bio: {
        type: String,
        default: '',
        trim: true,
    },
    locationId: {
        type: Schema.Types.ObjectId,
        ref: 'Location',
        required: function () {
            return this.provider === 'Local';
        },
    },
}, { timestamps: true });
const UserModel = model('User', UserSchema);
export default UserModel;
