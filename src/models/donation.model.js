import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    match: [/^[A-Za-z\s'-]{2,100}$/, 'Invalid  name format']
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
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [1, 'Donation must be at least ₹1']
  },
  paymentId: {
    type: String,
    required: true,
    unique: true
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

export default mongoose.model('Donation', DonationSchema);
