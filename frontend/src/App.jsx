import { useState, useEffect } from 'react'
import './App.css'


const API = import.meta.env.VITE_API_URL

const STATUSES = ['À postuler', 'Postulé', 'Entretien', 'Refusé']

const STATUS_COLORS = {
  'À postuler': { bg: '#EFF6FF', color: '#2563EB' },
  'Postulé':    { bg: '#F0FDF4', color: '#16A34A' },
  'Entretien':  { bg: '#FFF7ED', color: '#EA580C' },
  'Refusé':     { bg: '#FEF2F2', color: '#DC2626' },
}

function JobList() {
  const [jobs, setJobs] = useState([])

  const fetchJobs = async () => {
    const res = await fetch(`${API}/jobs`)
    setJobs(await res.json())
  }

  useEffect(() => { fetchJobs() }, [])

  const updateStatus = async (id, status) => {
    await fetch(`${API}/jobs/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    fetchJobs()
  }

  if (jobs.length === 0) return (
    <div className="empty-state">
      <p>Aucune offre sauvegardée.</p>
      <p>Analyse une offre et clique sur "Sauvegarder".</p>
    </div>
  )

  return (
    <div>
      <div className="list-header">
        <h2 className="list-title">Mes candidatures</h2>
        <span className="list-count">{jobs.length} offre{jobs.length > 1 ? 's' : ''}</span>
      </div>
      {jobs.map(job => (
        <div key={job.id} className="job-card">
          <div className="job-card-header">
            <div>
              <p className="job-title">{job.title}</p>
              <p className="job-company">{job.company}</p>
            </div>
            <select
              className="status-select"
              value={job.status}
              onChange={e => updateStatus(job.id, e.target.value)}
              style={{ background: STATUS_COLORS[job.status]?.bg, color: STATUS_COLORS[job.status]?.color }}
            >
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <p className="job-summary">{job.summary}</p>
          <div className="badges-wrap">
            {job.skills.map(s => (
              <span key={s} className="badge badge-gray">{s}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function App() {
  const [description, setDescription] = useState('')
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [view, setView] = useState('analyze')
  const [letter, setLetter] = useState('')
  const [loadingLetter, setLoadingLetter] = useState(false)
  const [background, setBackground] = useState('')
  const [error, setError] = useState(null)

  const analyze = async () => {
  setLoading(true)
  setAnalysis(null)
  setSaved(false)
  setLetter('')
  setError(null)
  try {
    const res = await fetch(`${API}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description })
    })
    if (!res.ok) throw new Error('Erreur serveur')
    setAnalysis(await res.json())
  } catch (e) {
    setError('Impossible de contacter le serveur. Vérifie que le backend tourne.')
  }
  setLoading(false)
}

  const save = async () => {
    await fetch(`${API}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, company, description, skills: analysis.skills, summary: analysis.summary, status: 'À postuler' })
    })
    setSaved(true)
  }

  const generateLetter = async () => {
    setLoadingLetter(true)
    setLetter('')
    const res = await fetch(`${API}/coverletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_title: title, company, skills: analysis.skills, summary: analysis.summary, candidate_background: background })
    })
    const data = await res.json()
    setLetter(data.letter)
    setLoadingLetter(false)
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <p>Job Tracker</p>
          <p>Powered by Mistral</p>
        </div>
        <button className={`nav-btn ${view === 'analyze' ? 'active' : ''}`} onClick={() => setView('analyze')}>
          Analyser une offre
        </button>
        <button className={`nav-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>
          Mes candidatures
        </button>
      </aside>

      <main className="main">
        {view === 'analyze' && (
          <>
            <h1 className="page-title">Analyser une offre</h1>

            <div className="form-grid">
              <div>
                <label className="form-label">Titre du poste</label>
                <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="ML Engineer" />
              </div>
              <div>
                <label className="form-label">Entreprise</label>
                <input className="form-input" value={company} onChange={e => setCompany(e.target.value)} placeholder="Capgemini" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description de l'offre</label>
              <textarea className="form-textarea" rows={6} value={description} onChange={e => setDescription(e.target.value)} placeholder="Colle le texte de l'offre ici..." />
            </div>

            <button className="btn btn-primary" onClick={analyze} disabled={loading}>
              {loading ? 'Analyse en cours...' : 'Analyser'}
            </button>

              {error && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, fontSize: 14, color: '#DC2626' }}>
                  {error}
              </div>
              )}

            {analysis && (
              <div className="results">
                <div className="cards-grid">
                  <div className="card">
                    <p className="card-label">Compétences détectées</p>
                    <div className="badges-wrap">
                      {analysis.skills.map(s => <span key={s} className="badge badge-blue">{s}</span>)}
                    </div>
                  </div>
                  <div className="card">
                    <p className="card-label">Résumé</p>
                    <p className="card-text">{analysis.summary}</p>
                  </div>
                </div>

                <div className="card" style={{ marginBottom: 16 }}>
                  <p className="card-label">Conseils pour postuler</p>
                  <ul className="tips-list">
                    {analysis.match_tips.map(t => <li key={t}>{t}</li>)}
                  </ul>
                </div>

                <div className="actions-row">
                  <button className="btn btn-success" onClick={save}>Sauvegarder l'offre</button>
                  {saved && <span className="saved-text">✓ Sauvegardée</span>}
                </div>

                <div className="card">
                  <p className="card-label">Générer une lettre de motivation</p>
                  <textarea className="form-textarea" rows={3} value={background} onChange={e => setBackground(e.target.value)}
                    placeholder="Décris ton profil (ex: 5 ans en backend Python, expérience MLOps...)" style={{ marginBottom: 12 }} />
                  <button className="btn btn-primary" onClick={generateLetter} disabled={loadingLetter}>
                    {loadingLetter ? 'Génération...' : 'Générer la lettre'}
                  </button>
                  {letter && <div className="letter-output">{letter}</div>}
                </div>
              </div>
            )}
          </>
        )}

        {view === 'list' && <JobList />}
      </main>
    </div>
  )
}

export default App