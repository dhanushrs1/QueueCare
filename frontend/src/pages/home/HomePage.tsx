import { useEffect, useState, type FormEvent } from 'react'
import queueCareLogo from '../../assets/queuecare-logo.svg'
import type { PatientData } from '../panel/PatientPanelPage'
import './HomePage.css'

type DialogName = 'book' | 'track' | 'privacy' | null

interface HomePageProps {
  onNavigatePanel?: (patientData?: Partial<PatientData>) => void
}

function Icon({ name, size = 18 }: { name: string; size?: number }) {
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

  if (name === 'calendar') return <svg {...common}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
  if (name === 'clock') return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 6v6l4 2" /></svg>
  if (name === 'shield') return <svg {...common}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
  if (name === 'arrow') return <svg {...common}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
  if (name === 'check') return <svg {...common}><path d="m20 6-11 11-5-5" /></svg>
  if (name === 'phone') return <svg {...common}><rect x="5" y="2" width="14" height="20" rx="3" /><path d="M12 18h.01" /></svg>
  if (name === 'bell') return <svg {...common}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" /></svg>
  if (name === 'person') return <svg {...common}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
  if (name === 'queue') return <svg {...common}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  if (name === 'sparkles') return <svg {...common}><path d="m12 3 1.91 5.89L20 10.8l-4.75 4.3 1.45 6.4-4.7-3.08-4.7 3.08 1.45-6.4L4 10.8l6.09-1.91L12 3z" /></svg>
  if (name === 'pulse') return <svg {...common}><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
  if (name === 'plus') return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>
  if (name === 'minus') return <svg {...common}><path d="M5 12h14" /></svg>
  if (name === 'message') return <svg {...common}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
  if (name === 'lock') return <svg {...common}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
  if (name === 'cellular') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="3" y="16" width="3" height="5" rx="1" />
      <rect x="8" y="12" width="3" height="9" rx="1" />
      <rect x="13" y="8" width="3" height="13" rx="1" />
      <rect x="18" y="4" width="3" height="17" rx="1" />
    </svg>
  )
  if (name === 'wifi') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <circle cx="12" cy="19.5" r="1" fill="currentColor" />
    </svg>
  )
  if (name === 'battery') return (
    <svg width={size + 7} height={size} viewBox="0 0 26 14" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="20" height="12" rx="3.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="3" width="13" height="8" rx="2" fill="currentColor" />
      <path d="M23 5v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
  return <svg {...common}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
}

// 4 Steps for the Interactive Patient Journey concept (Zero Department Mentions)
const JOURNEY_STEPS = [
  {
    id: 1,
    title: 'Reserve Your Token',
    subtitle: 'Enter name & mobile in 15 seconds',
    tag: 'Step 01 • Reserve',
    description: 'Enter your name and phone number to see today’s clinic schedule, current queue load, and reserve your slot.',
    previewType: 'clinic-picker',
  },
  {
    id: 2,
    title: 'Instant SMS Token Pass',
    subtitle: 'Zero paper slips, 100% digital',
    tag: 'Step 02 • Confirm',
    description: 'Verify with secure OTP and receive your official token number and live tracking link via SMS. No app download needed.',
    previewType: 'sms-alert',
  },
  {
    id: 3,
    title: 'Live Tracking from Anywhere',
    subtitle: 'Relax at home, café, or work',
    tag: 'Step 03 • Monitor',
    description: 'Watch the live doctor queue ticker advance in real time. We calculate exact consultation paces for high arrival accuracy.',
    previewType: 'live-meter',
  },
  {
    id: 4,
    title: 'Direct Walk-In On Time',
    subtitle: 'Zero waiting hall congestion',
    tag: 'Step 04 • Consult',
    description: 'Receive an automated notification when 2 patients remain ahead. Arrive and step directly into Room 2 for your visit.',
    previewType: 'walk-in',
  },
]

