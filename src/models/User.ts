import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true, lowercase: true},
    password: {type: String, required: true},
    avatar: {type: String, required: false},
    username: {type: String, required: true, unique: true, lowercase: true},
    createdAt: {type: Date, required: true, default: Date.now()},
    updatedAt: Date,
    posts: [{ ref: 'Post', type: Schema.Types.ObjectId }],
});

export default model('User', UserSchema);