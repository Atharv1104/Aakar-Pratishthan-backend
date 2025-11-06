import { Router } from 'express';
import Doner from '../models/donation.model.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// POST /api/donation (Public)
router.post('/', async (req, res, next) => { // 1. Added 'next'
  try {
    const Donation = await Doner.create(req.body);
    res.status(201).json({
      message: 'Donation form uploading successful',
      id: Donation._id
    });
  } catch (error) {
    next(error); // 2. Pass error to handler
  }
});

// --- 3. ADD THESE ADMIN ROUTES ---

// GET /api/admin/donation (Protected by index.js)
router.get('/', async (req, res, next) => {
  try {
    const submissions = await Doner.find({}).sort({ createdAt: -1 });
    res.status(200).json(submissions);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/donation/:id (Protected by index.js)
router.delete('/:id',protect, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Doner.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Donation record not found.' });
    }
    res.status(200).json({ message: 'Donation record deleted.' });
  } catch (error) {
    next(error);
  }
});

export default router;