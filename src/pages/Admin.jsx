import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { defaultPortfolioContent } from '../data/defaultPortfolioContent';

const SECTIONS = [
  { key: 'aboutParagraphs', label: 'About Paragraphs' },
  { key: 'aboutStats', label: 'About Stats' },
  { key: 'aboutHighlights', label: 'About Highlights' },
  { key: 'skills', label: 'Skills' },
  { key: 'projects', label: 'Projects' },
  { key: 'photoSlides', label: 'Photo Slides' },
  { key: 'events', label: 'Events' },
  { key: 'experience', label: 'Experience' },
  { key: 'education', label: 'Education' },
];

function Notification({ message, type, onClose }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div style={{
      position: 'fixed', top: 24, right: 24, zIndex: 9999,
      padding: '14px 20px', borderRadius: 8,
      background: type === 'error' ? '#3a1a1a' : '#1a3a1a',
      border: `1px solid ${type === 'error' ? '#5a2a2a' : '#2a5a2a'}`,
      color: type === 'error' ? '#ff8a8a' : '#8aff8a',
      fontSize: 14, maxWidth: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      animation: 'fadeUp 0.3s ease-out',
    }}>
      {message}
    </div>
  );
}

export default function Admin() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [entries, setEntries] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ section: '', sort_order: 0, data: {} });
  const [importing, setImporting] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [notif, setNotif] = useState({ message: '', type: '' });

  const notify = useCallback((message, type = 'success') => setNotif({ message, type }), []);
  const clearNotif = useCallback(() => setNotif({ message: '', type: '' }), []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s) fetchEntries();
      else setLoading(false);
    });
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setAuthLoading(false);
    if (error) { setAuthError(error.message); return; }
    setSession(data.session);
    fetchEntries();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setSession(null);
    setEntries({});
  }

  async function fetchEntries() {
    setLoading(true);
    const { data, error } = await supabase
      .from('content_entries')
      .select('*')
      .order('section')
      .order('sort_order')
      .order('created_at');
    if (error) { notify(error.message, 'error'); setLoading(false); return; }
    const grouped = {};
    for (const row of data) {
      if (!grouped[row.section]) grouped[row.section] = [];
      grouped[row.section].push(row);
    }
    setEntries(grouped);
    setLoading(false);
  }

  function startEdit(entry) {
    setEditing(entry.id);
    setEditForm({
      section: entry.section,
      sort_order: entry.sort_order,
      data: JSON.parse(JSON.stringify(entry.data)),
    });
  }

  function cancelEdit() {
    setEditing(null);
    setEditForm({ section: '', sort_order: 0, data: {} });
  }

  async function saveEdit(entry) {
    setSaving(s => ({ ...s, [entry.id]: true }));
    const { error } = await supabase
      .from('content_entries')
      .update({ data: editForm.data, sort_order: editForm.sort_order })
      .eq('id', entry.id);
    setSaving(s => ({ ...s, [entry.id]: false }));
    if (error) { notify(error.message, 'error'); return; }
    notify('Entry updated');
    cancelEdit();
    fetchEntries();
  }

  async function deleteEntry(id) {
    setDeleting(id);
    const { error } = await supabase.from('content_entries').delete().eq('id', id);
    setDeleting(null);
    if (error) { notify(error.message, 'error'); return; }
    notify('Entry deleted');
    cancelEdit();
    fetchEntries();
  }

  function addEntry(sectionKey) {
    const newEntry = {
      id: `new-${Date.now()}`,
      section: sectionKey,
      sort_order: (entries[sectionKey]?.length || 0) + 1,
      data: {},
    };
    startEdit(newEntry);
  }

  async function saveNewEntry() {
    if (editing === null) return;
    setSaving(s => ({ ...s, [editing]: true }));
    const { data, error } = await supabase
      .from('content_entries')
      .insert({ section: editForm.section, sort_order: editForm.sort_order, data: editForm.data })
      .select();
    setSaving(s => ({ ...s, [editing]: false }));
    if (error) { notify(error.message, 'error'); return; }
    notify('Entry created');
    cancelEdit();
    fetchEntries();
  }

  async function importDefaults() {
    if (!confirm('This will replace all existing content with the default portfolio content. Continue?')) return;
    setImporting(true);
    const rows = [];
    for (const sectionKey of SECTIONS.map(s => s.key)) {
      const items = defaultPortfolioContent[sectionKey];
      if (!items) continue;
      items.forEach((item, i) => {
        const { id, ...data } = item;
        rows.push({ section: sectionKey, sort_order: i, data });
      });
    }
    await supabase.from('content_entries').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { error } = await supabase.from('content_entries').insert(rows);
    setImporting(false);
    if (error) { notify(error.message, 'error'); return; }
    notify(`Imported ${rows.length} entries from defaults`);
    fetchEntries();
  }

  function updateDataField(path, value) {
    setEditForm(prev => {
      const newData = JSON.parse(JSON.stringify(prev.data));
      const keys = path.split('.');
      let obj = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return { ...prev, data: newData };
    });
  }

  function renderDataFields(data, path = '') {
    if (data === null || data === undefined) return null;
    if (typeof data === 'string') {
      return (
        <textarea
          value={data}
          onChange={e => updateDataField(path, e.target.value)}
          rows={3}
          className="admin-input"
          style={{ width: '100%', resize: 'vertical' }}
        />
      );
    }
    if (typeof data === 'number') {
      return (
        <input
          type="number"
          value={data}
          onChange={e => updateDataField(path, Number(e.target.value))}
          className="admin-input"
          style={{ width: 120 }}
        />
      );
    }
    if (typeof data === 'boolean') {
      return (
        <input
          type="checkbox"
          checked={data}
          onChange={e => updateDataField(path, e.target.checked)}
          style={{ width: 20, height: 20, accentColor: '#c8c8c8' }}
        />
      );
    }
    if (Array.isArray(data)) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {data.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 12, color: '#888', marginTop: 8, minWidth: 20 }}>{i}</span>
              <div style={{ flex: 1 }}>
                {typeof item === 'string' ? (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input
                      value={item}
                      onChange={e => {
                        const arr = [...data];
                        arr[i] = e.target.value;
                        updateDataField(path, arr);
                      }}
                      className="admin-input"
                    />
                    <button
                      className="admin-btn admin-btn-sm admin-btn-danger"
                      onClick={() => {
                        const arr = data.filter((_, idx) => idx !== i);
                        updateDataField(path, arr);
                      }}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div style={{
                    padding: '8px 10px', background: '#161616', borderRadius: 6,
                    border: '1px solid #2e2e2e',
                  }}>
                    {Object.entries(item).map(([k, v]) => (
                      <div key={k} style={{ marginBottom: 6 }}>
                        <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{k}</label>
                        {renderDataFields(v, `${path}.${i}.${k}`)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <button
            className="admin-btn admin-btn-sm"
            onClick={() => {
              const arr = [...data, ''];
              updateDataField(path, arr);
            }}
          >
            + Add item
          </button>
        </div>
      );
    }
    if (typeof data === 'object') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Object.entries(data).map(([k, v]) => (
            <div key={k}>
              <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{k}</label>
              {renderDataFields(v, path ? `${path}.${k}` : k)}
            </div>
          ))}
        </div>
      );
    }
    return null;
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="admin-page">
        <div className="admin-panel">
          <h1 className="admin-logo">⛑️ Admin</h1>
          <p style={{ color: '#ff8a8a', textAlign: 'center', marginTop: 24 }}>
            Supabase is not configured.<br />
            Set <code style={{ background: '#1e1e1e', padding: '2px 6px', borderRadius: 4 }}>VITE_SUPABASE_URL</code>
            {' '}and{' '}
            <code style={{ background: '#1e1e1e', padding: '2px 6px', borderRadius: 4 }}>VITE_SUPABASE_ANON_KEY</code>
            {' '}in your environment variables.
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="admin-page">
        <div className="admin-panel" style={{ maxWidth: 400 }}>
          <h1 className="admin-logo">⛑️ Admin</h1>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 24 }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="admin-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="admin-input"
            />
            {authError && (
              <p style={{ color: '#ff8a8a', fontSize: 13, margin: 0 }}>{authError}</p>
            )}
            <button type="submit" disabled={authLoading} className="admin-btn admin-btn-primary" style={{ width: '100%' }}>
              {authLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <Notification message={notif.message} type={notif.type} onClose={clearNotif} />

      <div className="admin-header">
        <h1 className="admin-logo" style={{ margin: 0 }}>⛑️ Admin</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#888' }}>{session.user.email}</span>
          <button onClick={importDefaults} disabled={importing} className="admin-btn" style={{ background: '#1e3a1e', borderColor: '#2a5a2a', color: '#8aff8a' }}>
            {importing ? 'Importing...' : 'Import Defaults'}
          </button>
          <button onClick={() => { cancelEdit(); fetchEntries(); }} className="admin-btn">
            Refresh
          </button>
          <button onClick={handleLogout} className="admin-btn" style={{ borderColor: '#5a2a2a', color: '#ff8a8a' }}>
            Sign Out
          </button>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', marginTop: 60, color: '#888' }}>Loading entries...</p>
      ) : (
        <div className="admin-content">
          {SECTIONS.map(section => (
            <div key={section.key} className="admin-section">
              <div className="admin-section-header">
                <h2 className="admin-section-title">{section.label}</h2>
                <button className="admin-btn admin-btn-sm" onClick={() => addEntry(section.key)}>
                  + New
                </button>
              </div>

              {(entries[section.key] || []).length === 0 ? (
                <p style={{ color: '#666', fontSize: 13, padding: '12px 0' }}>No entries yet.</p>
              ) : (
                <div className="admin-entries">
                  {(entries[section.key] || []).map(entry => (
                    <div key={entry.id} className={`admin-entry ${editing === entry.id ? 'admin-entry-editing' : ''}`}>
                      {editing === entry.id ? (
                        <div>
                          <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#888' }}>
                              Sort Order:
                              <input
                                type="number"
                                value={editForm.sort_order}
                                onChange={e => setEditForm(f => ({ ...f, sort_order: Number(e.target.value) }))}
                                className="admin-input"
                                style={{ width: 70 }}
                              />
                            </label>
                          </div>
                          {renderDataFields(editForm.data)}
                          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                            {editing.startsWith('new-') ? (
                              <button onClick={saveNewEntry} disabled={saving[editing]} className="admin-btn admin-btn-primary admin-btn-sm">
                                {saving[editing] ? 'Creating...' : 'Create'}
                              </button>
                            ) : (
                              <button onClick={() => saveEdit(entry)} disabled={saving[entry.id]} className="admin-btn admin-btn-primary admin-btn-sm">
                                {saving[entry.id] ? 'Saving...' : 'Save'}
                              </button>
                            )}
                            <button onClick={cancelEdit} className="admin-btn admin-btn-sm">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="admin-entry-meta">
                            <span className="admin-entry-id">#{entry.id.slice(0, 8)}</span>
                            <span className="admin-entry-order">sort: {entry.sort_order}</span>
                            <span className="admin-entry-date">{new Date(entry.updated_at).toLocaleDateString()}</span>
                          </div>
                          <div className="admin-entry-summary">
                            {entry.data.title || entry.data.text
                              ? (entry.data.title || entry.data.text).slice(0, 120)
                              : JSON.stringify(entry.data).slice(0, 120)}
                            {(entry.data.title || entry.data.text
                              ? (entry.data.title || entry.data.text).length > 120
                              : JSON.stringify(entry.data).length > 120) ? '...' : ''}
                          </div>
                          <div className="admin-entry-actions">
                            <button onClick={() => startEdit(entry)} className="admin-btn admin-btn-sm">
                              Edit
                            </button>
                            <button
                              onClick={() => deleteEntry(entry.id)}
                              disabled={deleting === entry.id}
                              className="admin-btn admin-btn-sm admin-btn-danger"
                            >
                              {deleting === entry.id ? '...' : 'Delete'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
