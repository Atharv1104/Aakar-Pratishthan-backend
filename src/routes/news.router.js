import { Router } from "express";
import News from "../models/news.model.js"; 
// --- 1. Import cloudinary
import { protect } from '../middleware/auth.middleware.js';
import { uploadNews, cloudinary } from "../config/cloudconfig.js";

const router = Router();

// POST: Uploads a new image
router.post("/",protect, uploadNews.single('image'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image file uploaded." });
        }
        
        // --- 2. Get both path (URL) and filename (publicId)
        const imageUrl = req.file.path; 
        const publicId = req.file.filename;

        const newNewsItem = new News({
            imageUrl: imageUrl,
            publicId: publicId, // --- 3. Save the publicId
        });

        await newNewsItem.save();
        res.status(201).json(newNewsItem);

    } catch (error) {
        next(error); 
    }
});

// GET: Fetches all news images
router.get("/", async (req, res, next) => {
    try {
        const news = await News.find({}).sort({ date: -1 });
        res.status(200).json(news);
    } catch (error) {
        next(error);
    }
});

// DELETE: Deletes a news item by its ID
router.delete("/:id", protect, async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedItem = await News.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ message: "News item not found." });
        }

        // --- CORRECTED CLOUDINARY DELETE CALL ---
        if (deletedItem.publicId) {
            // Call destroy without the callback and await the promise it returns.
            // This ensures the code waits for the deletion to finish.
            await cloudinary.uploader.destroy(deletedItem.publicId);
        }
        
        res.status(200).json({ message: "News item deleted successfully." });

    } catch (error) {
        // It's also good practice to check for Cloudinary errors specifically
        if (error.http_code) { // Cloudinary errors have an http_code
            console.error("Cloudinary API Error:", error);
        }
        next(error); 
    }
});

export default router;