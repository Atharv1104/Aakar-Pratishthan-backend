import { Router } from 'express';
import Contact from '../models/contact.model.js'; // Correctly imports your model

const router = Router();

/**
 * @route   POST /api/contact
 * @desc    Create a new contact submission from the public website
 * @access  Public
 */
router.post('/', async (req, res, next) => { // Added 'next'
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({
      message: 'Contact form submitted, we will reach you soon!',
      id: contact._id
    });
  } catch (error) {
    next(error); // Pass errors to your errorHandler
  }
});

/**
 * @route   GET /api/contact
 * @desc    Get all contact submissions for the admin panel
 * @access  Private (should add auth middleware later)
 */
router.get('/', async (req, res, next) => {
  try {
    const submissions = await Contact.find({})
        .sort({ createdAt: -1 }); // Show newest first
    
    res.status(200).json(submissions);
  } catch (error) {
    next(error); // Pass errors to your errorHandler
  }
});

// The duplicate POST route from your original file has been removed.

export default router;
