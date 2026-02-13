import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getIncidents } from '../api/incidents'

function IncidentList() {
  const navigate = useNavigate()
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  
  const [search, setSearch] = useState('')
  const [searchDebounced, setSearchDebounced] = useState('')
  const [severity, setSeverity] = useState('')
  const [status, setStatus] = useState('')
  const [service, setService] = useState('')
  const [sortDir, setSortDir] = useState('desc')

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounced(search)
      setPage(0)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    fetchIncidents()
  }, [page, searchDebounced, severity, status, service, sortDir])

  const fetchIncidents = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = {
        page,
        size,
        sortBy: 'createdAt',
        sortDir
      }
      
      if (searchDebounced) params.search = searchDebounced
      if (severity) params.severity = severity
      if (status) params.status = status
      if (service) params.service = service
      
      const data = await getIncidents(params)
      setIncidents(data.content)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
    } catch (err) {
      setError('Failed to load incidents')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRowClick = (id) => {
    navigate(`/incidents/${id}`)
  }

  const toggleSort = () => {
    setSortDir(prev => prev === 'desc' ? 'asc' : 'desc')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div>
      <div className="page-header">
        <h1>Incidents</h1>
      </div>

      <div className="filters">
        <div className="filter-row">
          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <label>Severity</label>
            <select value={severity} onChange={(e) => { setSeverity(e.target.value); setPage(0); }}>
              <option value="">All</option>
              <option value="SEV1">SEV1</option>
              <option value="SEV2">SEV2</option>
              <option value="SEV3">SEV3</option>
              <option value="SEV4">SEV4</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Status</label>
            <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(0); }}>
              <option value="">All</option>
              <option value="OPEN">Open</option>
              <option value="MITIGATED">Mitigated</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Service</label>
            <input
              type="text"
              placeholder="Filter by service..."
              value={service}
              onChange={(e) => { setService(e.target.value); setPage(0); }}
            />
          </div>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading incidents...</p>
        </div>
      ) : incidents.length === 0 ? (
        <div className="empty-state">
          <p>No incidents found</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Service</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Owner</th>
                <th onClick={toggleSort} style={{ cursor: 'pointer' }}>
                  Created At {sortDir === 'desc' ? '↓' : '↑'}
                </th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => (
                <tr key={incident.id} onClick={() => handleRowClick(incident.id)} style={{ cursor: 'pointer' }}>
                  <td>{incident.id}</td>
                  <td>{incident.title}</td>
                  <td>{incident.service}</td>
                  <td>
                    <span className={`severity-badge severity-${incident.severity}`}>
                      {incident.severity}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${incident.status}`}>
                      {incident.status}
                    </span>
                  </td>
                  <td>{incident.owner || '-'}</td>
                  <td>{formatDate(incident.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="pagination">
            <div className="pagination-info">
              Showing {page * size + 1} to {Math.min((page + 1) * size, totalElements)} of {totalElements} incidents
            </div>
            <div className="pagination-controls">
              <button onClick={() => setPage(0)} disabled={page === 0}>
                First
              </button>
              <button onClick={() => setPage(page - 1)} disabled={page === 0}>
                Previous
              </button>
              <span style={{ padding: '0.5rem 1rem' }}>
                Page {page + 1} of {totalPages}
              </span>
              <button onClick={() => setPage(page + 1)} disabled={page >= totalPages - 1}>
                Next
              </button>
              <button onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1}>
                Last
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default IncidentList
