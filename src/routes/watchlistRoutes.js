import express from 'express';
import { createWatchlistItem, getWatchlistItems, deleteWatchlistItem, updateWatchlistItem } from '../controllers/watchlistControllers.js';
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from '../middleware/validateRequest.js';
import { addToWatchlistSchema, updateWatchlistSchema } from '../validators/watchlistValidators.js';

const router = express.Router();
router.use(authMiddleware); 

router.post("/", validateRequest(addToWatchlistSchema), createWatchlistItem);
router.get("/", getWatchlistItems)
router.delete("/:id", deleteWatchlistItem);
router.put("/:id", validateRequest(updateWatchlistSchema), updateWatchlistItem);

export default router;