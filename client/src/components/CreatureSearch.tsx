import { useNavigate } from 'react-router-dom';

export default function CreatureSearch() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-gray-500 hover:text-gray-700"
      >
        ◄ Back
      </button>
      <h1 className="text-2xl font-bold">Creature Search</h1>
      <p className="mt-2 text-gray-500">
        Search for D&amp;D creatures — implementation coming in Task 1.13.
      </p>
    </div>
  );
}
