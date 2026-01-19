import  { useState } from 'react';
import axios from 'axios';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { ShieldAlert, Zap, Code2, Play, Loader2 } from 'lucide-react';

export default function CodeAuditor() {
  const [code, setCode] = useState(`// Paste JavaScript/Node code here\nfunction sum(a, b) {\n  var result = eval(a + "+" + b);\n  return result;\n}`);
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);

  const handleAudit = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/audit/review', {
        code,
        language: 'javascript'
      });
      setAuditResult(response.data);
    } catch (err) {
      alert('Error running audit: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>DevAudit AI — Code Reviewer</h2>
      
      {/* Editor Section */}
      <div style={{ marginBottom: '15px' }}>
        <CodeEditor
          value={code}
          language="js"
          placeholder="Paste code here..."
          onChange={(ev) => setCode(ev.target.value)}
          padding={15}
          style={{
            fontSize: 14,
            backgroundColor: '#1e1e1e',
            borderRadius: '8px',
            fontFamily: 'ui-monospace,SFMono-Regular,Consolas,monospace'
          }}
        />
      </div>

      <button
        onClick={handleAudit}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        {loading ? <Loader2 style={{ animation: 'spin 1s linear infinite' }} size={18} /> : <Play size={18} />}
        {loading ? 'Analyzing Code...' : 'Run Security & Quality Audit'}
      </button>

      {/* Audit Output Results */}
      {auditResult && (
        <div style={{ marginTop: '25px', display: 'grid', gap: '15px' }}>
          {/* Summary */}
          <div style={{ padding: '15px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
            <h3>Executive Summary</h3>
            <p>{auditResult.summary}</p>
          </div>

          {/* Vulnerabilities */}
          <div style={{ padding: '15px', backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', borderRadius: '4px' }}>
            <h4 style={{ color: '#991b1b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldAlert size={20} /> Security Vulnerabilities
            </h4>
            <ul>
              {auditResult.vulnerabilities?.map((vuln, i) => <li key={i}>{vuln}</li>)}
            </ul>
          </div>

          {/* Performance Fixes */}
          <div style={{ padding: '15px', backgroundColor: '#f0fdf4', borderLeft: '4px solid #22c55e', borderRadius: '4px' }}>
            <h4 style={{ color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={20} /> Performance & Quality Fixes
            </h4>
            <ul>
              {auditResult.performanceFixes?.map((fix, i) => <li key={i}>{fix}</li>)}
            </ul>
          </div>

          {/* Refactored Code */}
          <div style={{ padding: '15px', backgroundColor: '#1e1e1e', color: '#fff', borderRadius: '8px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Code2 size={20} /> Suggested Refactored Code
            </h4>
            <pre style={{ overflowX: 'auto', color: '#4ade80' }}>
              <code>{auditResult.refactoredCode}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}