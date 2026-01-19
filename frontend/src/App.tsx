import React, { useState } from 'react';
import axios from 'axios';
import {
  Rocket,
  FileText,
  AlertCircle,
  Target,
  Clock,
  MessageSquare,
  TrendingUp,
  Brain,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface SkillGap {
  skill: string;
  importance: string;
  recommendation: string;
}

interface DayPlan {
  day: number;
  focus: string;
  activities: string[];
}

interface MockQuestion {
  question: string;
  expected_answer_format: string;
  tips: string;
}

interface AnalysisResult {
  is_sufficient: boolean;
  clarification_questions: string[];
  quality_score?: number;
  relevance_score?: number;
  missing_skills: SkillGap[];
  seven_day_plan: DayPlan[];
  mock_interview_questions: MockQuestion[];
  overall_feedback?: string;
}

function App() {
  const [role, setRole] = useState('');
  const [resume, setResume] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const roles = [
    'Software Engineer',
    'Data Analyst',
    'ML Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Cybersecurity Analyst',
    'Cloud Architect'
  ];

  const handleAnalyze = async () => {
    if (!role || !resume) {
      setError('Please select a target role and paste your resume content.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/analyze`, {
        role,
        resume_text: resume
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An unexpected error occurred. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE_URL}/parse-resume`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResume(response.data.text);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to parse PDF.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}
        >
          <Rocket size={40} color="var(--primary)" />
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, background: 'linear-gradient(to right, #2563eb, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            CareerPilot AI
          </h1>
        </motion.div>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Smart placement preparation powered by AI.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr' : '1fr', gap: '2rem' }}>
        {/* Input Section */}
        <AnimatePresence>
          {!result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card glass"
            >
              <div className="input-group">
                <label><Target size={18} style={{ marginRight: '8px', display: 'inline-block' }} /> Target Job Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Select a role...</option>
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ marginBottom: 0 }}><FileText size={18} style={{ marginRight: '8px', display: 'inline-block' }} /> Resume Content</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                      accept=".pdf"
                    />
                    <button
                      className="btn-secondary"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', background: '#e0e7ff', color: '#4338ca', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? <div className="loading-spinner" style={{ width: '16px', height: '16px', border: '2px solid #4338ca', borderTop: '2px solid transparent' }}></div> : <Upload size={16} />}
                      {uploading ? 'Parsing...' : 'Upload PDF'}
                    </button>
                  </div>
                </div>
                <textarea
                  placeholder="Paste your resume text here (experience, skills, projects)..."
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                />
              </div>

              {error && (
                <div style={{ color: 'var(--error)', background: '#fee2e2', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}

              <button
                className="btn-primary"
                onClick={handleAnalyze}
                disabled={loading}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                {loading ? <div className="loading-spinner"></div> : <><Brain size={20} /> Analyze My Profile</>}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Sufficiency Check */}
            {!result.is_sufficient ? (
              <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#b45309' }}>
                  <MessageSquare /> Need More Information
                </h3>
                <p style={{ marginBottom: '1rem' }}>To provide a precise analysis, I need a few more details:</p>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  {result.clarification_questions.map((q, i) => (
                    <li key={i} style={{ marginBottom: '0.5rem' }}>{q}</li>
                  ))}
                </ul>
                <button
                  className="btn-primary"
                  style={{ marginTop: '1.5rem', background: 'var(--text-muted)' }}
                  onClick={() => setResult(null)}
                >
                  Edit Input
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Analysis for {role}</h2>
                  <button className="btn-primary" style={{ width: 'auto', background: 'var(--text-muted)' }} onClick={() => setResult(null)}>New Analysis</button>
                </div>

                {/* Scores */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Resume Quality</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{result.quality_score}%</div>
                  </div>
                  <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Role Relevance</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>{result.relevance_score}%</div>
                  </div>
                </div>

                {/* Skills Gap */}
                <section className="card">
                  <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TrendingUp size={20} /> Skills you need to focus on
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {result.missing_skills.map((skill, i) => (
                      <div key={i} style={{ padding: '1rem', background: '#f1f5f9', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 700 }}>{skill.skill}</span>
                          <span className="badge badge-blue">{skill.importance}</span>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{skill.recommendation}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 7-Day Plan */}
                <section className="card">
                  <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={20} /> Your 7-Day Roadmap
                  </h3>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {result.seven_day_plan.map((day) => (
                      <div key={day.day} style={{ display: 'flex', gap: '1rem', borderLeft: '2px solid var(--border)', paddingLeft: '1.5rem', position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '-11px', top: '0', background: 'var(--primary)', color: 'white', width: '20px', height: '20px', borderRadius: '50%', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{day.day}</div>
                        <div>
                          <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Day {day.day}: {day.focus}</h4>
                          <ul style={{ fontSize: '0.875rem', color: 'var(--text-muted)', paddingLeft: '1.2rem' }}>
                            {day.activities.map((a, i) => <li key={i}>{a}</li>)}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Interview Questions */}
                <section className="card" style={{ background: '#1e293b', color: 'white' }}>
                  <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MessageSquare size={20} /> Top Mock Interview Questions
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                    {result.mock_interview_questions.map((q, i) => (
                      <div key={i}>
                        <p style={{ fontWeight: 600, color: '#94a3b8', marginBottom: '0.25rem' }}>Question {i + 1}</p>
                        <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{q.question}</p>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem' }}>
                          <p style={{ color: '#38bdf8', fontWeight: 600 }}>Tip:</p>
                          <p style={{ color: '#cbd5e1' }}>{q.tips}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <footer style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        <p>© 2026 CareerPilot AI | Built for Final Year Placement Excellence</p>
      </footer>
    </div>
  );
}

export default App;
