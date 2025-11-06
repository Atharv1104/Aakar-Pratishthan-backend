import { Router } from "express";
import Event from "../models/Event.model.js";
import { uploadEvent, cloudinary } from "../config/cloudconfig.js";
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// GET route remains the same
router.get("/", async (req, res, next) => {
    try {
        const events = await Event.find({}).sort({ eventDate: -1 });
        res.status(200).json(events);
    } catch (error) {
        next(error);
    }
});

// POST route is updated to handle new fields
router.post("/", protect, uploadEvent.array('images', 5), async (req, res, next) => {
    try {
        // --- 1. Destructure all new bilingual fields from req.body ---
        const {
            title_mr, title_en,
            description_mr, description_en,
            location_mr, location_en,
            category, time, status,
            date // This is 'eventDate' from the form
        } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No image files uploaded." });
        }

        // --- 2. Validation for required fields ---
        if (!title_mr || !description_mr || !location_mr || !date || !category) {
            return res.status(400).json({ message: "Marathi Title, Description, Location, Date, and Category are required." });
        }

        const images = req.files.map(file => ({
            url: file.path,
            publicId: file.filename
        }));

        // --- 3. Assemble the bilingual objects for the model ---
        const newEvent = new Event({
            title: { mr: title_mr, en: title_en },
            description: { mr: description_mr, en: description_en },
            location: { mr: location_mr, en: location_en },
            category,
            time,
            status,
            eventDate: date, // Map form 'date' to 'eventDate'
            images: images,
        });

        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        next(error);
    }
});

// DELETE route remains the same
router.delete("/:id",protect, async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedEvent = await Event.findByIdAndDelete(id);
        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found." });
        }
        if (deletedEvent.images && deletedEvent.images.length > 0) {
            for (const image of deletedEvent.images) {
                cloudinary.uploader.destroy(image.publicId);
            }
        }
        if (deletedEvent.images && deletedEvent.images.length > 0) {
            for (const image of deletedEvent.images) {
                // Add await here to make sure it finishes deleting
                await cloudinary.uploader.destroy(image.publicId); 
            }
        }
        res.status(200).json({ message: "Event deleted successfully." });
    } catch (e) {
        next(e);
    }
});

// PUT route is updated to handle new fields
router.put("/:id", uploadEvent.array('images', 4), async (req, res, next) => {
    try {
        const { id } = req.params;
        const oldEvent = await Event.findById(id);
        if (!oldEvent) {
            return res.status(404).json({ message: "Event not found to update." });
        }
        if (req.files && req.files.length > 0) {
            // Delete old images
            if (oldEvent.images && oldEvent.images.length > 0) {
                for (const image of oldEvent.images) {
                    // --- ADD AWAIT HERE ---
                    await cloudinary.uploader.destroy(image.publicId);
                }
            }
            // Add new images
            updateData.images = req.files.map(file => ({
                url: file.path,
                publicId: file.filename
            }));
        }
        // --- 4. Assemble bilingual fields for update ---
        const {
            title_mr, title_en,
            description_mr, description_en,
            location_mr, location_en,
            category, time, status, date
        } = req.body;

        const updateData = {
            title: { mr: title_mr, en: title_en },
            description: { mr: description_mr, en: description_en },
            location: { mr: location_mr, en: location_en },
            category,
            time,
            status,
            eventDate: date,
        };

        // Handle image replacement
        if (req.files && req.files.length > 0) {
            // Delete old images
            if (oldEvent.images && oldEvent.images.length > 0) {
                for (const image of oldEvent.images) {
                    cloudinary.uploader.destroy(image.publicId);
                }
            }
            // Add new images
            updateData.images = req.files.map(file => ({
                url: file.path,
                publicId: file.filename
            }));
        }

        const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        res.status(200).json(updatedEvent);
    } catch (e) {
        next(e);
    }
});

export default router;
