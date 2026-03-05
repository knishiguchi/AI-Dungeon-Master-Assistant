import { LLMRequest, LLMResponse } from '../types';

/**
 * LLM Service - Wrapper around the OpenAI API.
 * Handles prompt formatting, error handling, and retry logic.
 *
 * NOTE: Full implementation in Task 1.2.
 */

export async function callLLM(_request: LLMRequest): Promise<LLMResponse> {
  // TODO: Implement OpenAI API integration (Task 1.2)
  throw new Error('LLM Service not yet implemented. See Task 1.2.');
}
