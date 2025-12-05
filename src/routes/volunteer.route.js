import { Router } from "express";
import Volunteer from '../models/volunteer.model.js'

const router = Router();

// Create
// FIX: Added 'next' parameter
router.post('/', async (req, res, next) => {
    try {
        const event = await Volunteer.create(req.body);
        res.status(201).json({
            message: "Volunteer form submitted successfully",
            id: event.id,
            event
        });
    } catch (error) {
        next(error);
    }
})

// Read All
// FIX: Added 'next' parameter
router.get('/', async (req, res, next) => {
    try {
        const { status, category, limit } = req.query;
        const query = {};
        if (status) query.status = status;
        if (category) query.category = category;

        const events = await Volunteer.find(query)
            .sort({ createdAt: -1 }) // Sorted by createdAt usually better than date
            .limit(limit ? parseInt(limit) : 0);

        // Note: You are returning 'events', but frontend might expect 'volunteers'.
        // This is why your frontend needs `data.events`.
        res.json({
            message: 'Volunteer retrieved successfully',
            count: events.length,
            events 
        });

    } catch (error) {
        next(error);
    }
})

// Read Specific
// FIX: Added 'next' parameter
router.get('/:id', async (req, res, next) => {
    try {
        const event = await Volunteer.findById(req.params.id)
        if (!event) {
            return res.status(404).json({ message: 'Volunteer not found' })
        }
        res.json({
            message: 'Volunteer retrieved successfully',
            event
        })
    } catch (error) {
        next(error);
    }
})

// Update
// FIX 1: Added SLASH before :id
// FIX 2: Added 'next' parameter
router.patch('/:id', async (req, res, next) => { 
    try {
        const event = await Volunteer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
        if (!event) {
            return res.status(404).json({
                message: 'Volunteer not found'
            })
        }
        res.json({
            message: 'Volunteer updated successfully',
            event
        });
    } catch (error) {
        next(error);
    }
})

// Delete
// FIX: Added 'next' parameter
router.delete('/:id', async (req, res, next) => {
    try {
        const event = await Volunteer.findByIdAndDelete(
            req.params.id
        )
        if (!event) {
            return res.status(404).json({ // Changed 400 to 404 for not found
                message: 'Volunteer does not exist with this id'
            });
        }
        return res.status(200).json({
            message: 'Volunteer deleted successfully'
        })
    } catch (error) {
        next(error);
    }
})

export default router;