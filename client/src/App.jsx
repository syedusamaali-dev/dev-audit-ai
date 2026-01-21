import { useEffect, useState } from 'react';

export default function App() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/gemini/models')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch models from backend server.');
        return res.json();
      })
      .then((data) => {
        // Fallback to empty array if response is malformed
        const fetchedModels = Array.isArray(data.models) ? data.models : [];
        setModels(fetchedModels);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Client Fetch Error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ padding: '20px' }}>Loading Gemini models...</p>;
  if (error) return <p style={{ padding: '20px', color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Available Gemini API Models</h2>
      <ul>
        {Array.isArray(models) && models.length > 0 ? (
          models.map((m, index) => (
            <li key={m.name || index} style={{ marginBottom: '8px' }}>
              <strong>{m.displayName || m.name}</strong> <code>({m.name})</code>
            </li>
          ))
        ) : (
          <p>No models returned from API.</p>
        )}
      </ul>
    </div>
  );
}