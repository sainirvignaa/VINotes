import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function EditorPage() {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiSuspected, setAiSuspected] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      setLoading(true);
      const fetchSession = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:5000/api/session/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setContent(response.data.content);
          setAiSuspected(!!response.data.aiSuspected);
        } catch (error) {
          console.error(error);
          alert('Failed to load document');
          navigate('/dashboard');
        } finally {
          setLoading(false);
        }
      };

      fetchSession();
    }
  }, [id, navigate]);

  const handleSave = async () => {
    if (!content.trim()) return;

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const payload = { content, aiSuspected };
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (id) {
        await axios.put(`http://localhost:5000/api/session/${id}`, payload, config);
      } else {
        await axios.post('http://localhost:5000/api/session', payload, config);
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save', error);
      alert('Failed to save document. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header className="flex-between" style={{ padding: '1rem 2rem', borderBottom: '1px solid #ccc', background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/dashboard')}>
            Back
          </button>
          <span className="text-muted" style={{ fontSize: '0.9rem' }}>
            Word count: {content.split(/\s+/).filter(word => word.length > 0).length}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {aiSuspected && (
            <span className="badge-error" title="Paste detected: this document is flagged as AI suspected">
              AI Suspected
            </span>
          )}
          <button onClick={handleSave} disabled={saving || !content.trim()}>
            {saving ? 'Saving...' : 'Save Document'}
          </button>
        </div>
      </header>

      <div style={{ flex: 1, padding: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        {loading ? (
          <div className="text-muted">Loading...</div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onPaste={() => setAiSuspected(true)}
            placeholder="Start typing your text here..."
            className="editor-textarea"
          />
        )}
      </div>
    </div>
  );
}
