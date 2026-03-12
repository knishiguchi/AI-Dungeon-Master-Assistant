import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { Input } from './ui/Input';
import ResultCard from './ResultCard';
import api from '../lib/api';
import { useSessionStore } from '../stores/sessionStore';
import type { APIResponse, RulesSearchResponse } from '../types';

export default function RulesLookup() {
  const navigate = useNavigate();
  const addToSearchHistory = useSessionStore((s) => s.addToSearchHistory);
  const dndVersion = useSessionStore((s) => s.preferences.dndVersion);

  const [query, setQuery] = useState('');
  const [version, setVersion] = useState<'5e' | '2014'>(dndVersion);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; suggestion?: string } | null>(null);
  const [result, setResult] = useState<RulesSearchResponse | null>(null);

  const handleSearch = async (searchQuery?: string) => {
    const q = (searchQuery ?? query).trim();
    if (!q) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data } = await api.post<APIResponse<RulesSearchResponse>>('/rules/search', {
        query: q,
        version,
      });

      if (data.success && data.data) {
        setResult(data.data);
        addToSearchHistory({
          id: `rules-${Date.now()}`,
          type: 'rules',
          query: q,
          timestamp: data.timestamp,
          result: data.data,
        });
      }
    } catch (err: unknown) {
      const e = err as { message?: string; suggestion?: string };
      setError({
        message: e.message ?? 'Something went wrong. Please try again.',
        suggestion: e.suggestion,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowUp = (question: string) => {
    setQuery(question);
    handleSearch(question);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && query.trim()) {
      handleSearch();
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-gray-500 hover:text-gray-700"
      >
        ← Back
      </button>

      <h1 className="mb-6 text-2xl font-bold">Rules Lookup</h1>

      {/* Search form */}
      <Card>
        <CardContent className="space-y-4 p-5">
          <Input
            placeholder="Enter your D&D rules question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            maxLength={500}
          />

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              Version:
              <select
                value={version}
                onChange={(e) => setVersion(e.target.value as '5e' | '2014')}
                disabled={isLoading}
                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                <option value="5e">5e (2024)</option>
                <option value="2014">5e (2014)</option>
              </select>
            </label>

            <div className="flex-1" />

            <span className="text-xs text-gray-400">{query.length}/500</span>
          </div>

          <Button
            onClick={() => handleSearch()}
            disabled={isLoading || !query.trim()}
            className="w-full"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Spinner />
                Searching…
              </span>
            ) : (
              'Search'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Error state */}
      {error && (
        <Card className="mt-4 border-red-200 bg-red-50">
          <CardContent className="p-5">
            <p className="text-sm font-medium text-red-700">{error.message}</p>
            {error.suggestion && (
              <p className="mt-1 text-xs text-red-500">{error.suggestion}</p>
            )}
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => handleSearch()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Result */}
      {result && !isLoading && (
        <div className="mt-4">
          <ResultCard
            type="rules"
            query={result.query}
            answer={result.answer}
            source={result.source}
            followUpQuestions={result.followUpQuestions}
            onFollowUp={handleFollowUp}
          />
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
