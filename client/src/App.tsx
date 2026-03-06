import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import RulesLookup from './components/RulesLookup';
import CreatureSearch from './components/CreatureSearch';
import NPCGenerator from './components/NPCGenerator';
import MagicItemGenerator from './components/MagicItemGenerator';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/rules" element={<RulesLookup />} />
        <Route path="/creatures" element={<CreatureSearch />} />
        <Route path="/npcs" element={<NPCGenerator />} />
        <Route path="/items" element={<MagicItemGenerator />} />
      </Routes>
    </div>
  );
}
