import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import IncidentList from './pages/IncidentList'
import IncidentDetail from './pages/IncidentDetail'
import CreateIncident from './pages/CreateIncident'

function App() {
  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="container">
            <Link to="/" className="logo">Incident Tracker</Link>
            <nav>
              <Link to="/" className="nav-link">Incidents</Link>
              <Link to="/create" className="nav-link btn-primary">New Incident</Link>
            </nav>
          </div>
        </header>
        
        <main className="main">
          <Routes>
            <Route path="/" element={<IncidentList />} />
            <Route path="/incidents/:id" element={<IncidentDetail />} />
            <Route path="/create" element={<CreateIncident />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
