import { useNavigate } from 'react-router-dom';

export default function RulesLookup() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-gray-500 hover:text-gray-700"
      >
        ◄ Back
      </button>
      <h1 className="text-2xl font-bold">Rules Lookup</h1>
      <p className="mt-2 text-gray-500">
        Ask any D&amp;D 5e rules question — implementation coming in Task 1.7.
      </p>
    </div>
  );
}
