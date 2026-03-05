import { Router, Request, Response, NextFunction } from 'express';
import { APIResponse, RulesSearchRequest, RulesSearchResponse } from '../types';
import { AppError } from '../middleware/errorHandler';

const router = Router();

/**
 * POST /api/rules/search
 * Natural language rules lookup for D&D 5e / 2014 rules.
 *
 * NOTE: Full implementation in Task 1.6.
 */
router.post('/search', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query, version, maxTokens: _maxTokens } = req.body as RulesSearchRequest;

    // Input validation
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      throw new AppError(
        'A search query is required.',
        400,
        'INVALID_INPUT',
        'Provide a natural language question about D&D rules.'
      );
    }

    if (query.length > 500) {
      throw new AppError(
        `Query too long (${query.length} chars). Maximum is 500 characters.`,
        400,
        'INVALID_INPUT',
        'Please shorten your question to under 500 characters.'
      );
    }

    if (version && !['5e', '2014'].includes(version)) {
      throw new AppError(
        `Invalid version "${version}". Use "5e" or "2014".`,
        400,
        'INVALID_INPUT',
        'Set version to "5e" (default) or "2014".'
      );
    }

    // TODO: Implement LLM call and response formatting (Task 1.6)
    const response: APIResponse<RulesSearchResponse> = {
      success: true,
      data: {
        query: query.trim(),
        answer: 'Rules lookup not yet implemented. See Task 1.6.',
        source: `D&D ${version || '5e'} (estimated)`,
        followUpQuestions: [],
      },
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
});

export default router;
