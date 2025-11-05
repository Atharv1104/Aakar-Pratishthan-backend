import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true,
    },
    publicId: {
        type: String,
        
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('News', newsSchema);