import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getMovies } from '../controllers/movieControllers.js';

const router = express.Router();
router.use(authMiddleware)

router.get("/", getMovies)

export default router;