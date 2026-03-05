import { Router, Request, Response, NextFunction } from 'express';
import { APIResponse, CreatureSearchRequest, CreatureSearchResponse } from '../types';
import { AppError } from '../middleware/errorHandler';

const router = Router();

/**
 * POST /api/creatures/search
 * Search for D&D creatures by name or type.
 *
 * NOTE: Full implementation in Task 1.11.
 */
router.post('/search', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query, searchType } = req.body as CreatureSearchRequest;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      throw new AppError(
        'A creature search query is required.',
        400,
        'INVALID_INPUT',
        'Provide a creature name or type to search for.'
      );
    }

    if (searchType && !['name', 'type'].includes(searchType)) {
      throw new AppError(
        `Invalid searchType "${searchType}". Use "name" or "type".`,
        400,
        'INVALID_INPUT',
        'Set searchType to "name" (default) or "type".'
      );
    }

    // TODO: Implement LLM call (Task 1.11)
    const response: APIResponse<CreatureSearchResponse> = {
      success: true,
      data: {
        creatures: [],
      },
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/creatures/scale
 * Scale a creature for a given party size and level.
 *
 * NOTE: Full implementation in Task 2.5/2.6.
 */
router.post('/scale', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { creatureName, partySize, partyLevel, adjustment: _adjustment } = req.body;

    if (!creatureName || typeof creatureName !== 'string') {
      throw new AppError('creatureName is required.', 400, 'INVALID_INPUT');
    }

    if (!partySize || partySize < 1 || partySize > 10) {
      throw new AppError('partySize must be between 1 and 10.', 400, 'INVALID_INPUT');
    }

    if (!partyLevel || partyLevel < 1 || partyLevel > 20) {
      throw new AppError('partyLevel must be between 1 and 20.', 400, 'INVALID_INPUT');
    }

    // TODO: Implement scaling logic (Task 2.5/2.6)
    const response: APIResponse = {
      success: true,
      data: { message: 'Creature scaling not yet implemented. See Task 2.5.' },
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
});

export default router;
