import { useCallback, useEffect, useState } from 'react'

type ApiState = 'checking' | 'online' | 'offline'

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')

function App() {
  const [apiState, setApiState] = useState<ApiState>('checking')
  const [lastChecked, setLastChecked] = useState<string | null>(null)

  const checkBackend = useCallback(async () => {
    setApiState('checking')
    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/health`)
      if (!response.ok) throw new Error('Backend health check failed')
      setApiState('online')
    } catch {
      setApiState('offline')
    } finally {
      setLastChecked(new Date().toLocaleTimeString())
    }
  }, [])

  useEffect(() => {
    void checkBackend()
  }, [checkBackend])

  const statusCopy = {
    checking: 'Checking connection…',
    online: 'Backend is reachable',
    offline: 'Backend is not reachable',
  }[apiState]

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="QueueCare home">
          <span className="brand-mark" aria-hidden="true">Q</span>
          <span>QueueCare</span>
        </a>
        <span className="environment-label">Project setup</span>
      </header>

      <section className="welcome-card" aria-labelledby="welcome-title">
        <div className="eyebrow">Smarter clinic visits. Less waiting.</div>
        <h1 id="welcome-title">Your clinic queue, made clearer.</h1>
        <p className="intro">
          QueueCare is ready for the next setup step. This starter confirms that the patient-facing
          web app can reach its separately running API.
        </p>

        <div className={`connection-card connection-${apiState}`} role="status" aria-live="polite">
          <span className="connection-dot" aria-hidden="true" />
          <div className="connection-copy">
            <strong>{statusCopy}</strong>
            <span>API: {apiBaseUrl}</span>
            {lastChecked && <span>Last checked {lastChecked}</span>}
          </div>
          <button className="button button-secondary" onClick={() => void checkBackend()} disabled={apiState === 'checking'}>
            Check again
          </button>
        </div>
      </section>

      <section className="next-steps" aria-labelledby="next-title">
        <div>
          <div className="eyebrow">Starter milestone</div>
          <h2 id="next-title">The foundation is in place</h2>
          <p>Patient booking, queue management, and staff access will be added on top of this setup.</p>
        </div>
        <ol className="step-list">
          <li className="step-done"><span>1</span><div><strong>Separate apps</strong><small>Frontend and API have independent folders and run commands.</small></div></li>
          <li className={apiState === 'online' ? 'step-done' : ''}><span>2</span><div><strong>API connection</strong><small>Health check verifies the browser-to-backend path.</small></div></li>
          <li><span>3</span><div><strong>Clinic workflows</strong><small>Next: confirm clinic rules, then connect Supabase.</small></div></li>
        </ol>
      </section>

      <footer className="page-footer">QueueCare · A single-clinic queue management project</footer>
    </main>
  )
}

export default App

