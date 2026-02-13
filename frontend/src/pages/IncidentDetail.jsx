import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getIncidentById, updateIncident } from '../api/incidents'

function IncidentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [incident, setIncident] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState('')

  useEffect(() => {
    fetchIncident()
  }, [id])

  const fetchIncident = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getIncidentById(id)
      setIncident(data)
      setNewStatus(data.status)
    } catch (err) {
      setError('Failed to load incident')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (newStatus === incident.status) return
    
    try {
      setUpdating(true)
      await updateIncident(id, { status: newStatus })
      await fetchIncident()
    } catch (err) {
      setError('Failed to update status')
      console.error(err)
    } finally {
      setUpdating(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading incident...</p>
      </div>
    )
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (!incident) {
    return <div className="error">Incident not found</div>
  }

  return (
    <div>
      <div className="page-header">
        <button onClick={() => navigate('/')} className="link-button">
          ← Back to Incidents
        </button>
      </div>

      <div className="detail-container">
        <div className="detail-header">
          <div className="detail-title">
            <h1>{incident.title}</h1>
            <p style={{ color: '#666', marginTop: '0.5rem' }}>Incident #{incident.id}</p>
          </div>
          <div className="detail-meta">
            <span className={`severity-badge severity-${incident.severity}`}>
              {incident.severity}
            </span>
            <span className={`status-badge status-${incident.status}`}>
              {incident.status}
            </span>
          </div>
        </div>

        <div className="detail-section">
          <h2>Details</h2>
          <div className="detail-grid">
            <div className="detail-field">
              <label>Service</label>
              <div className="value">{incident.service}</div>
            </div>
            
            <div className="detail-field">
              <label>Owner</label>
              <div className="value">{incident.owner || 'Unassigned'}</div>
            </div>
            
            <div className="detail-field">
              <label>Created At</label>
              <div className="value">{formatDate(incident.createdAt)}</div>
            </div>
            
            <div className="detail-field">
              <label>Updated At</label>
              <div className="value">{formatDate(incident.updatedAt)}</div>
            </div>
          </div>
        </div>

        {incident.summary && (
          <div className="detail-section">
            <h2>Summary</h2>
            <p style={{ lineHeight: '1.6' }}>{incident.summary}</p>
          </div>
        )}

        <div className="detail-section">
          <h2>Update Status</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <select 
              value={newStatus} 
              onChange={(e) => setNewStatus(e.target.value)}
              style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="OPEN">Open</option>
              <option value="MITIGATED">Mitigated</option>
              <option value="RESOLVED">Resolved</option>
            </select>
            <button 
              onClick={handleStatusUpdate}
              disabled={updating || newStatus === incident.status}
              className="btn btn-update"
            >
              {updating ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IncidentDetail
