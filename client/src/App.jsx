import { useState } from 'react';

export default function App() {
  const [code, setCode] = useState(`function authenticateUser(req, res) {
  var user = req.body.username;
  var pass = req.body.password;
  var query = "SELECT * FROM users WHERE username = '" + user + "' AND password = '" + pass + "'";
  var userRole = eval("req.body.role");
  return { query: query, role: userRole };
}`);
  const [language, setLanguage] = useState('javascript');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAudit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/audit/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Server returned ${response.status}: ${errText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Audit Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h2>DevAudit AI — Code Security & Quality Auditor</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <label><strong>Language: </strong></label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ padding: '5px' }}>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="csharp">C#</option>
        </select>
      </div>

      <textarea
        rows={10}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{ width: '100%', fontFamily: 'monospace', padding: '10px', fontSize: '14px' }}
      />

      <br />
      <button 
        onClick={handleAudit} 
        disabled={loading}
        style={{ marginTop: '15px', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        {loading ? 'Auditing Code...' : 'Run Security & Quality Audit'}
      </button>

      {error && (
        <div style={{ color: 'red', marginTop: '20px', padding: '10px', border: '1px solid red' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: '30px', background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
          <h3>Audit Results</h3>
          <p><strong>Summary:</strong> {result.summary}</p>
          
          <h4>Vulnerabilities Identified:</h4>
          <ul>
            {result.vulnerabilities?.map((v, i) => <li key={i}>{v}</li>)}
          </ul>

          <h4>Performance & Refactoring Recommendations:</h4>
          <ul>
            {result.performanceFixes?.map((p, i) => <li key={i}>{p}</li>)}
          </ul>

          <h4>Refactored Code:</h4>
          <pre style={{ background: '#222', color: '#fff', padding: '15px', borderRadius: '5px', overflowX: 'auto' }}>
            {result.refactoredCode}
          </pre>
        </div>
      )}
    </div>
  );
}