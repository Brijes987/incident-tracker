import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createIncident } from '../api/incidents'

function CreateIncident() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    service: '',
    severity: 'SEV3',
    status: 'OPEN',
    owner: '',
    summary: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      setError(null)
      
      const payload = {
        ...formData,
        owner: formData.owner || null,
        summary: formData.summary || null
      }
      
      const created = await createIncident(payload)
      navigate(`/incidents/${created.id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create incident')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Create New Incident</h1>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Brief description of the incident"
            />
          </div>

          <div className="form-group">
            <label>Service *</label>
            <input
              type="text"
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
              placeholder="e.g., API Gateway, Auth Service"
            />
          </div>

          <div className="form-group">
            <label>Severity *</label>
            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              required
            >
              <option value="SEV1">SEV1 - Critical</option>
              <option value="SEV2">SEV2 - High</option>
              <option value="SEV3">SEV3 - Medium</option>
              <option value="SEV4">SEV4 - Low</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="OPEN">Open</option>
              <option value="MITIGATED">Mitigated</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          <div className="form-group">
            <label>Owner</label>
            <input
              type="text"
              name="owner"
              value={formData.owner}
              onChange={handleChange}
              placeholder="email@company.com (optional)"
            />
          </div>

          <div className="form-group">
            <label>Summary</label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              placeholder="Detailed description of the incident (optional)"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Incident'}
            </button>
            <button 
              type="button" 
              className="btn btn-cancel" 
              onClick={() => navigate('/')}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateIncident
