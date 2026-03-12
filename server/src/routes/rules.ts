import { Router, Request, Response, NextFunction } from 'express';
import { APIResponse, RulesSearchRequest, RulesSearchResponse } from '../types';
import { AppError } from '../middleware/errorHandler';
import { callLLM, parseJSONResponse, validateFields } from '../services/llmService';
import { rulesLookup } from '../services/promptTemplates';

const router = Router();

/**
 * POST /api/rules/search
 * Natural language rules lookup for D&D 5e / 2014 rules.
 */
router.post('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query, version, maxTokens } = req.body as RulesSearchRequest;

    // ── Input validation ──────────────────────────────────────────────
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      throw new AppError(
        'A search query is required.',
        400,
        'INVALID_INPUT',
        'Provide a natural language question about D&D rules.',
      );
    }

    if (query.length > 500) {
      throw new AppError(
        `Query too long (${query.length} chars). Maximum is 500 characters.`,
        400,
        'INVALID_INPUT',
        'Please shorten your question to under 500 characters.',
      );
    }

    const resolvedVersion = version ?? '5e';
    if (!['5e', '2014'].includes(resolvedVersion)) {
      throw new AppError(
        `Invalid version "${version}". Use "5e" or "2014".`,
        400,
        'INVALID_INPUT',
        'Set version to "5e" (default) or "2014".',
      );
    }

    const resolvedMaxTokens = Math.min(maxTokens ?? 500, 1000);

    // ── LLM call ──────────────────────────────────────────────────────
    console.log(`[RULES] query="${query.trim().slice(0, 80)}" version=${resolvedVersion}`);

    const llmResult = await callLLM({
      systemPrompt: rulesLookup.systemPrompt,
      userPrompt: rulesLookup.buildUserPrompt(query.trim(), resolvedVersion),
      maxTokens: resolvedMaxTokens,
    });

    // ── Parse & validate the JSON response ────────────────────────────
    const parsed = parseJSONResponse<{
      answer: string;
      source: string;
      followUpQuestions: string[];
    }>(llmResult.content);

    validateFields(parsed, ['answer', 'source', 'followUpQuestions']);

    // Ensure followUpQuestions is always an array of strings
    const followUps = Array.isArray(parsed.followUpQuestions)
      ? parsed.followUpQuestions.filter((q): q is string => typeof q === 'string').slice(0, 2)
      : [];

    // ── Build response ────────────────────────────────────────────────
    const response: APIResponse<RulesSearchResponse> = {
      success: true,
      data: {
        query: query.trim(),
        answer: parsed.answer,
        source: parsed.source,
        followUpQuestions: followUps,
      },
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
});

export default router;
