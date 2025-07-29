import { Request, Response } from 'express';
import { SuggestionRating } from '../models/suggestionRating.model';

// حفظ أو تحديث تقييم اقتراح
export const rateSuggestion = async (req: Request, res: Response) => {
  try {
    const { mixHash, like } = req.body;
    if (!mixHash || typeof like !== 'boolean') {
      return res.status(400).json({ message: 'mixHash and like are required' });
    }

    const userId = (req as any).user?._id || null;

    const filter: any = { mixHash };
    if (userId) filter.user = userId;

    const updated = await SuggestionRating.findOneAndUpdate(
      filter,
      { mixHash, user: userId, like, createdAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json(updated);
  } catch (error: any) {
    console.error('Error rating suggestion:', error);
    return res.status(500).json({ message: 'Error rating suggestion', error: error?.message || 'Unknown error' });
  }
};

// جلب العدادات لاقتراح
export const getSuggestionRating = async (req: Request, res: Response) => {
  try {
    const { mixHash } = req.params;
    if (!mixHash) return res.status(400).json({ message: 'mixHash is required' });

    const aggregation = await SuggestionRating.aggregate([
      { $match: { mixHash } },
      {
        $group: {
          _id: '$mixHash',
          likes: { $sum: { $cond: ['$like', 1, 0] } },
          dislikes: { $sum: { $cond: ['$like', 0, 1] } }
        }
      }
    ]);

    const counts = aggregation[0] || { likes: 0, dislikes: 0 };
    res.json(counts);
  } catch (error: any) {
    console.error('Error fetching rating:', error);
    res.status(500).json({ message: 'Error fetching rating', error: error?.message || 'Unknown error' });
  }
}; 