import { useState, useEffect } from 'react'
import queueCareLogo from '../../assets/queuecare-logo.svg'
import './PatientPanelPage.css'

export interface PatientData {
  tokenNumber: number
  patientName: string
  phoneNumber: string
  doctorName?: string
  room?: string
  clinicName?: string
}

interface PatientPanelProps {
  patient?: PatientData
  onNavigateHome: () => void
}

function PanelIcon({ name, size = 18 }: { name: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  }

  if (name === 'clock') return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 6v6l4 2" /></svg>
  if (name === 'queue') return <svg {...common}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  if (name === 'person') return <svg {...common}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
  if (name === 'check') return <svg {...common}><path d="m20 6-11 11-5-5" /></svg>
  if (name === 'bell') return <svg {...common}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" /></svg>
  if (name === 'bell-off') return <svg {...common}><path d="M13.73 21a2 2 0 0 1-3.46 0" /><path d="M18.63 13A17.89 17.89 0 0 1 18 8" /><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14" /><path d="M2 2l20 20" /></svg>
  if (name === 'share') return <svg {...common}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" /></svg>
  if (name === 'qr') return (
    <svg {...common}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3zM20 14v3M14 20h6" />
    </svg>
  )
  if (name === 'phone') return <svg {...common}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
  if (name === 'refresh') return <svg {...common}><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.19" /></svg>
  if (name === 'menu') return <svg {...common}><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></svg>
  if (name === 'close') return <svg {...common}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
  if (name === 'arrow-left') return <svg {...common}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
  if (name === 'alert') return <svg {...common}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
  return <svg {...common}><circle cx="12" cy="12" r="10" /></svg>
}

// Simulated active patient queue list with real-time statuses
interface QueueItem {
  tokenNumber: number
  status: 'consulting' | 'up-next' | 'waiting'
  location: string
  isYou?: boolean
  etaMinutes: number
}

