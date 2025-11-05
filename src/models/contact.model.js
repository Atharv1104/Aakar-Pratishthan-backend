import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    match: [/^[A-Za-z\s'-]{2,40}$/, 'Invalid first name format']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    match: [/^[A-Za-z\s'-]{2,40}$/, 'Invalid last name format']
  },
  dob: {
    type: Date,
    required: [true, 'Age is required']
  },
    
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format']
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    match: [/^[0-9]{7,15}$/, 'Phone must be 7-15 digits only']
  },
  message: {
    type: String,
    default: '',
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  consent: {
    type: Boolean,
    required: [true, 'Consent is required']
  }
}, {
  timestamps: true
});

export default mongoose.model('contact', ContactSchema);
