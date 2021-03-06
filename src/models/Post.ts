import { Schema, model } from 'mongoose';

const PostSchema = new Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    image: {type: String, required: true},
    url: {type: String, required: true, unique: true, lowercase: true},
    createdAt: {type: Date, required: true, default: Date.now()},
    updatedAt: Date,
});

export default model('Post', PostSchema);