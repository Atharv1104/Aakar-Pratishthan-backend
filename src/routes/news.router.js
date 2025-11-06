import { Router } from 'express';
import { createNews, getAllNews, deleteNews } from '../controllers/news.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';

const router = Router();

// --- THIS IS THE FIX ---
// The .post (create) route IS protected by authMiddleware.
// The .get (get all) route is now PUBLIC and has no authMiddleware.
router.route('/')
    .post(authMiddleware, upload.single('image'), createNews)
    .get(getAllNews); // <-- I REMOVED 'authMiddleware' FROM THIS LINE

// DELETE /api/news/:id - Delete News (This is still protected)
router.route('/:id')
    .delete(authMiddleware, deleteNews);

export default router;