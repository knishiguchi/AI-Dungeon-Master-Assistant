import { Router, Request, Response, NextFunction } from 'express';
import { APIResponse, ItemSearchRequest, ItemSearchResponse } from '../types';
import { AppError } from '../middleware/errorHandler';

const router = Router();

const VALID_RARITIES = ['common', 'uncommon', 'rare', 'very_rare', 'legendary'];

/**
 * POST /api/items/search
 * Search for existing D&D magic items.
 *
 * NOTE: Full implementation in Task 2.10.
 */
router.post('/search', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query, rarity } = req.body as ItemSearchRequest;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      throw new AppError(
        'A search query is required.',
        400,
        'INVALID_INPUT',
        'Describe the type of magic item you are looking for.'
      );
    }

    if (rarity && !VALID_RARITIES.includes(rarity)) {
      throw new AppError(
        `Invalid rarity "${rarity}". Use one of: ${VALID_RARITIES.join(', ')}.`,
        400,
        'INVALID_INPUT'
      );
    }

    // TODO: Implement LLM call (Task 2.10)
    const response: APIResponse<ItemSearchResponse> = {
      success: true,
      data: {
        items: [],
      },
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/items/generate
 * Generate or flavor a magic item.
 *
 * NOTE: Full implementation in Task 2.11.
 */
router.post('/generate', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { generationType } = req.body;

    if (generationType && !['flavored', 'custom'].includes(generationType)) {
      throw new AppError(
        `Invalid generationType "${generationType}". Use "flavored" or "custom".`,
        400,
        'INVALID_INPUT'
      );
    }

    // TODO: Implement LLM call (Task 2.11)
    const response: APIResponse = {
      success: true,
      data: { message: 'Item generation not yet implemented. See Task 2.11.' },
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
});

export default router;
