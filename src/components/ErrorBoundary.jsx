import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/dashboard'
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="error-boundary">
        <div className="error-boundary-card">
          <p className="error-boundary-icon">⚠</p>
          <h2 className="error-boundary-title">Something went wrong</h2>
          <p className="error-boundary-msg">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <div className="error-boundary-actions">
            <button className="btn-primary" onClick={this.handleReset}>
              Go to Dashboard
            </button>
            <button className="btn-ghost" onClick={() => window.location.reload()}>
              Reload page
            </button>
          </div>
        </div>
      </div>
    )
  }
}
