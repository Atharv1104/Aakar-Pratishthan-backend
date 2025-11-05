import mongoose from "mongoose";

// --- NEW: A reusable schema for bilingual text ---
const I18nString = new mongoose.Schema({
  mr: {
    type: String,
    required: [true, 'Marathi text is required'],
    trim: true
  },
  en: {
    type: String,
    trim: true // English is optional
  }
});

const EventSchema = new mongoose.Schema({
  // --- UPDATED: Use the new I18nString schema ---
  title: I18nString,
  description: I18nString,
  location: I18nString,

  // --- These fields remain the same ---
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Educational', 'Sports', 'Awards', 'Community', 'Other'],
    default: 'Community',
  },
  time: {
    type: String, // This is from your original form
  },
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'cancelled'],
    default: 'upcoming',
  },
  eventDate: {  
    type: Date,
    required: [true, 'Event date and time are required']
  },
  images: [{
    url: { type: String, required: true },
    publicId: { type: String, required: true }
  }],
  dateAdded: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Event", EventSchema);
