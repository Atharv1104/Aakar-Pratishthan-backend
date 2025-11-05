import mongoose from 'mongoose';

const VolunteerSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
        match: [/^[A-Za-z\s'-]{2,40}$/, 'Invalid first name format']
    },
    middlename: {
        type: String,
        required: true, // You can change this to false if it's optional
        trim: true,
        match: [/^[A-Za-z\s'-]{2,40}$/, 'Invalid middle name format']
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        match: [/^[A-Za-z\s'-]{2,40}$/, 'Invalid last name format']
    },
    dob: {
        type: Date,
        required: [true, 'Age is required']
    },
    email:{
        type:String,
        lowercase:true,
        match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format']
    },
    phone: {
        type: String,
        required: [true, 'Phone is required'],
        match: [/^[0-9]{7,15}$/, 'Phone must be 7-15 digits only']
    },
    // ----------------------
    message: {
        type: String,
        default: '',
        maxlength: [500, 'Message cannot exceed 500 characters']
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    consent: {
        type: Boolean,
        required: [true, 'Consent is required']
    },
},{
    timestamps: true,
});

export default mongoose.model('Volunteer', VolunteerSchema);
