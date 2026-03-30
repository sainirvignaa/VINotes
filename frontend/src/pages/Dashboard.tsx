import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Session {
  _id: string;
  content: string;
  analysisScore: number;
  isAuthentic: boolean;
  aiSuspected?: boolean;
  createdAt: string;
}

export default function Dashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/session', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSessions(response.data);
      } catch (error) {
        console.error('Failed to fetch sessions', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  

  return (
    <div className="container">
      <header className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Dashboard</h1>
          <p className="text-muted" style={{ margin: 0 }}>Welcome, {user.name || 'User'}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate('/editor')}>New Document</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Your Documents</h2>

        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : sessions.length === 0 ? (
          <div style={{ padding: '2rem 0', textAlign: 'center' }}>
            <p className="text-muted">No documents found.</p>
            <button onClick={() => navigate('/editor')}>Create one</button>
          </div>
        ) : (
          <div>
            {sessions.map(session => (
              <div 
                key={session._id} 
                className="session-item"
                onClick={() => navigate(`/editor/${session._id}`)}
              >
                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                  <span className="text-muted" style={{ fontSize: '0.875rem' }}>
                    {new Date(session.createdAt).toLocaleDateString()}
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span className={session.isAuthentic ? 'badge-success' : 'badge-error'}>
                      {session.isAuthentic ? 'Verified Human' : (session.aiSuspected ? 'AI Transcribed' : 'AI Suspected')}
                    </span>
                    
                  </div>
                </div>
                <div style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {session.content || 'Empty document...'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
