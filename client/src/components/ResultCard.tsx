import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Copy, Check } from 'lucide-react';

interface ResultCardProps {
  type: 'rules' | 'creature' | 'npc' | 'item';
  query?: string;
  answer: string;
  source?: string;
  timestamp?: string;
  followUpQuestions?: string[];
  onFollowUp?: (question: string) => void;
}

const typeLabels: Record<ResultCardProps['type'], string> = {
  rules: 'Rules Answer',
  creature: 'Creature Info',
  npc: 'Generated NPC',
  item: 'Magic Item',
};

export default function ResultCard({
  type,
  query,
  answer,
  source,
  timestamp,
  followUpQuestions,
  onFollowUp,
}: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = [
      query && `Q: ${query}`,
      answer,
      source && `Source: ${source}`,
    ]
      .filter(Boolean)
      .join('\n\n');

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">{typeLabels[type]}</CardTitle>
        <Button variant="ghost" size="icon" onClick={handleCopy} title="Copy to clipboard">
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Query echo */}
        {query && (
          <p className="text-xs text-gray-400">
            <span className="font-medium">Q:</span> {query}
          </p>
        )}

        {/* Answer body */}
        <div className="prose prose-sm max-w-none whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
          {answer}
        </div>

        {/* Source */}
        {source && (
          <p className="text-xs font-medium text-gray-500">
            Source: {source}
          </p>
        )}

        {/* Timestamp */}
        {timestamp && (
          <p className="text-xs text-gray-400">
            {new Date(timestamp).toLocaleTimeString()}
          </p>
        )}

        {/* Follow-up questions */}
        {followUpQuestions && followUpQuestions.length > 0 && (
          <div className="space-y-2 border-t border-gray-100 pt-3">
            <p className="text-xs font-medium text-gray-500">Follow-up questions:</p>
            <div className="flex flex-wrap gap-2">
              {followUpQuestions.map((q, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => onFollowUp?.(q)}
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
