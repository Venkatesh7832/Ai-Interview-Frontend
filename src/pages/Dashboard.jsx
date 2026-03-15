import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getSessionSummary, getRandomQuestions } from '../services/interviewService'
import { getUser } from '../utils/auth'
import Navbar from '../components/Navbar'


export default function Dashboard() {
  const user = getUser()
  const [summary, setSummary]     = useState(null)
  const [questions, setQuestions] = useState([])
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sum, qs] = await Promise.all([
          getSessionSummary(),
          getRandomQuestions(3),
        ])
        setSummary(sum)
        setQuestions(qs)
      } catch (err) {
        setError('Failed to load dashboard data.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const difficultyColor = { EASY: '#22c55e', MEDIUM: '#f59e0b', HARD: '#ef4444' }

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        {/* Hero greeting */}
        <section className="dash-hero">
          <div className="dash-hero-text">
            <p className="dash-greeting">Good session,</p>
            <h1 className="dash-name">{user?.name ?? 'Candidate'}</h1>
            <p className="dash-tagline">Your AI interview coach is ready.</p>
          </div>
          <Link to="/practice" className="btn-primary btn-large">
            Start Practice Session →
          </Link>
        </section>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Stats row */}
        {loading ? (
          <div className="skeleton-row">
            {[1,2,3].map(i => <div key={i} className="skeleton-card" />)}
          </div>
        ) : summary && (
          <section className="stats-row">
            <div className="stat-card">
              <span className="stat-card-value">{summary.totalAnswered}</span>
              <span className="stat-card-label">Questions Answered</span>
            </div>
            <div className="stat-card stat-card-accent">
              <span className="stat-card-value">{summary.averageScore?.toFixed(1) ?? '—'}</span>
              <span className="stat-card-label">Average Score</span>
            </div>
            <div className="stat-card">
              <span className="stat-card-value">{summary.highScoreCount}</span>
              <span className="stat-card-label">High Scores (≥80)</span>
            </div>
          </section>
        )}

        {/* Quick-start questions */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Quick Practice</h2>
            <Link to="/practice" className="section-link">See all →</Link>
          </div>

          {loading ? (
            <div className="question-list">
              {[1,2,3].map(i => <div key={i} className="skeleton-question" />)}
            </div>
          ) : (
            <div className="question-list">
              {questions.map(q => (
                <Link key={q.id} to={`/practice/${q.id}`} className="question-card">
                  <div className="question-card-meta">
                    <span className="q-category">{q.category}</span>
                    <span className="q-difficulty" style={{ color: difficultyColor[q.difficulty] }}>
                      {q.difficulty}
                    </span>
                  </div>
                  <p className="question-card-content">{q.content}</p>
                  <span className="question-card-cta">Answer →</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* CTA blocks */}
        <section className="cta-grid">
          <Link to="/practice" className="cta-block cta-practice">
            <span className="cta-icon">⚡</span>
            <div>
              <p className="cta-title">Practice by Category</p>
              <p className="cta-desc">Java, Spring, System Design, and more</p>
            </div>
          </Link>
          <Link to="/results" className="cta-block cta-results">
            <span className="cta-icon">📊</span>
            <div>
              <p className="cta-title">View All Results</p>
              <p className="cta-desc">Review AI feedback from past sessions</p>
            </div>
          </Link>
        </section>
      </main>
    </div>
  )
}
