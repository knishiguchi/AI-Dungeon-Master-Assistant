import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Copy, Check } from 'lucide-react';
import api from '../lib/api';
import { useSessionStore } from '../stores/sessionStore';
import type { APIResponse, NPCGenerateResponse, NPC } from '../types';

const NPC_FIELDS: { key: keyof NPC; label: string; emoji: string }[] = [
  { key: 'race', label: 'Race', emoji: '🧝' },
  { key: 'appearance', label: 'Appearance', emoji: '👁️' },
  { key: 'personality', label: 'Personality', emoji: '💬' },
  { key: 'goal', label: 'Goal', emoji: '🎯' },
  { key: 'secret', label: 'Secret', emoji: '🤫' },
  { key: 'quirk', label: 'Quirk', emoji: '✨' },
  { key: 'voice', label: 'Voice Notes', emoji: '🎭' },
];

export default function NPCGenerator() {
  const navigate = useNavigate();
  const addGeneratedNPC = useSessionStore((s) => s.addGeneratedNPC);
  const addToSearchHistory = useSessionStore((s) => s.addToSearchHistory);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; suggestion?: string } | null>(null);
  const [npc, setNpc] = useState<NPC | null>(null);
  const [copiedFull, setCopiedFull] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await api.post<APIResponse<NPCGenerateResponse>>('/npcs/generate', {
        generationType: 'random',
        includeVoiceNotes: true,
      });

      if (data.success && data.data) {
        const generated = data.data.npc;
        setNpc(generated);
        addGeneratedNPC(generated);
        addToSearchHistory({
          id: `npc-${Date.now()}`,
          type: 'npc',
          query: generated.name,
          timestamp: data.timestamp,
          result: generated,
        });
      }
    } catch (err: unknown) {
      const e = err as { message?: string; suggestion?: string };
      setError({
        message: e.message ?? 'Failed to generate NPC. Please try again.',
        suggestion: e.suggestion,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatNPCText = (n: NPC) =>
    [
      `NAME: ${n.name}`,
      `RACE: ${n.race}`,
      `APPEARANCE: ${n.appearance}`,
      `PERSONALITY: ${n.personality}`,
      `GOAL: ${n.goal}`,
      `SECRET: ${n.secret}`,
      `QUIRK: ${n.quirk}`,
      `VOICE: ${n.voice}`,
      n.hooks.length > 0 ? `HOOKS:\n${n.hooks.map((h, i) => `  ${i + 1}. ${h}`).join('\n')}` : '',
    ]
      .filter(Boolean)
      .join('\n');

  const handleCopyAll = async () => {
    if (!npc) return;
    await navigator.clipboard.writeText(formatNPCText(npc));
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2000);
  };

  const handleCopyField = async (key: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-gray-500 hover:text-gray-700"
      >
        ← Back
      </button>

      <h1 className="mb-6 text-2xl font-bold">NPC Generator</h1>

      {/* Generate button */}
      <div className="flex justify-center">
        <Button
          onClick={handleGenerate}
          disabled={isLoading}
          className="bg-red-600 px-8 py-3 text-lg font-semibold text-white hover:bg-red-700"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Spinner />
              Generating…
            </span>
          ) : npc ? (
            'Generate Another'
          ) : (
            'Generate NPC'
          )}
        </Button>
      </div>

      {/* Error state */}
      {error && (
        <Card className="mt-6 border-red-200 bg-red-50">
          <CardContent className="p-5">
            <p className="text-sm font-medium text-red-700">{error.message}</p>
            {error.suggestion && (
              <p className="mt-1 text-xs text-red-500">{error.suggestion}</p>
            )}
            <Button variant="outline" size="sm" className="mt-3" onClick={handleGenerate}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* NPC Card */}
      {npc && !isLoading && (
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">{npc.name}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyAll}
              title="Copy full NPC to clipboard"
            >
              {copiedFull ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </CardHeader>

          <CardContent className="space-y-3">
            {NPC_FIELDS.map(({ key, label, emoji }) => {
              const value = npc[key];
              if (typeof value !== 'string' || !value) return null;
              return (
                <div key={key} className="group relative rounded-md border border-gray-100 p-3">
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {emoji} {label}
                    </p>
                    <button
                      onClick={() => handleCopyField(key, value)}
                      className="text-gray-300 opacity-0 transition-opacity hover:text-gray-500 group-hover:opacity-100"
                      title={`Copy ${label}`}
                    >
                      {copiedField === key ? (
                        <Check className="h-3.5 w-3.5 text-green-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-gray-800">{value}</p>
                </div>
              );
            })}

            {/* Plot hooks */}
            {npc.hooks.length > 0 && (
              <div className="rounded-md border border-gray-100 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  🪝 Plot Hooks
                </p>
                <ul className="mt-1 list-inside list-disc space-y-1">
                  {npc.hooks.map((hook, i) => (
                    <li key={i} className="text-sm leading-relaxed text-gray-800">
                      {hook}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
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
