import { Router, Request, Response, NextFunction } from 'express';
import { APIResponse, NPCGenerateRequest, NPCGenerateResponse, NPC } from '../types';
import { AppError } from '../middleware/errorHandler';
import { callLLM, parseJSONResponse, validateFields } from '../services/llmService';
import { npcGeneration } from '../services/promptTemplates';

const router = Router();

/**
 * POST /api/npcs/generate
 * Generate a random or guided NPC.
 */
router.post('/generate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { generationType, prompt, includeVoiceNotes } = req.body as NPCGenerateRequest;

    // ── Input validation ──────────────────────────────────────────────
    const resolvedType = generationType ?? 'random';

    if (!['random', 'guided'].includes(resolvedType)) {
      throw new AppError(
        `Invalid generationType "${generationType}". Use "random" or "guided".`,
        400,
        'INVALID_INPUT',
        'Set generationType to "random" or "guided".',
      );
    }

    if (resolvedType === 'guided' && (!prompt || prompt.trim().length === 0)) {
      throw new AppError(
        'A prompt is required for guided NPC generation.',
        400,
        'INVALID_INPUT',
        'Provide a description for the NPC (e.g., "Shopkeeper in desert city").',
      );
    }

    if (prompt && prompt.length > 500) {
      throw new AppError(
        `Prompt too long (${prompt.length} chars). Maximum is 500 characters.`,
        400,
        'INVALID_INPUT',
        'Please shorten your NPC description to under 500 characters.',
      );
    }

    // ── LLM call ──────────────────────────────────────────────────────
    console.log(`[NPC] type=${resolvedType} prompt="${(prompt ?? '').slice(0, 80)}"`);

    const llmResult = await callLLM({
      systemPrompt: npcGeneration.systemPrompt,
      userPrompt: npcGeneration.buildUserPrompt(resolvedType, prompt?.trim()),
      maxTokens: 800,
    });

    // ── Parse & validate ──────────────────────────────────────────────
    const parsed = parseJSONResponse<Record<string, unknown>>(llmResult.content);

    validateFields(parsed, [
      'name',
      'race',
      'appearance',
      'personality',
      'goal',
      'secret',
      'quirk',
      'voice',
    ]);

    // Ensure hooks is always an array of strings
    const rawHooks = parsed.hooks;
    const hooks = Array.isArray(rawHooks)
      ? rawHooks.filter((h): h is string => typeof h === 'string').slice(0, 4)
      : [];

    const npc: NPC = {
      name: parsed.name as string,
      race: parsed.race as string,
      appearance: parsed.appearance as string,
      personality: parsed.personality as string,
      goal: parsed.goal as string,
      secret: parsed.secret as string,
      quirk: parsed.quirk as string,
      voice: includeVoiceNotes === false ? '' : (parsed.voice as string),
      hooks,
    };

    // ── Build response ────────────────────────────────────────────────
    const response: APIResponse<NPCGenerateResponse> = {
      success: true,
      data: { npc },
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
});

export default router;
