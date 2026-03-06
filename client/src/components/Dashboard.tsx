import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Rules Lookup',
    description: 'Ask any D&D 5e rules question in plain English.',
    path: '/rules',
    icon: '📜',
  },
  {
    title: 'Creature Search',
    description: 'Find creatures and view full stat blocks.',
    path: '/creatures',
    icon: '🐉',
  },
  {
    title: 'NPC Generator',
    description: 'Generate memorable NPCs with one click.',
    path: '/npcs',
    icon: '🧙',
  },
  {
    title: 'Magic Items',
    description: 'Search or create unique magic items.',
    path: '/items',
    icon: '⚔️',
  },
];

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          AI Dungeon Master Assistant
        </h1>
        <p className="mt-2 text-gray-600">
          Your AI-powered companion for running D&amp;D sessions.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {features.map((f) => (
          <Link
            key={f.path}
            to={f.path}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <span className="text-3xl">{f.icon}</span>
            <h2 className="mt-2 text-lg font-semibold">{f.title}</h2>
            <p className="mt-1 text-sm text-gray-500">{f.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
