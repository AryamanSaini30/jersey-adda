import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { listJerseys } from '../api/jerseys';
import JerseyCard from '../components/JerseyCard';
import { Search, Filter } from 'lucide-react';
import { matchesClubFilter } from '../utils/clubs';

export default function CatalogPage() {
  const [jerseys, setJerseys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse query params for initial state
  const queryParams = new URLSearchParams(location.search);
  const initialTeam = queryParams.get('team') || 'All';
  const initialClub = queryParams.get('club') || 'All';
  const initialSearch = queryParams.get('search') || '';

  const [search, setSearch] = useState(initialSearch);
  const [team, setTeam] = useState(initialTeam);
  const [club, setClub] = useState(initialClub);

  useEffect(() => {
    let active = true;
    async function fetchJerseys() {
      setLoading(true);
      setError('');
      try {
        const response = await listJerseys();
        if (!active) return;
        setJerseys(Array.isArray(response.data?.items) ? response.data.items : []);
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Failed to load jerseys');
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchJerseys();
    return () => { active = false; };
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (team !== 'All') params.set('team', team);
    if (club !== 'All') params.set('club', club);
    
    navigate({ search: params.toString() }, { replace: true });
  }, [search, team, club, navigate]);

  const teams = ['All', ...new Set(jerseys.map((jersey) => jersey.team_name).filter(Boolean))];

  const filtered = jerseys.filter((jersey) => {
    const matchesSearch = [jersey.name, jersey.team_name, jersey.league_name, jersey.description]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesTeam = team === 'All' || jersey.team_name === team;
    const matchesClub = club === 'All' || matchesClubFilter(jersey, club);
    return matchesSearch && matchesTeam && matchesClub;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Complete Catalog</h1>
        <p className="text-gray-500 mb-8 max-w-3xl text-lg">
          Browse our entire collection. Search by team, player, or browse through all available options to find your perfect match.
        </p>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
              placeholder="Search jerseys..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="relative md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Filter className="w-5 h-5" />
            </div>
            <select 
              value={team} 
              onChange={(event) => setTeam(event.target.value)}
              className="block w-full pl-10 pr-8 py-3 border border-gray-300 rounded-xl leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all appearance-none cursor-pointer"
            >
              {teams.map((option) => (
                <option key={option} value={option}>
                  {option === 'All' ? 'All Teams' : option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-end">
        <h2 className="text-2xl font-bold text-gray-900">
          {loading ? 'Loading jerseys...' : `${filtered.length} jerseys available`}
        </h2>
      </div>

      {error && <p className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-2">No matches found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search or filters.</p>
          <button onClick={() => { setSearch(''); setTeam('All'); }} className="btn-primary">
            Clear Filters
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
        {filtered.map((jersey) => (
          <JerseyCard key={jersey.id} jersey={jersey} />
        ))}
      </div>
    </main>
  );
}