export default function PatientPanelPage({
  patient = {
    tokenNumber: 19,
    patientName: 'Rahul Sharma',
    phoneNumber: '9876543210',
    doctorName: 'Dr. Sarah Jenkins',
    room: 'Room 2',
    clinicName: 'QueueCare Health Clinic',
  },
  onNavigateHome,
}: PatientPanelProps) {
  const [activeTab, setActiveTab] = useState<'queue' | 'ticket' | 'settings'>('queue')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [arrivedAtClinic, setArrivedAtClinic] = useState(false)
  const [delayRequested, setDelayRequested] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now')
  const [queueFilter, setQueueFilter] = useState<'all' | 'ahead'>('all')

  // Real-time clock for dynamic calculations
  const [currentTime, setCurrentTime] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Calculate dynamic times based on live clock
  const currentToken = 14
  const myToken = patient.tokenNumber || 19
  const patientsAhead = Math.max(0, myToken - currentToken - 1)
  const waitMinutes = Math.max(2, patientsAhead * 4 + 2)

  const etaCallDate = new Date(currentTime.getTime() + waitMinutes * 60 * 1000)
  const etaCallFormatted = etaCallDate.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  // Mock Concurrent Queue Database
  const initialQueueList: QueueItem[] = [
    { tokenNumber: 14, status: 'consulting', location: 'Inside Consultation (Room 2)', etaMinutes: 0 },
    { tokenNumber: 15, status: 'up-next', location: 'Waiting Lounge • Called to door', etaMinutes: 3 },
    { tokenNumber: 16, status: 'waiting', location: 'Waiting in Clinic Hall', etaMinutes: 7 },
    { tokenNumber: 17, status: 'waiting', location: 'SMS Alert Sent (En Route)', etaMinutes: 11 },
    { tokenNumber: 18, status: 'waiting', location: 'At Clinic • Checked In', etaMinutes: 14 },
    { tokenNumber: myToken, status: 'waiting', location: arrivedAtClinic ? 'At Clinic • Arrived' : 'Reserved via Mobile (You)', isYou: true, etaMinutes: waitMinutes },
    { tokenNumber: myToken + 1, status: 'waiting', location: 'Reserved via Web', etaMinutes: waitMinutes + 4 },
    { tokenNumber: myToken + 2, status: 'waiting', location: 'Reserved via Web', etaMinutes: waitMinutes + 8 },
  ]

  const filteredQueue = queueFilter === 'ahead' 
    ? initialQueueList.filter(item => item.tokenNumber <= myToken)
    : initialQueueList

  const handleRefresh = () => {
    setLastRefreshed('Just now')
    // Trigger visual spin/feedback
  }

  const handleShare = async () => {
    const shareText = `My QueueCare Token is #${myToken} for Dr. Sarah Jenkins (Room 2). Tracking live: ${window.location.href}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: `QueueCare Token #${myToken}`,
          text: shareText,
          url: window.location.href,
        })
      } catch {
        // User dismissed
      }
    } else {
      navigator.clipboard?.writeText(shareText)
      alert(`Token link copied to clipboard!\n\nToken #${myToken} • Dr. Sarah Jenkins`)
    }
  }

  return (
    <div className="patient-panel-shell">
      {/* Top Header / App Bar with Responsive Navigation */}
      <header className="panel-header">
        <div className="panel-header-inner">
          <div className="panel-brand-group">
            <button
              type="button"
              className="panel-back-btn"
              onClick={onNavigateHome}
              title="Return to Clinic Home"
            >
              <PanelIcon name="arrow-left" size={17} />
              <span className="back-text">Home</span>
            </button>

            <a href="#/panel" className="panel-logo-link">
              <img src={queueCareLogo} alt="QueueCare" className="panel-logo-img" />
            </a>

            <div className="panel-live-indicator">
              <span className="live-pulse-dot" />
              <span className="indicator-text">Desk Sync Live</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="panel-desktop-nav" aria-label="Patient Navigation">
            <button
              type="button"
              className={`panel-nav-btn ${activeTab === 'queue' ? 'active' : ''}`}
              onClick={() => setActiveTab('queue')}
            >
              <PanelIcon name="queue" size={16} />
              <span>Live Queue Board</span>
            </button>
            <button
              type="button"
              className={`panel-nav-btn ${activeTab === 'ticket' ? 'active' : ''}`}
              onClick={() => setActiveTab('ticket')}
            >
              <PanelIcon name="qr" size={16} />
              <span>My Token Pass</span>
            </button>
            <button
              type="button"
              className={`panel-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <PanelIcon name="bell" size={16} />
              <span>Alert Settings</span>
            </button>
          </nav>

          {/* Right Action Icons (Sound Toggle & Mobile Menu) */}
          <div className="panel-header-actions">
            <button
              type="button"
              className={`sound-toggle-btn ${soundEnabled ? 'sound-on' : 'sound-off'}`}
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Call Chime Sound Enabled' : 'Muted'}
            >
              <PanelIcon name={soundEnabled ? 'bell' : 'bell-off'} size={16} />
              <span className="sound-label">{soundEnabled ? 'Sound On' : 'Muted'}</span>
            </button>

            <button
              type="button"
              className="panel-mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <PanelIcon name={mobileMenuOpen ? 'close' : 'menu'} size={22} />
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer Menu */}
        {mobileMenuOpen && (
          <div className="panel-mobile-drawer">
            <div className="mobile-drawer-user">
              <div className="drawer-avatar">
                <PanelIcon name="person" size={20} />
              </div>
              <div className="drawer-user-meta">
                <strong>{patient.patientName}</strong>
                <span>+91 {patient.phoneNumber}</span>
              </div>
            </div>

            <nav className="mobile-drawer-links">
              <button
                type="button"
                className={`drawer-link ${activeTab === 'queue' ? 'active' : ''}`}
                onClick={() => { setActiveTab('queue'); setMobileMenuOpen(false); }}
              >
                <PanelIcon name="queue" size={18} />
                <span>Live Queue Board</span>
              </button>
              <button
                type="button"
                className={`drawer-link ${activeTab === 'ticket' ? 'active' : ''}`}
                onClick={() => { setActiveTab('ticket'); setMobileMenuOpen(false); }}
              >
                <PanelIcon name="qr" size={18} />
                <span>My Token Pass</span>
              </button>
              <button
                type="button"
                className={`drawer-link ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
              >
                <PanelIcon name="bell" size={18} />
                <span>SMS Alert Settings</span>
              </button>
              <button
                type="button"
                className="drawer-link drawer-exit"
                onClick={onNavigateHome}
              >
                <PanelIcon name="arrow-left" size={18} />
                <span>Exit Patient Panel</span>
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Patient Panel Body */}
      <main className="panel-main-content">
        <div className="panel-container">
          
          {/* Top Info Banner: Assigned Clinic & Session Pace */}
          <div className="clinic-status-banner">
            <div className="clinic-banner-left">
              <div className="doctor-badge-avatar">
                <PanelIcon name="person" size={20} />
              </div>
              <div className="doctor-info-text">
                <div className="clinic-kicker-row">
                  <span className="clinic-kicker">ASSIGNED CLINIC ROOM</span>
                  <span className="clinic-active-pill">
                    <span className="live-pulse-dot-sm" />
                    Doctor In Session
                  </span>
                </div>
                <h1 className="panel-doctor-title">{patient.doctorName || 'Dr. Sarah Jenkins'}</h1>
                <p className="panel-clinic-sub">
                  Room 2 • QueueCare Health Clinic • Today: 10:00 AM – 2:00 PM
                </p>
              </div>
            </div>

            <div className="clinic-banner-right">
              <button
                type="button"
                className="panel-refresh-btn"
                onClick={handleRefresh}
                title="Refresh Live Queue"
              >
                <PanelIcon name="refresh" size={15} />
                <span>Synced {lastRefreshed}</span>
              </button>
            </div>
          </div>

          {/* Grid Layout: Left Column = Patient Token & Actions | Right Column = Live Queue Board */}
          <div className="panel-content-grid">
            
            {/* COLUMN 1: Your Assigned Token & Real-time Live Status */}
            <div className="panel-col-primary">
              {/* Token Hero Card */}
              <div className="patient-token-hero-card">
                <div className="token-card-top">
                  <div className="token-identity">
                    <span className="patient-greeting">WELCOME</span>
                    <h2 className="patient-display-name">{patient.patientName}</h2>
                    <span className="patient-mobile-badge">+91 {patient.phoneNumber}</span>
                  </div>
                  <div className="token-status-pill waiting">
                    <span className="status-dot-gold" />
                    <span>In Queue</span>
                  </div>
                </div>

                <div className="token-number-hero">
                  <span className="token-hash-label">YOUR TOKEN</span>
                  <strong className="token-massive-number">#{myToken}</strong>
                  <span className="token-room-tag">Room 2 • General Consultation</span>
                </div>

                {/* Live Real-Time Queue Metrics */}
                <div className="token-metrics-grid">
                  <div className="metric-box">
                    <span className="metric-box-label">Now Serving</span>
                    <strong className="metric-box-val highlight-teal">Token #{currentToken}</strong>
                    <span className="metric-box-sub">In Room 2</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-box-label">Ahead of You</span>
                    <strong className="metric-box-val">{patientsAhead} Patients</strong>
                    <span className="metric-box-sub">Waiting turn</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-box-label">Est. Call Time</span>
                    <strong className="metric-box-val highlight-amber">~{etaCallFormatted}</strong>
                    <span className="metric-box-sub">Approx {waitMinutes}m wait</span>
                  </div>
                </div>

                {/* Queue Position Progress Bar */}
                <div className="panel-progress-section">
                  <div className="progress-labels-row">
                    <span>Token #{currentToken} (Current)</span>
                    <span className="progress-target">You (#{myToken})</span>
                  </div>
                  <div className="panel-progress-track">
                    <div
                      className="panel-progress-fill"
                      style={{ width: `${Math.min(95, Math.max(15, 100 - (patientsAhead * 15)))}%` }}
                    />
                  </div>
                  <div className="progress-foot-note">
                    <PanelIcon name="clock" size={13} />
                    <span>Average consultation pace: 4 to 6 mins per patient</span>
                  </div>
                </div>

                {/* Real-time Patient Action Controls */}
                <div className="patient-quick-actions">
                  <button
                    type="button"
                    className={`btn-action-checkin ${arrivedAtClinic ? 'arrived' : ''}`}
                    onClick={() => setArrivedAtClinic(!arrivedAtClinic)}
                  >
                    <PanelIcon name="check" size={16} />
                    <span>{arrivedAtClinic ? '✓ Marked as Arrived at Clinic' : 'I Have Arrived at Clinic'}</span>
                  </button>

                  <button
                    type="button"
                    className={`btn-action-hold ${delayRequested ? 'held' : ''}`}
                    onClick={() => setDelayRequested(!delayRequested)}
                  >
                    <PanelIcon name="clock" size={16} />
                    <span>{delayRequested ? '✓ Desk Notified: Running 5m Late' : 'Running 5 Mins Late? Hold Slot'}</span>
                  </button>

                  <button
                    type="button"
                    className="btn-action-share"
                    onClick={handleShare}
                  >
                    <PanelIcon name="share" size={16} />
                    <span>Share Pass via WhatsApp / SMS</span>
                  </button>
                </div>
              </div>

              {/* Real-Time SMS Alert Card */}
              <div className="panel-sms-card">
                <div className="sms-card-icon">
                  <PanelIcon name="bell" size={20} />
                </div>
                <div className="sms-card-text">
                  <h4>Automated Arrival Alert Active</h4>
                  <p>
                    We will send an SMS to <strong>+91 {patient.phoneNumber}</strong> the moment Token #{myToken - 2} enters the consultation room, so you can walk directly inside without hall congestion.
                  </p>
                </div>
              </div>
            </div>

            {/* COLUMN 2: Concurrent Queue System & Live Waiting List */}
            <div className="panel-col-secondary">
              <div className="concurrent-queue-card">
                
                {/* Active Consultation Spotlight */}
                <div className="currently-serving-spotlight">
                  <div className="spotlight-badge">
                    <span className="live-pulse-dot" />
                    <span>NOW WITH DOCTOR IN ROOM 2</span>
                  </div>
                  
                  <div className="spotlight-content">
                    <div className="spotlight-token-side">
                      <span className="spotlight-sub">Active Consultation</span>
                      <strong className="spotlight-number">Token #{currentToken}</strong>
                    </div>
                    <div className="spotlight-details">
                      <div className="spotlight-detail-row">
                        <PanelIcon name="person" size={14} />
                        <span>Doctor: <strong>{patient.doctorName || 'Dr. Sarah Jenkins'}</strong></span>
                      </div>
                      <div className="spotlight-detail-row">
                        <PanelIcon name="clock" size={14} />
                        <span>Entered consultation ~4 mins ago</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Waiting Patients Header & Filter */}
                <div className="queue-list-header">
                  <div className="queue-list-title-side">
                    <h3>Live Queue Waiting List</h3>
                    <span className="queue-count-pill">{filteredQueue.length} Active Tokens</span>
                  </div>

                  <div className="queue-filter-buttons">
                    <button
                      type="button"
                      className={`filter-btn ${queueFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setQueueFilter('all')}
                    >
                      All in Queue
                    </button>
                    <button
                      type="button"
                      className={`filter-btn ${queueFilter === 'ahead' ? 'active' : ''}`}
                      onClick={() => setQueueFilter('ahead')}
                    >
                      Ahead of You ({patientsAhead})
                    </button>
                  </div>
                </div>

                {/* Queue Table / List showing every person in line */}
                <div className="queue-items-container">
                  {filteredQueue.map((item) => {
                    const isConsulting = item.status === 'consulting'
                    const isUpNext = item.status === 'up-next'
                    const isUserToken = item.isYou

                    return (
                      <div
                        key={item.tokenNumber}
                        className={`queue-patient-row ${isUserToken ? 'is-user-token' : ''} ${isConsulting ? 'is-consulting' : ''}`}
                      >
                        {/* Token Number Box */}
                        <div className="queue-row-token">
                          <span className="row-token-hash">Token</span>
                          <strong className="row-token-num">#{item.tokenNumber}</strong>
                        </div>

                        {/* Patient & Position Details */}
                        <div className="queue-row-info">
                          <div className="row-title-line">
                            {isUserToken ? (
                              <strong className="row-patient-name text-teal">
                                {patient.patientName} (YOU)
                              </strong>
                            ) : (
                              <span className="row-patient-anonymous">
                                Patient Token #{item.tokenNumber}
                              </span>
                            )}
                            
                            {/* Badges */}
                            {isConsulting && <span className="status-badge badge-consulting">In Room 2</span>}
                            {isUpNext && <span className="status-badge badge-upnext">Up Next</span>}
                            {isUserToken && <span className="status-badge badge-you">Your Turn</span>}
                          </div>

                          <div className="row-location-line">
                            <span>{item.location}</span>
                          </div>
                        </div>

                        {/* Estimated Call / ETA Side */}
                        <div className="queue-row-eta">
                          {isConsulting ? (
                            <span className="eta-active">Consulting</span>
                          ) : (
                            <div className="eta-calc-box">
                              <span className="eta-calc-time">~{item.etaMinutes}m wait</span>
                              <span className="eta-clock">
                                {new Date(currentTime.getTime() + item.etaMinutes * 60 * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Queue Footer with Confidentiality Note */}
                <div className="queue-list-footer">
                  <PanelIcon name="alert" size={15} />
                  <span>
                    Medical Confidentiality: Patient medical histories and private diagnoses are never displayed on public queue screens.
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Mobile Bottom Quick Navigation Bar */}
      <footer className="panel-mobile-bottom-nav">
        <button
          type="button"
          className={`mobile-tab-btn ${activeTab === 'queue' ? 'active' : ''}`}
          onClick={() => setActiveTab('queue')}
        >
          <PanelIcon name="queue" size={18} />
          <span>Queue Board</span>
        </button>

        <button
          type="button"
          className={`mobile-tab-btn ${activeTab === 'ticket' ? 'active' : ''}`}
          onClick={() => setActiveTab('ticket')}
        >
          <PanelIcon name="qr" size={18} />
          <span>Token #{myToken}</span>
        </button>

        <button
          type="button"
          className={`mobile-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <PanelIcon name="bell" size={18} />
          <span>Alerts</span>
        </button>

        <button
          type="button"
          className="mobile-tab-btn"
          onClick={onNavigateHome}
        >
          <PanelIcon name="arrow-left" size={18} />
          <span>Exit</span>
        </button>
      </footer>
    </div>
  )
}
