import express from 'express';
import { addToWacthlist, removeFromWatchlist, updateWatchlistItem } from '../controllers/watchlistControllers.js';
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from '../middleware/validateRequest.js';
import { addToWatchlistSchema } from '../validators/watchlistValidators.js';

const router = express.Router();
router.use(authMiddleware); 

router.post("/", validateRequest(addToWatchlistSchema),addToWacthlist);
router.delete("/:id", removeFromWatchlist);
router.put("/:id", updateWatchlistItem);

export default router;