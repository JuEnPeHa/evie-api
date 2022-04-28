import { Schema, model } from 'mongoose';

const NEARRequestSchema = new Schema({
    receivedAccount: String, 
    receivedContract: String,
})

export default model('NEARRequest', NEARRequestSchema);