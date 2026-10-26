import { useState, useEffect } from 'react'
import HomePage from './pages/home/HomePage'
import PatientPanelPage, { type PatientData } from './pages/panel/PatientPanelPage'

function App() {
  const getInitialView = (): 'home' | 'panel' => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      const search = window.location.search
      // If user scanned QR code or visited /#panel directly
      if (hash.includes('panel') || search.includes('view=panel')) {
        return 'panel'
      }
    }
    return 'home'
  }

  const [currentView, setCurrentView] = useState<'home' | 'panel'>(getInitialView)
  const [patientData, setPatientData] = useState<PatientData>({
    tokenNumber: 19,
    patientName: 'Rahul Sharma',
    phoneNumber: '9876543210',
    doctorName: 'Dr. Sarah Jenkins',
    room: 'Room 2',
    clinicName: 'QueueCare Health Clinic',
  })

  // Synchronize hash routing with browser history and QR code scans
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash.includes('panel')) {
        setCurrentView('panel')
      } else {
        setCurrentView('home')
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigateToPanel = (data?: Partial<PatientData>) => {
    if (data) {
      setPatientData((prev) => ({
        ...prev,
        ...data,
      }))
    }
    window.location.hash = '#/panel'
    setCurrentView('panel')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateToHome = () => {
    window.location.hash = '#/'
    setCurrentView('home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (currentView === 'panel') {
    return (
      <PatientPanelPage
        patient={patientData}
        onNavigateHome={navigateToHome}
      />
    )
  }

  return (
    <HomePage
      onNavigatePanel={navigateToPanel}
    />
  )
}

export default App