// Frequently Asked Questions (Single Doctor Clinic Context)
const FAQS = [
  {
    question: 'How do I know when to leave my home or office?',
    answer:
      'QueueCare monitors the doctor’s real-time consultation pace. Our live tracker displays both the current active token and your estimated call time. We recommend leaving when there are 2 to 3 patients ahead of your number.',
  },
  {
    question: 'Do I need to download an app or create an account?',
    answer:
      'No app download is needed. When you book a token and verify your OTP, you get instant access to your Patient Panel and receive an SMS with a direct tracking link.',
  },
  {
    question: 'What happens if I arrive a few minutes late?',
    answer:
      'If your token is called while you are still en route, the clinic reception desk can hold your position or place you in the immediate next slot upon arrival without requiring a new booking.',
  },
  {
    question: 'Is my personal health information displayed publicly?',
    answer:
      'No. Public clinic waiting screens display anonymous token numbers only (e.g. Token #14). Your medical history, phone number, and diagnosis remain completely confidential.',
  },
  {
    question: 'Can I book a token for a family member or child?',
    answer:
      'Yes. You can reserve tokens for family members under your mobile number by simply typing the patient’s name during booking.',
  },
]

function HomePage({ onNavigatePanel }: HomePageProps) {
  const [dialog, setDialog] = useState<DialogName>(null)
  const [phoneViewMode, setPhoneViewMode] = useState<'booked' | 'new-patient'>('booked')
  const [activeStepId, setActiveStepId] = useState<number>(1)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  // Booking & OTP State
  const [bookingStage, setBookingStage] = useState<'form' | 'otp'>('form')
  const [patientName, setPatientName] = useState('Rahul Sharma')
  const [patientPhone, setPatientPhone] = useState('9876543210')
  const [otpValue, setOtpValue] = useState('')
  const [otpError, setOtpError] = useState('')
  const assignedToken = 19

  // Track search query
  const [trackQuery, setTrackQuery] = useState('')
  const [trackError, setTrackError] = useState('')

  // Live Real-Time Clock for Phone Mockup
  const [currentTime, setCurrentTime] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Format real iOS-style status bar time (e.g. "9:45" or "10:15")
  const phoneTime = (() => {
    const h = currentTime.getHours() % 12 || 12
    const m = currentTime.getMinutes().toString().padStart(2, '0')
    return `${h}:${m}`
  })()

  // Format real estimated consultation call time (12 mins from now)
  const etaCall = (() => {
    const callTime = new Date(currentTime.getTime() + 12 * 60 * 1000)
    return callTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
  })()

  // Format real estimated arrival for next available token (18 mins from now)
  const etaArrival = (() => {
    const arrival = new Date(currentTime.getTime() + 18 * 60 * 1000)
    return arrival.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
  })()

  useEffect(() => {
    if (!dialog) return
    const closeOnEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') setDialog(null) }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [dialog])

  const openBookDialog = () => {
    setBookingStage('form')
    setOtpValue('')
    setOtpError('')
    setDialog('book')
  }

  const openTrackDialog = () => {
    setTrackQuery('')
    setTrackError('')
    setDialog('track')
  }

  // Handle Form Submit -> Go to OTP Verification
  const handleDetailsSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!patientName.trim() || patientPhone.length < 10) return
    setOtpError('')
    setOtpValue('')
    setBookingStage('otp')
  }

  // Handle OTP Submit -> Directly Redirect to Dedicated Patient Panel (NO POPUP!)
  const handleOtpVerify = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (otpValue.length < 4) {
      setOtpError('Please enter a valid 4-digit verification code.')
      return
    }
    setOtpError('')
    setDialog(null) // Close popup dialog completely!
    setPhoneViewMode('booked')

    if (onNavigatePanel) {
      onNavigatePanel({
        tokenNumber: assignedToken || 19,
        patientName: patientName.trim() || 'Rahul Sharma',
        phoneNumber: patientPhone,
        doctorName: 'Dr. Sarah Jenkins',
        room: 'Room 2',
        clinicName: 'QueueCare Health Clinic',
      })
    } else {
      window.location.hash = '#/panel'
    }
  }

  // Handle Track Token Submit -> Directly Redirect to Dedicated Patient Panel (NO POPUP!)
  const handleTrackSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!trackQuery.trim()) return
    setDialog(null) // Close popup dialog completely!
    const parsed = parseInt(trackQuery)
    const tokenNum = isNaN(parsed) ? 18 : parsed

    if (onNavigatePanel) {
      onNavigatePanel({
        tokenNumber: tokenNum,
        patientName: 'Rahul Sharma',
        phoneNumber: trackQuery.length >= 10 ? trackQuery : '9876543210',
        doctorName: 'Dr. Sarah Jenkins',
        room: 'Room 2',
        clinicName: 'QueueCare Health Clinic',
      })
    } else {
      window.location.hash = '#/panel'
    }
  }

  const activeStep = JOURNEY_STEPS.find((s) => s.id === activeStepId) || JOURNEY_STEPS[0]

  return (
    <div className="site-shell">
      {/* Top Header - Mobile First */}
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#home" aria-label="QueueCare Home">
            <img className="brand-logo" src={queueCareLogo} alt="QueueCare" />
          </a>

          <nav className="main-nav" aria-label="Main Navigation">
            <a href="#how-it-works">How It Works</a>
            <a href="#features">Features</a>
            <a href="#faq">FAQ</a>
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={openTrackDialog}
            >
              Track
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={openBookDialog}
            >
              Book Token
            </button>
          </div>
        </div>
      </header>

      <main id="home">
        {/* Hero Section - Mobile First Stack */}
        <section className="hero-section">
          <div className="hero-container">
            {/* Hero Copy */}
            <div className="hero-content">
              <div className="live-status-pill">
                <span className="live-dot" />
                <span>Live Clinic Queue Active</span>
              </div>

              <h1 className="hero-title">
                Smart clinic visits,{' '}
                <span className="hero-highlight">zero waiting room stress.</span>
              </h1>

              <p className="hero-lead">
                Book your clinic token online, track live queue movements in real time from home or work, and arrive right when your number is called.
              </p>

              <div className="hero-cta-group">
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={openBookDialog}
                >
                  <span>Book a Token</span>
                  <Icon name="arrow" size={18} />
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-lg"
                  onClick={openTrackDialog}
                >
                  <Icon name="clock" size={18} />
                  <span>Track Live Queue</span>
                </button>
              </div>
            </div>

            {/* Photorealistic Mobile Mockup with Hardware Chassis & Angle */}
            <div className="hero-visual">
              <div className="phone-tilt-wrapper">
                {/* Physical Chassis with side buttons */}
                <div className="phone-device-realistic">
                  {/* Hardware Buttons */}
                  <div className="phone-hw-btn phone-btn-action" title="Action Button" />
                  <div className="phone-hw-btn phone-btn-vol-up" title="Volume Up" />
                  <div className="phone-hw-btn phone-btn-vol-down" title="Volume Down" />
                  <div className="phone-hw-btn phone-btn-power" title="Side Power Button" />

                  {/* Antenna band lines */}
                  <div className="phone-antenna phone-antenna-l1" />
                  <div className="phone-antenna phone-antenna-l2" />
                  <div className="phone-antenna phone-antenna-r1" />
                  <div className="phone-antenna phone-antenna-r2" />

                  {/* Screen Frame with Real Bezel & Glass Sheen */}
                  <div className="phone-screen">
                    {/* Glass glare overlay */}
                    <div className="phone-screen-glare" />

                    {/* Realistic OLED Status Bar */}
                    <div className="phone-top-bar">
                      <span className="phone-time">{phoneTime}</span>
                      
                      {/* Dynamic Island with camera lens reflection */}
                      <div className="phone-dynamic-island">
                        <span className="camera-lens" />
                        <span className="sensor-indicator" />
                      </div>

                      <div className="phone-status-icons">
                        <Icon name="cellular" size={13} />
                        <Icon name="wifi" size={13} />
                        <Icon name="battery" size={12} />
                      </div>
                    </div>

                    {/* Single Doctor Header (No Department) */}
                    <div className="phone-doctor-header">
                      <div className="doctor-avatar">
                        <Icon name="person" size={17} />
                      </div>
                      <div className="doctor-meta">
                        <h4 className="doctor-name">Dr. Sarah Jenkins</h4>
                        <span className="doctor-dept">Room 2 • Today's Consultation</span>
                      </div>
                      <span className="doctor-live-pill">
                        <span className="live-dot-mini" />
                        Live
                      </span>
                    </div>

                    {/* Card 1: Current Serving Token Number */}
                    <div className="widget-card widget-current">
                      <div className="widget-header">
                        <span className="widget-kicker">NOW CALLING IN CLINIC</span>
                        <span className="widget-room">Room 2</span>
                      </div>
                      <div className="current-token-display">
                        <span className="token-label">Token</span>
                        <strong className="token-number">#14</strong>
                      </div>
                      <div className="token-meta">
                        <Icon name="clock" size={13} />
                        <span>Entered consultation 4 mins ago</span>
                      </div>
                    </div>

                    {/* Card 2: Patient Token Status */}
                    {phoneViewMode === 'booked' ? (
                      <div className="widget-card widget-my-token">
                        <div className="widget-header">
                          <span className="widget-kicker">YOUR APPOINTMENT TOKEN</span>
                          <span className="status-tag status-waiting">Waiting</span>
                        </div>

                        <div className="my-token-row">
                          <div className="my-token-main">
                            <span className="my-token-sub">Your Token</span>
                            <span className="my-token-val">#18</span>
                          </div>
                          <div className="my-token-metrics">
                            <div className="metric-row">
                              <span className="metric-title">Ahead:</span>
                              <strong className="metric-val">3 patients</strong>
                            </div>
                            <div className="metric-row">
                              <span className="metric-title">Est. Wait:</span>
                              <strong className="metric-val highlight">~12 mins</strong>
                            </div>
                            <div className="metric-row">
                              <span className="metric-title">Call ETA:</span>
                              <strong className="metric-val highlight">{etaCall}</strong>
                            </div>
                          </div>
                        </div>

                        {/* Queue Progress Bar */}
                        <div className="queue-progress-wrap">
                          <div className="progress-labels">
                            <span>Token #14 (Current)</span>
                            <span className="text-teal">You (#18)</span>
                          </div>
                          <div className="progress-track">
                            <div className="progress-fill" style={{ width: '74%' }} />
                          </div>
                        </div>

                        <button
                          type="button"
                          className="phone-mode-switch-btn"
                          onClick={() => setPhoneViewMode('new-patient')}
                        >
                          Need a new token? Switch to booking →
                        </button>
                      </div>
                    ) : (
                      <div className="widget-card widget-unbooked">
                        <div className="widget-header">
                          <span className="widget-kicker">NEXT AVAILABLE APPOINTMENT</span>
                          <span className="status-tag status-available">Slot Open</span>
                        </div>

                        <div className="unbooked-body">
                          <div className="next-available-box">
                            <span className="next-label">Next Token:</span>
                            <span className="next-number">#19</span>
                          </div>
                          <p className="unbooked-eta">Est. arrival: ~{etaArrival} (approx 18 min wait)</p>
                        </div>

                        <button
                          type="button"
                          className="btn btn-primary btn-block phone-action-btn"
                          onClick={openBookDialog}
                        >
                          <span>Book Token #19 Now</span>
                          <Icon name="arrow" size={15} />
                        </button>

                        <button
                          type="button"
                          className="phone-mode-switch-btn"
                          onClick={() => onNavigatePanel ? onNavigatePanel({ tokenNumber: 18 }) : setPhoneViewMode('booked')}
                        >
                          Already have a token? Open Patient Panel →
                        </button>
                      </div>
                    )}

                    {/* Phone Tab Bar */}
                    <div className="phone-footer-bar">
                      <span className="phone-tab active">
                        <Icon name="queue" size={14} />
                        <span>Live Queue</span>
                      </span>
                      <span
                        className="phone-tab"
                        onClick={() => onNavigatePanel ? onNavigatePanel() : openTrackDialog()}
                        role="button"
                        tabIndex={0}
                      >
                        <Icon name="calendar" size={14} />
                        <span>My Visit</span>
                      </span>
                    </div>

                    {/* Real iOS Bottom Home Indicator Bar */}
                    <div className="phone-home-indicator" />
                  </div>
                </div>

                {/* Ambient Soft Ground Shadow under device */}
                <div className="phone-ground-shadow" />
              </div>
            </div>
          </div>
        </section>

        {/* Brand New "How It Works" Concept: Interactive Patient Journey Simulator */}
        <section className="section-container" id="how-it-works">
          <div className="section-head">
            <span className="section-pill">NEW PATIENT EXPERIENCE</span>
            <h2 className="section-heading">How QueueCare works for you</h2>
            <p className="section-subtext">Tap any step to see live simulation of the patient journey.</p>
          </div>

          <div className="journey-interactive-container">
            {/* Step Selector List (Mobile-friendly vertical cards) */}
            <div className="journey-steps-list">
              {JOURNEY_STEPS.map((step) => {
                const isSelected = step.id === activeStepId
                return (
                  <button
                    key={step.id}
                    type="button"
                    className={`journey-step-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => setActiveStepId(step.id)}
                  >
                    <div className="step-btn-num">{step.id}</div>
                    <div className="step-btn-text">
                      <span className="step-btn-tag">{step.tag}</span>
                      <h3 className="step-btn-title">{step.title}</h3>
                      <p className="step-btn-sub">{step.subtitle}</p>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Live Simulation Card */}
            <div className="journey-preview-panel">
              <div className="simulation-window">
                <div className="sim-header">
                  <span className="sim-badge">
                    <span className="live-dot-mini" />
                    Live Step Preview
                  </span>
                  <span className="sim-step-index">Step {activeStep.id} of 4</span>
                </div>

                <div className="sim-body">
                  <h4 className="sim-title">{activeStep.title}</h4>
                  <p className="sim-desc">{activeStep.description}</p>

                  {/* Dynamic Simulation Preview Screen */}
                  <div className="sim-screen-card">
                    {activeStep.previewType === 'clinic-picker' && (
                      <div className="sim-mock-clinic">
                        <div className="sim-clinic-row">
                          <div className="sim-clinic-badge">Room 2 • Dr. Sarah Jenkins</div>
                          <span className="sim-status-live">🟢 In Session</span>
                        </div>
                        <h4 className="sim-doctor">Today's Clinic Consultation</h4>
                        <span className="sim-timing">10:00 AM – 2:00 PM • 60+ daily visits</span>
                        <div className="sim-quick-btn" onClick={openBookDialog} role="button" tabIndex={0}>
                          Book Next Token Online →
                        </div>
                      </div>
                    )}

                    {activeStep.previewType === 'sms-alert' && (
                      <div className="sim-mock-sms">
                        <div className="sim-sms-bubble">
                          <div className="sim-sms-sender">
                            <Icon name="message" size={14} />
                            <span>QueueCare SMS Alert</span>
                          </div>
                          <p className="sim-sms-text">
                            "Token <strong>#19</strong> confirmed for Dr. Sarah Jenkins (Room 2). Currently serving #14. Track live in your Patient Panel: <u>queuecare.me/panel</u>"
                          </p>
                          <span className="sim-sms-time">Delivered • 10:32 AM</span>
                        </div>
                      </div>
                    )}

                    {activeStep.previewType === 'live-meter' && (
                      <div className="sim-mock-meter">
                        <div className="sim-meter-header">
                          <span>Live Progress Tracker</span>
                          <span className="sim-meter-eta">ETA: ~18 mins</span>
                        </div>
                        <div className="sim-meter-visual">
                          <div className="meter-point active">#14</div>
                          <div className="meter-line active" />
                          <div className="meter-point active">#15</div>
                          <div className="meter-line active" />
                          <div className="meter-point active">#16</div>
                          <div className="meter-line" />
                          <div className="meter-point you">#19 (You)</div>
                        </div>
                        <span className="sim-meter-caption">Real-time doctor desk sync active</span>
                      </div>
                    )}

                    {activeStep.previewType === 'walk-in' && (
                      <div className="sim-mock-walkin">
                        <div className="sim-walkin-alert">
                          <Icon name="bell" size={20} />
                          <div>
                            <strong>Arrival Notification</strong>
                            <p>Token #17 has entered. Please arrive at Room 2 reception.</p>
                          </div>
                        </div>
                        <div className="sim-checkin-badge">
                          <Icon name="check" size={16} />
                          <span>Direct Walk-in Ready • Zero Waiting Room Delay</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features / Why Patients Love QueueCare */}
        <section className="section-container" id="features">
          <div className="section-head">
            <span className="section-pill">PATIENT ADVANTAGE</span>
            <h2 className="section-heading">Designed for comfortable clinic visits</h2>
            <p className="section-subtext">Built to eliminate queue chaos while preserving complete medical confidentiality.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><Icon name="sparkles" size={22} /></div>
              <h3 className="feature-title">Live Doctor Desk Sync</h3>
              <p className="feature-desc">When the doctor calls the next patient, queue counters update instantly across all connected screens.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon"><Icon name="shield" size={22} /></div>
              <h3 className="feature-title">Privacy Guaranteed</h3>
              <p className="feature-desc">Tokens are private to each patient. Sensitive personal details are never exposed to public waiting displays.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon"><Icon name="clock" size={22} /></div>
              <h3 className="feature-title">Predictive Wait Times</h3>
              <p className="feature-desc">Dynamic algorithms calculate average consultation durations so you arrive with high time accuracy.</p>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="section-container" id="faq">
          <div className="section-head">
            <span className="section-pill">FREQUENTLY ASKED QUESTIONS</span>
            <h2 className="section-heading">Got questions? We have answers.</h2>
            <p className="section-subtext">Everything you need to know about clinic tokens and real-time tracking.</p>
          </div>

          <div className="faq-accordion-wrap">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx
              return (
                <div key={idx} className={`faq-item ${isOpen ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-question-text">{faq.question}</span>
                    <span className="faq-toggle-icon">
                      <Icon name={isOpen ? 'minus' : 'plus'} size={18} />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="faq-answer-body">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      </main>

      {/* Redesigned Clean, Sleek, Professional Footer */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-top-row">
            <div className="footer-brand-side">
              <a className="brand footer-brand" href="#home" aria-label="QueueCare Home">
                <img className="brand-logo footer-logo" src={queueCareLogo} alt="QueueCare" />
              </a>
              <span className="footer-divider-pipe">|</span>
              <span className="footer-brief">Smart clinic queue management & real-time token tracking</span>
            </div>

            <nav className="footer-links" aria-label="Footer Navigation">
              <a href="#how-it-works">How It Works</a>
              <a href="#features">Features</a>
              <a href="#faq">FAQ</a>
              <button
                type="button"
                className="footer-nav-btn"
                onClick={openBookDialog}
              >
                Book Token
              </button>
              <button
                type="button"
                className="footer-nav-btn"
                onClick={openTrackDialog}
              >
                Track Live
              </button>
              <button
                type="button"
                className="footer-nav-btn"
                onClick={() => setDialog('privacy')}
              >
                Privacy Notice
              </button>
            </nav>
          </div>

          <div className="footer-bottom-row">
            <div className="footer-meta">
              <span className="footer-status-indicator">
                <span className="live-dot-mini" />
                Clinic In Session
              </span>
              <span className="footer-copyright">
                © {new Date().getFullYear()} QueueCare. All rights reserved.
              </span>
            </div>

            <a href="#home" className="footer-back-to-top">
              Back to top ↑
            </a>
          </div>
        </div>
      </footer>

      {/* Interactive Modals: Booking -> OTP Verification -> Patient Panel */}
      {dialog && (
        <div
          className="dialog-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setDialog(null)
          }}
        >
          <div className="dialog-box" role="dialog" aria-modal="true">
            <button
              type="button"
              className="dialog-close-btn"
              onClick={() => setDialog(null)}
              aria-label="Close dialog"
            >
              ×
            </button>

            {/* -------------------- PATIENT BOOKING MODAL FLOW -------------------- */}
            {dialog === 'book' && (
              <>
                {/* STAGE 1: ENTER NAME & PHONE NUMBER (NO DEPARTMENT) */}
                {bookingStage === 'form' && (
                  <>
                    <div className="dialog-header">
                      <div className="dialog-icon-wrap"><Icon name="calendar" size={20} /></div>
                      <div>
                        <span className="dialog-kicker">PATIENT BOOKING</span>
                        <h2 className="dialog-title">Book a Clinic Token</h2>
                      </div>
                    </div>

                    <div className="dialog-doctor-banner">
                      <Icon name="person" size={16} />
                      <span>Doctor: <strong>Dr. Sarah Jenkins</strong> (Room 2)</span>
                    </div>

                    <p className="dialog-desc">
                      Enter your name and mobile number to receive your digital token and SMS queue updates.
                    </p>

                    <form className="dialog-form" onSubmit={handleDetailsSubmit}>
                      <div className="form-group">
                        <label htmlFor="patient-name">Patient Name</label>
                        <input
                          id="patient-name"
                          type="text"
                          className="form-input"
                          placeholder="e.g. Rahul Sharma"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="phone-number">Mobile Number</label>
                        <div className="phone-input-wrap">
                          <span className="country-code">+91</span>
                          <input
                            id="phone-number"
                            type="tel"
                            className="form-input"
                            placeholder="Enter 10-digit number"
                            value={patientPhone}
                            onChange={(e) => setPatientPhone(e.target.value)}
                            pattern="[0-9]{10}"
                            required
                          />
                        </div>
                      </div>

                      <button type="submit" className="btn btn-primary btn-block btn-lg">
                        <span>Send Verification OTP</span>
                        <Icon name="arrow" size={17} />
                      </button>
                    </form>
                  </>
                )}

                {/* STAGE 2: OTP VERIFICATION */}
                {bookingStage === 'otp' && (
                  <>
                    <div className="dialog-header">
                      <div className="dialog-icon-wrap"><Icon name="lock" size={20} /></div>
                      <div>
                        <span className="dialog-kicker">SECURITY VERIFICATION</span>
                        <h2 className="dialog-title">Confirm Phone Number</h2>
                      </div>
                    </div>

                    <div className="otp-phone-pill">
                      <span>OTP sent to <strong>+91 {patientPhone}</strong></span>
                      <button
                        type="button"
                        className="otp-change-link"
                        onClick={() => setBookingStage('form')}
                      >
                        Change
                      </button>
                    </div>

                    <p className="dialog-desc">
                      Enter the 4-digit verification code sent to your mobile phone.
                    </p>

                    <form className="dialog-form" onSubmit={handleOtpVerify}>
                      <div className="form-group">
                        <label htmlFor="otp-input">Verification Code</label>
                        <div className="otp-input-container">
                          <input
                            id="otp-input"
                            type="text"
                            maxLength={4}
                            autoFocus
                            className="form-input otp-large-input"
                            placeholder="4 8 2 6"
                            value={otpValue}
                            onChange={(e) => setOtpValue(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="otp-demo-helper">
                        <span className="demo-chip" onClick={() => setOtpValue('4826')} role="button" tabIndex={0}>
                          ⚡ Click to Auto-Fill Demo OTP: <strong>4826</strong>
                        </span>
                      </div>

                      {otpError && <p className="otp-error-text">{otpError}</p>}

                      <button type="submit" className="btn btn-primary btn-block btn-lg">
                        <span>Verify OTP & Open Dedicated Patient Panel</span>
                        <Icon name="check" size={17} />
                      </button>
                    </form>
                  </>
                )}
              </>
            )}

            {/* -------------------- TRACK TOKEN SEARCH MODAL -------------------- */}
            {dialog === 'track' && (
              <>
                <div className="dialog-header">
                  <div className="dialog-icon-wrap"><Icon name="clock" size={20} /></div>
                  <div>
                    <span className="dialog-kicker">PATIENT PORTAL</span>
                    <h2 className="dialog-title">Track Your Token</h2>
                  </div>
                </div>

                <p className="dialog-desc">
                  Enter your registered phone number or token number to open your Patient Panel.
                </p>

                <form className="dialog-form" onSubmit={handleTrackSubmit}>
                  <div className="form-group">
                    <label htmlFor="track-query">Token Number or Mobile</label>
                    <input
                      id="track-query"
                      type="text"
                      className="form-input"
                      placeholder="e.g. 18 or 9876543210"
                      value={trackQuery}
                      onChange={(e) => setTrackQuery(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-block btn-lg">
                    <span>Search & Open Patient Panel</span>
                    <Icon name="arrow" size={17} />
                  </button>
                </form>

                {trackError && (
                  <div className="dialog-status-result">
                    <span>{trackError}</span>
                  </div>
                )}
              </>
            )}

            {/* -------------------- PRIVACY NOTICE MODAL -------------------- */}
            {dialog === 'privacy' && (
              <>
                <div className="dialog-header">
                  <div className="dialog-icon-wrap"><Icon name="shield" size={20} /></div>
                  <div>
                    <span className="dialog-kicker">SECURITY & CONFIDENTIALITY</span>
                    <h2 className="dialog-title">Patient Privacy Notice</h2>
                  </div>
                </div>

                <div className="dialog-privacy-content">
                  <p>
                    QueueCare is built for single-doctor clinics with privacy-by-design principles:
                  </p>
                  <ul className="privacy-list">
                    <li>Public clinic displays show anonymous token numbers only.</li>
                    <li>Mobile numbers are solely used to dispatch OTP and arrival SMS alerts.</li>
                    <li>No medical history or diagnosis details are stored or displayed publicly.</li>
                    <li>Data is encrypted in transit and in storage.</li>
                  </ul>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={() => setDialog(null)}
                >
                  Understood
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage
