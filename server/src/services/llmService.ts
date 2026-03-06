import OpenAI from 'openai';
import config from '../config';
import { LLMRequest, LLMResponse } from '../types';
import { AppError } from '../middleware/errorHandler';

// ============================================================
// OpenAI Client
// ============================================================

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

// ============================================================
// Cost Tracking
// ============================================================

/** Approximate per-token costs (USD) for common models. */
const TOKEN_COSTS: Record<string, { input: number; output: number }> = {
  'gpt-4':         { input: 0.03   / 1000, output: 0.06   / 1000 },
  'gpt-4-turbo':   { input: 0.01   / 1000, output: 0.03   / 1000 },
  'gpt-4o':        { input: 0.005  / 1000, output: 0.015  / 1000 },
  'gpt-4o-mini':   { input: 0.00015 / 1000, output: 0.0006 / 1000 },
  'gpt-3.5-turbo': { input: 0.0005 / 1000, output: 0.0015 / 1000 },
};

interface CostLog {
  timestamp: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
}

/** In-memory cost log for the current server session. */
const costHistory: CostLog[] = [];

function estimateCost(
  model: string,
  promptTokens: number,
  completionTokens: number,
): number {
  const rates = TOKEN_COSTS[model] ?? TOKEN_COSTS['gpt-4'];
  return promptTokens * rates.input + completionTokens * rates.output;
}

/** Return accumulated cost data for monitoring. */
export function getCostSummary() {
  const totalCost = costHistory.reduce((sum, e) => sum + e.estimatedCost, 0);
  const totalTokens = costHistory.reduce((sum, e) => sum + e.totalTokens, 0);
  return {
    totalCalls: costHistory.length,
    totalTokens,
    totalCost: Math.round(totalCost * 1_000_000) / 1_000_000, // 6 dp
    recentCalls: costHistory.slice(-10),
  };
}

// ============================================================
// Retry Helpers
// ============================================================

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000; // 1 s → 2 s → 4 s

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryable(err: unknown): boolean {
  if (err instanceof OpenAI.APIError) {
    // Retry on rate-limit (429), server errors (500+), and timeouts (408)
    return [408, 429, 500, 502, 503, 504].includes(err.status);
  }
  // Network-level failures
  if (err instanceof Error && err.message.includes('ECONNRESET')) return true;
  return false;
}

// ============================================================
// Core LLM Call
// ============================================================

/**
 * Call the OpenAI Chat Completions API with automatic retries and cost logging.
 *
 * @throws {AppError} on validation failures or after retries are exhausted.
 */
export async function callLLM(request: LLMRequest): Promise<LLMResponse> {
  // --- Validate API key ---
  if (!config.openaiApiKey) {
    throw new AppError(
      'OpenAI API key is not configured. Set OPENAI_API_KEY in .env.',
      500,
      'LLM_CONFIG_ERROR',
      'Add your OpenAI API key to the server .env file.',
    );
  }

  // --- Validate request ---
  if (!request.userPrompt || request.userPrompt.trim().length === 0) {
    throw new AppError(
      'User prompt cannot be empty.',
      400,
      'INVALID_INPUT',
      'Provide a non-empty prompt.',
    );
  }

  const model = config.openaiModel;
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const startTime = Date.now();

      const completion = await openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: request.systemPrompt },
          { role: 'user', content: request.userPrompt },
        ],
        max_tokens: request.maxTokens,
        temperature: 0.7,
      });

      const elapsed = Date.now() - startTime;
      const choice = completion.choices[0];
      const content = choice?.message?.content ?? '';
      const usage = completion.usage;

      const promptTokens = usage?.prompt_tokens ?? 0;
      const completionTokens = usage?.completion_tokens ?? 0;
      const totalTokens = promptTokens + completionTokens;
      const cost = estimateCost(model, promptTokens, completionTokens);

      // --- Cost log ---
      const entry: CostLog = {
        timestamp: new Date().toISOString(),
        model,
        promptTokens,
        completionTokens,
        totalTokens,
        estimatedCost: cost,
      };
      costHistory.push(entry);

      console.log(
        `[LLM] model=${model} tokens=${totalTokens} cost=$${cost.toFixed(6)} time=${elapsed}ms attempt=${attempt}`,
      );

      return { content, tokensUsed: totalTokens };
    } catch (err) {
      lastError = err;

      if (isRetryable(err) && attempt < MAX_RETRIES) {
        const delay = BASE_DELAY_MS * 2 ** (attempt - 1);
        console.warn(
          `[LLM] Retryable error on attempt ${attempt}/${MAX_RETRIES}. Waiting ${delay}ms…`,
          err instanceof Error ? err.message : err,
        );
        await sleep(delay);
        continue;
      }

      // Non-retryable or final attempt – break out
      break;
    }
  }

  // --- Map OpenAI errors to AppError ---
  if (lastError instanceof OpenAI.APIError) {
    const status = lastError.status;

    if (status === 401) {
      throw new AppError(
        'Invalid OpenAI API key.',
        500,
        'LLM_AUTH_ERROR',
        'Check the OPENAI_API_KEY value in .env.',
      );
    }
    if (status === 429) {
      throw new AppError(
        'OpenAI rate limit exceeded. Please wait and try again.',
        429,
        'LLM_RATE_LIMIT',
        'Wait a minute before retrying, or upgrade your OpenAI plan.',
      );
    }
    if (status === 400) {
      throw new AppError(
        `OpenAI rejected the request: ${lastError.message}`,
        400,
        'LLM_BAD_REQUEST',
        'Try shortening your query.',
      );
    }

    throw new AppError(
      `OpenAI API error (${status}): ${lastError.message}`,
      502,
      'LLM_API_ERROR',
      'The AI service is temporarily unavailable. Try again shortly.',
    );
  }

  // Generic fallback
  throw new AppError(
    `LLM call failed: ${lastError instanceof Error ? lastError.message : 'Unknown error'}`,
    500,
    'LLM_UNKNOWN_ERROR',
    'An unexpected error occurred calling the AI service.',
  );
}

// ============================================================
// Response Parsing Helpers
// ============================================================

/**
 * Attempt to extract a JSON object from an LLM response string.
 * Handles responses wrapped in markdown code fences.
 */
export function parseJSONResponse<T>(raw: string): T {
  // Strip optional markdown code fences
  let cleaned = raw.trim();
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new AppError(
      'Failed to parse AI response as JSON.',
      502,
      'LLM_PARSE_ERROR',
      'The AI returned an unexpected format. Try again.',
    );
  }
}

/**
 * Validate that a parsed object contains all required keys.
 */
export function validateFields<T extends Record<string, unknown>>(
  obj: T,
  requiredKeys: string[],
): void {
  const missing = requiredKeys.filter(
    (k) => !(k in obj) || obj[k] === undefined || obj[k] === null || obj[k] === '',
  );
  if (missing.length > 0) {
    throw new AppError(
      `AI response missing required fields: ${missing.join(', ')}`,
      502,
      'LLM_INCOMPLETE_RESPONSE',
      'The AI did not return all expected data. Try again.',
    );
  }
}
