import { useState } from "react";

export default function App() {
  const [code, setCode] = useState(`function authenticateUser(req, res) {
  var user = req.body.username;
  var pass = req.body.password;
  var query = "SELECT * FROM users WHERE username = '" + user + "' AND password = '" + pass + "'";
  var userRole = eval("req.body.role");
  return { query: query, role: userRole };
}`);
  const [language, setLanguage] = useState("javascript");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAudit = async () => {
    setLoading(true);
    setError(null);

    try {
      // const response = await fetch('http://localhost:5000/api/audit/review', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ code, language }),
      // });

      const response = await fetch("/api/audit/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Server status ${response.status}: ${errText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Audit Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.brand}>
          <span style={styles.logoBadge}>AI</span>
          <h1 style={styles.title}>
            DevAudit <span style={styles.accentText}>Studio</span>
          </h1>
        </div>
        <div style={styles.headerControls}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={styles.select}
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="csharp">C#</option>
          </select>
          <button
            onClick={handleAudit}
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Analyzing Code..." : "⚡ Audit Code"}
          </button>
        </div>
      </header>

      {/* Main Split Layout */}
      <main style={styles.splitLayout}>
        {/* Left Side: Code Input */}
        <section style={styles.pane}>
          <div style={styles.paneHeader}>
            <span style={styles.paneTitle}>Source Code</span>
            <span style={styles.tag}>Editor</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your source code here..."
            style={styles.editor}
            spellCheck="false"
          />
        </section>

        {/* Right Side: Audit Results */}
        <section style={{ ...styles.pane, borderLeft: "1px solid #2A2F3A" }}>
          <div style={styles.paneHeader}>
            <span style={styles.paneTitle}>Audit Report</span>
            {result && <span style={styles.tagSuccess}>Completed</span>}
          </div>

          <div style={styles.resultsContainer}>
            {loading && (
              <div style={styles.placeholderState}>
                <div style={styles.spinner}></div>
                <p>
                  Analyzing AST structure, security risks & optimization
                  paths...
                </p>
              </div>
            )}

            {error && (
              <div style={styles.errorBox}>
                <strong>Audit Error:</strong>
                <p>{error}</p>
              </div>
            )}

            {!loading && !result && !error && (
              <div style={styles.placeholderState}>
                <p>
                  Paste code on the left and click{" "}
                  <strong>⚡ Audit Code</strong> to run analysis.
                </p>
              </div>
            )}

            {!loading && result && (
              <div style={styles.reportContent}>
                {/* Summary */}
                <div style={styles.card}>
                  <h3 style={styles.cardHeader}>Overview</h3>
                  <p style={styles.summaryText}>{result.summary}</p>
                </div>

                {/* Vulnerabilities */}
                <div style={styles.card}>
                  <h3 style={{ ...styles.cardHeader, color: "#FF5555" }}>
                    Vulnerabilities Detected
                  </h3>
                  {result.vulnerabilities?.length > 0 ? (
                    <ul style={styles.list}>
                      {result.vulnerabilities.map((v, i) => (
                        <li key={i} style={styles.listItem}>
                          {v}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={styles.cleanText}>No vulnerabilities detected.</p>
                  )}
                </div>

                {/* Performance */}
                <div style={styles.card}>
                  <h3 style={{ ...styles.cardHeader, color: "#50FA7B" }}>
                    Performance & Quality
                  </h3>
                  {result.performanceFixes?.length > 0 ? (
                    <ul style={styles.list}>
                      {result.performanceFixes.map((p, i) => (
                        <li key={i} style={styles.listItem}>
                          {p}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={styles.cleanText}>
                      No performance issues identified.
                    </p>
                  )}
                </div>

                {/* Refactored Code */}
                <div style={styles.card}>
                  <h3 style={{ ...styles.cardHeader, color: "#8BE9FD" }}>
                    Refactored Output
                  </h3>
                  <pre style={styles.codeBlock}>{result.refactoredCode}</pre>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

// Inline Styles for Modern Minimalist Dark Theme
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#0F1117",
    color: "#E2E8F0",
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 24px",
    height: "60px",
    backgroundColor: "#161922",
    borderBottom: "1px solid #2A2F3A",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoBadge: {
    backgroundColor: "#6366F1",
    color: "#FFF",
    fontSize: "12px",
    fontWeight: "800",
    padding: "4px 8px",
    borderRadius: "6px",
    letterSpacing: "1px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "700",
    margin: 0,
    color: "#F8FAFC",
  },
  accentText: {
    color: "#818CF8",
    fontWeight: "400",
  },
  headerControls: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  select: {
    backgroundColor: "#1E222D",
    color: "#E2E8F0",
    border: "1px solid #33394B",
    borderRadius: "6px",
    padding: "8px 12px",
    fontSize: "13px",
    outline: "none",
    cursor: "pointer",
  },
  button: {
    backgroundColor: "#6366F1",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "6px",
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },
  splitLayout: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    flex: 1,
    height: "calc(100vh - 60px)",
  },
  pane: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backgroundColor: "#0F1117",
  },
  paneHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
    backgroundColor: "#161922",
    borderBottom: "1px solid #2A2F3A",
  },
  paneTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  tag: {
    fontSize: "11px",
    backgroundColor: "#1E222D",
    color: "#64748B",
    padding: "2px 8px",
    borderRadius: "4px",
  },
  tagSuccess: {
    fontSize: "11px",
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    color: "#4ADE80",
    padding: "2px 8px",
    borderRadius: "4px",
  },
  editor: {
    flex: 1,
    width: "100%",
    backgroundColor: "#0D0E12",
    color: "#F1F5F9",
    border: "none",
    padding: "20px",
    fontSize: "14px",
    fontFamily: '"Fira Code", "JetBrains Mono", Consolas, monospace',
    lineHeight: "1.6",
    outline: "none",
    resize: "none",
    boxSizing: "border-box",
  },
  resultsContainer: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
  },
  placeholderState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: "#64748B",
    textAlign: "center",
  },
  errorBox: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    border: "1px solid #EF4444",
    borderRadius: "8px",
    padding: "16px",
    color: "#FCA5A5",
  },
  reportContent: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  card: {
    backgroundColor: "#161922",
    borderRadius: "8px",
    border: "1px solid #2A2F3A",
    padding: "16px",
  },
  cardHeader: {
    fontSize: "14px",
    fontWeight: "600",
    margin: "0 0 10px 0",
    color: "#F8FAFC",
  },
  summaryText: {
    fontSize: "13px",
    color: "#CBD5E1",
    lineHeight: "1.5",
    margin: 0,
  },
  list: {
    margin: 0,
    paddingLeft: "20px",
  },
  listItem: {
    fontSize: "13px",
    color: "#CBD5E1",
    marginBottom: "6px",
    lineHeight: "1.5",
  },
  cleanText: {
    fontSize: "13px",
    color: "#64748B",
    margin: 0,
  },
  codeBlock: {
    backgroundColor: "#0D0E12",
    border: "1px solid #2A2F3A",
    borderRadius: "6px",
    padding: "12px",
    color: "#A5F3FC",
    fontSize: "13px",
    fontFamily: '"Fira Code", "JetBrains Mono", Consolas, monospace',
    overflowX: "auto",
    margin: 0,
  },
};
