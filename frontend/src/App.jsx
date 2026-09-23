import { useState, useEffect } from 'react'

const STATUSES = ['À postuler', 'Postulé', 'Entretien', 'Refusé']

function JobList() {
  const [jobs, setJobs] = useState([])

  const fetchJobs = async () => {
    const res = await fetch('http://localhost:8000/jobs')
    setJobs(await res.json())
  }

  useEffect(() => { fetchJobs() }, [])

  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:8000/jobs/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    fetchJobs()
  }

  return (
    <div style={{ marginTop: 40 }}>
      <h2>Mes offres ({jobs.length})</h2>
      {jobs.map(job => (
        <div key={job.id} style={{ border: '1px solid #ddd', padding: 16, marginBottom: 12, borderRadius: 8 }}>
          <strong>{job.title}</strong> — {job.company}
          <p style={{ color: '#666', fontSize: 14 }}>{job.summary}</p>
          <div>{job.skills.map(s => (
            <span key={s} style={{ background: '#eef', padding: '2px 8px', borderRadius: 12, marginRight: 6, fontSize: 13 }}>{s}</span>
          ))}</div>
          <select
            value={job.status}
            onChange={e => updateStatus(job.id, e.target.value)}
            style={{ marginTop: 10, padding: '4px 8px' }}
          >
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
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

  const analyze = async () => {
    setLoading(true)
    setAnalysis(null)
    setSaved(false)
    const res = await fetch('http://localhost:8000/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description })
    })
    setAnalysis(await res.json())
    setLoading(false)
  }

  const save = async () => {
    await fetch('http://localhost:8000/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, company, description, skills: analysis.skills, summary: analysis.summary, status: 'À postuler' })
    })
    setSaved(true)
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Job Tracker AI</h1>
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setView('analyze')} style={{ marginRight: 10, padding: '8px 16px', background: view === 'analyze' ? '#333' : '#eee', color: view === 'analyze' ? 'white' : 'black', border: 'none', borderRadius: 4 }}>
          Analyser
        </button>
        <button onClick={() => setView('list')} style={{ padding: '8px 16px', background: view === 'list' ? '#333' : '#eee', color: view === 'list' ? 'white' : 'black', border: 'none', borderRadius: 4 }}>
          Mes offres
        </button>
      </div>

      {view === 'analyze' && (
        <>
          <input placeholder="Titre du poste" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
          <input placeholder="Entreprise" value={company} onChange={e => setCompany(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
          <textarea rows={6} style={{ width: '100%', padding: 8 }} placeholder="Colle une offre d'emploi ici..." value={description} onChange={e => setDescription(e.target.value)} />
          <button onClick={analyze} disabled={loading} style={{ marginTop: 10, padding: '10px 20px' }}>
            {loading ? 'Analyse en cours...' : 'Analyser'}
          </button>

          {analysis && (
            <div style={{ marginTop: 30 }}>
              <h2>Compétences</h2>
              <ul>{analysis.skills.map(s => <li key={s}>{s}</li>)}</ul>
              <h2>Résumé</h2>
              <p>{analysis.summary}</p>
              <h2>Conseils</h2>
              <ul>{analysis.match_tips.map(t => <li key={t}>{t}</li>)}</ul>
              <button onClick={save} style={{ marginTop: 20, padding: '10px 20px', background: '#2ecc71', color: 'white', border: 'none' }}>
                Sauvegarder l'offre
              </button>
              {saved && <p style={{ color: 'green' }}>✅ Offre sauvegardée !</p>}
            </div>
          )}
        </>
      )}

      {view === 'list' && <JobList />}
    </div>
  )
}

export default App