import { Router, Request, Response, NextFunction } from 'express';
import { APIResponse, NPCGenerateRequest, NPCGenerateResponse } from '../types';
import { AppError } from '../middleware/errorHandler';

const router = Router();

/**
 * POST /api/npcs/generate
 * Generate a random or guided NPC.
 *
 * NOTE: Full implementation in Task 1.9.
 */
router.post('/generate', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { generationType, prompt } = req.body as NPCGenerateRequest;

    if (generationType && !['random', 'guided'].includes(generationType)) {
      throw new AppError(
        `Invalid generationType "${generationType}". Use "random" or "guided".`,
        400,
        'INVALID_INPUT',
        'Set generationType to "random" or "guided".'
      );
    }

    if (generationType === 'guided' && (!prompt || prompt.trim().length === 0)) {
      throw new AppError(
        'A prompt is required for guided NPC generation.',
        400,
        'INVALID_INPUT',
        'Provide a description for the NPC (e.g., "Shopkeeper in desert city").'
      );
    }

    // TODO: Implement LLM call (Task 1.9)
    const response: APIResponse<NPCGenerateResponse> = {
      success: true,
      data: {
        npc: {
          name: 'Placeholder NPC',
          race: 'Human',
          appearance: 'NPC generation not yet implemented. See Task 1.9.',
          personality: '',
          goal: '',
          secret: '',
          quirk: '',
          voice: '',
          hooks: [],
        },
      },
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
});

export default router;
