import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  getAllQuestions, getQuestionById, submitAnswer,
  getAIFollowUp, CATEGORIES, DIFFICULTIES
} from '../services/interviewService'
import Navbar from '../components/Navbar'

export default function Practice() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [questions, setQuestions]   = useState([])
  const [selected, setSelected]     = useState(null)
  const [answer, setAnswer]         = useState('')
  const [result, setResult]         = useState(null)
  const [followUp, setFollowUp]     = useState('')
  const [loading, setLoading]       = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState('')
  const [filterCat, setFilterCat]   = useState('ALL')
  const [filterDiff, setFilterDiff] = useState('ALL')

  useEffect(() => {
    getAllQuestions()
      .then(setQuestions)
      .catch(() => setError('Failed to load questions.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (id && questions.length) {
      const q = questions.find(q => String(q.id) === id)
      if (q) { setSelected(q); setResult(null); setAnswer(''); setFollowUp('') }
    }
  }, [id, questions])

  const filtered = questions.filter(q =>
    (filterCat  === 'ALL' || q.category   === filterCat)  &&
    (filterDiff === 'ALL' || q.difficulty === filterDiff)
  )

  const selectQuestion = (q) => {
    setSelected(q)
    setResult(null)
    setAnswer('')
    setFollowUp('')
    navigate(`/practice/${q.id}`, { replace: true })
  }

  const handleSubmit = async () => {
    if (!answer.trim()) return
    setSubmitting(true)
    setError('')
    try {
      const res = await submitAnswer(selected.id, answer)
      setResult(res)
    } catch {
      setError('Failed to submit answer. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleFollowUp = async () => {
    setFollowUp('Loading follow-up...')
    try {
      const { followUp: fu } = await getAIFollowUp(selected.content, answer)
      setFollowUp(fu)
    } catch {
      setFollowUp('Could not generate follow-up question.')
    }
  }

  
  const [time, setTime] = useState(120)

  useEffect(() => {

    if (time === 0) return

    const timer = setInterval(() => {
      setTime(t => t - 1)
    }, 1000)

    return () => clearInterval(timer)

  }, [time])

  ///
  useEffect(() => {

    if (time === 0 && answer.trim()) {
      handleSubmit()
    }

  }, [time])

  const scoreColor = (s) => s >= 80 ? '#22c55e' : s >= 50 ? '#f59e0b' : '#ef4444'
  const diffColor  = { EASY: '#22c55e', MEDIUM: '#f59e0b', HARD: '#ef4444' }

  return (
    <div className="app-layout">
      <Navbar />
      <div className="practice-layout">

        {/* ── Sidebar ── */}
        <aside className="practice-sidebar">
          <div className="sidebar-filters">
            <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="filter-select">
              <option value="ALL">All Categories</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <select value={filterDiff} onChange={e => setFilterDiff(e.target.value)} className="filter-select">
              <option value="ALL">All Levels</option>
              {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>

          <p className="sidebar-count">{filtered.length} question{filtered.length !== 1 ? 's' : ''}</p>

          <div className="sidebar-list">
            {loading
              ? [1,2,3,4,5].map(i => <div key={i} className="skeleton-sidebar-item" />)
              : filtered.map(q => (
                <button
                  key={q.id}
                  className={`sidebar-item ${selected?.id === q.id ? 'sidebar-item-active' : ''}`}
                  onClick={() => selectQuestion(q)}
                >
                  <span className="sidebar-item-diff" style={{ color: diffColor[q.difficulty] }}>●</span>
                  <span className="sidebar-item-text">{q.content}</span>
                </button>
              ))
            }
          </div>
        </aside>

        {/* ── Main panel ── */}
        <main className="practice-main">
          {!selected ? (
            <div className="practice-empty">
              <p className="practice-empty-icon">◈</p>
              <p className="practice-empty-text">Select a question to begin</p>
            </div>
          ) : (
            <div className="practice-session">
              <div className="practice-question-header">
                <span className="q-category">{selected.category}</span>
                <span className="q-difficulty" style={{ color: diffColor[selected.difficulty] }}>
                  {selected.difficulty}
                </span>
              </div>

              <h2 className="practice-question-text">{selected.content}</h2>
              <div className="practice-timer">
                ⏱ Time Remaining: {time}s
              </div>

              {error && <div className="alert alert-error">{error}</div>}

              {!result ? (
                <>
                  <textarea
                    className="answer-textarea"
                    placeholder="Type your answer here. Be thorough — the AI evaluates depth, accuracy, and clarity."
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    rows={10}
                  />
                  <div className="practice-actions">
                    <span className="char-count">{answer.length} characters</span>
                    <button
                      className="btn-primary"
                      onClick={handleSubmit}
                      disabled={submitting || !answer.trim()}
                    >
                      {submitting ? <><span className="spinner" /> Evaluating…</> : 'Submit for AI Review'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="result-panel">
                  {/* Score */}
                  <div className="score-ring-wrapper">
                    <svg viewBox="0 0 100 100" className="score-ring">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="8"/>
                      <circle
                        cx="50" cy="50" r="42" fill="none"
                        stroke={scoreColor(result.score)} strokeWidth="8"
                        strokeDasharray={`${result.score * 2.638} 263.8`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="score-ring-label">
                      <span className="score-value" style={{ color: scoreColor(result.score) }}>
                        {result.score}
                      </span>
                      <span className="score-unit">/100</span>
                    </div>
                  </div>

                  {/* Feedback */}
                  <div className="feedback-block">
                    <h3 className="feedback-title">AI Feedback</h3>
                    <p className="feedback-text">{result.aiFeedback}</p>
                  </div>

                  {/* Your answer */}
                  <div className="feedback-block">
                    <h3 className="feedback-title">Your Answer</h3>
                    <p className="feedback-text answer-review">{result.userAnswer}</p>
                  </div>

                  {/* Follow-up */}
                  {!followUp ? (
                    <button className="btn-secondary" onClick={handleFollowUp}>
                      Generate Follow-up Question
                    </button>
                  ) : (
                    <div className="followup-block">
                      <p className="followup-label">Follow-up</p>
                      <p className="followup-text">{followUp}</p>
                    </div>
                  )}

                  <button className="btn-ghost" onClick={() => { setResult(null); setAnswer(''); setFollowUp('') }}>
                    ← Try again
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

