import { Router } from 'express';
import { rateSuggestion, getSuggestionRating } from '../controllers/rating.controller';

const router = Router();

// يمكن السماح بالتقييم بدون تسجيل دخول – اجعل authMiddleware اختياري
router.post('/', rateSuggestion);
router.get('/:mixHash', getSuggestionRating);

export default router; 