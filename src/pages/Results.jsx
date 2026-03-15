import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyResults } from '../services/interviewService'
import Navbar from '../components/Navbar'

export default function Results() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    getMyResults()
      .then(setResults)
      .catch(() => setError('Failed to load results.'))
      .finally(() => setLoading(false))
  }, [])

  const scoreColor = (s) => s >= 80 ? '#22c55e' : s >= 50 ? '#f59e0b' : '#ef4444'
  const diffColor  = { EASY: '#22c55e', MEDIUM: '#f59e0b', HARD: '#ef4444' }

  const fmt = (dt) => dt
    ? new Date(dt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">My Results</h1>
          <Link to="/practice" className="btn-primary">+ New Session</Link>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="question-list">
            {[1,2,3].map(i => <div key={i} className="skeleton-question" />)}
          </div>
        ) : results.length === 0 ? (
          <div className="empty-state">
            <p className="empty-icon">📋</p>
            <p className="empty-text">No results yet. <Link to="/practice">Start practicing →</Link></p>
          </div>
        ) : (
          <div className="results-list">
            {results.map(r => (
              <div key={r.resultId} className="result-card">
                <div className="result-card-left">
                  <div className="result-meta">
                    <span className="q-category">{r.category}</span>
                    <span className="q-difficulty" style={{ color: diffColor[r.difficulty] }}>
                      {r.difficulty}
                    </span>
                    <span className="result-date">{fmt(r.submittedAt)}</span>
                  </div>
                  <p className="result-question">{r.questionContent}</p>
                  <p className="result-feedback-preview">
                    {r.aiFeedback?.slice(0, 160)}{r.aiFeedback?.length > 160 ? '…' : ''}
                  </p>
                </div>
                <div className="result-card-right">
                  <div className="result-score" style={{ color: scoreColor(r.score) }}>
                    {r.score}
                    <span className="result-score-unit">/100</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
