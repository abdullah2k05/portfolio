import { useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import { fallbackContent, portfolioSections } from '../lib/contentRepository';
import '../index.css';
import './admin.css';

const SECTION_CONFIG = {
  aboutParagraphs: {
    label: 'About Paragraphs',
    empty: { text: '' },
    fields: [{ key: 'text', label: 'Paragraph', type: 'textarea' }],
  },
  aboutStats: {
    label: 'About Stats',
    empty: { value: '', label: '' },
    fields: [
      { key: 'value', label: 'Value', type: 'text' },
      { key: 'label', label: 'Label', type: 'text' },
    ],
  },
  aboutHighlights: {
    label: 'About Highlights',
    empty: { icon: '', title: '', text: '', linkLabel: '', linkUrl: '' },
    fields: [
      { key: 'icon', label: 'Icon', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'text', label: 'Text', type: 'textarea' },
      { key: 'linkLabel', label: 'Link Label', type: 'text' },
      { key: 'linkUrl', label: 'Link URL', type: 'url' },
    ],
  },
  skills: {
    label: 'Skills',
    empty: { icon: '', title: '', tags: '' },
    fields: [
      { key: 'icon', label: 'Icon', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'tags', label: 'Tags (comma separated)', type: 'text' },
    ],
  },
  projects: {
    label: 'Projects',
    empty: { title: '', description: '', tech: '', liveUrl: '', githubUrl: '' },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'tech', label: 'Tech (comma separated)', type: 'text' },
      { key: 'liveUrl', label: 'Live URL', type: 'url' },
      { key: 'githubUrl', label: 'GitHub URL', type: 'url' },
    ],
  },
  photoSlides: {
    label: 'Photo Slides',
    empty: { label: '', image: '' },
    fields: [
      { key: 'label', label: 'Caption', type: 'text' },
      { key: 'image', label: 'Image Path/URL', type: 'text' },
    ],
  },
  events: {
    label: 'Events',
    empty: { year: '', title: '', org: '', role: '' },
    fields: [
      { key: 'year', label: 'Year', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'org', label: 'Organization', type: 'text' },
      { key: 'role', label: 'Role/Details', type: 'textarea' },
    ],
  },
  experience: {
    label: 'Experience',
    empty: { title: '', role: '', subtitle: '', description: '' },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'role', label: 'Role', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
    ],
  },
  education: {
    label: 'Education',
    empty: { period: '', title: '', subtitle: '', description: '' },
    fields: [
      { key: 'period', label: 'Period', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
    ],
  },
};

const listToCsv = (value) => (Array.isArray(value) ? value.join(', ') : '');
const csvToList = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const normalizeForEditor = (section, entry) => {
  const base = { id: entry.id, sort_order: entry.sort_order ?? 0 };
  const data = entry.data || {};
  if (section === 'skills') return { ...base, icon: data.icon || '', title: data.title || '', tags: listToCsv(data.tags) };
  if (section === 'projects') {
    return {
      ...base,
      title: data.title || '',
      description: data.description || '',
      tech: listToCsv(data.tech),
      liveUrl: data.liveUrl || '',
      githubUrl: data.githubUrl || '',
    };
  }
  return { ...base, ...data };
};

const normalizeFallbackForEditor = (section, entry, idx) => {
  if (section === 'skills') return { id: entry.id || `local-${idx}`, sort_order: idx, icon: entry.icon, title: entry.title, tags: listToCsv(entry.tags) };
  if (section === 'projects') {
    return {
      id: entry.id || `local-${idx}`,
      sort_order: idx,
      title: entry.title,
      description: entry.description,
      tech: listToCsv(entry.tech),
      liveUrl: entry.liveUrl,
      githubUrl: entry.githubUrl,
    };
  }
  return { id: entry.id || `local-${idx}`, sort_order: idx, ...entry };
};

const cleanPayload = (section, entry) => {
  const { id, sort_order } = entry;
  let data = { ...entry };
  delete data.id;
  delete data.sort_order;

  if (section === 'skills') data.tags = csvToList(entry.tags);
  if (section === 'projects') data.tech = csvToList(entry.tech);

  return { id, sort_order: Number(sort_order) || 0, data };
};

const toDatabaseData = (section, entry) => {
  const { id, ...data } = entry;
  if (section === 'skills') return { ...data, tags: Array.isArray(data.tags) ? data.tags : csvToList(data.tags) };
  if (section === 'projects') return { ...data, tech: Array.isArray(data.tech) ? data.tech : csvToList(data.tech) };
  return data;
};

export default function AdminApp() {
  const [session, setSession] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState('');
  const [activeSection, setActiveSection] = useState('skills');
  const [entriesBySection, setEntriesBySection] = useState({});
  const [collapsedById, setCollapsedById] = useState({});

  useEffect(() => {
    if (!isSupabaseConfigured) {
      const seeded = {};
      portfolioSections.forEach((section) => {
        seeded[section] = (fallbackContent[section] || []).map((entry, idx) =>
          normalizeFallbackForEditor(section, entry, idx)
        );
      });
      setEntriesBySection(seeded);
      setLoading(false);
      return;
    }

    let active = true;
    const boot = async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setSession(data.session ?? null);
      await loadEntries();
    };
    boot();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const loadEntries = async () => {
    if (!isSupabaseConfigured) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('content_entries')
      .select('id, section, sort_order, data')
      .order('section', { ascending: true })
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      setAuthMessage(error.message);
      setLoading(false);
      return;
    }

    const seeded = {};
    portfolioSections.forEach((section) => {
      const rows = (data || []).filter((item) => item.section === section).map((item) => normalizeForEditor(section, item));
      seeded[section] = rows;
    });

    setEntriesBySection(seeded);
    setLoading(false);
  };

  const sectionEntries = useMemo(() => entriesBySection[activeSection] || [], [entriesBySection, activeSection]);

  const entryKey = (section, id) => `${section}:${id}`;

  const toggleCard = (section, id) => {
    const key = entryKey(section, id);
    setCollapsedById((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const setAllCollapsed = (collapsed) => {
    if (!sectionEntries.length) return;
    const next = {};
    sectionEntries.forEach((entry) => {
      next[entryKey(activeSection, entry.id)] = collapsed;
    });
    setCollapsedById((prev) => ({ ...prev, ...next }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthMessage('');
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail.trim(),
      password: loginPassword,
    });
    if (error) {
      setAuthMessage(error.message);
      return;
    }
    setAuthMessage('Signed in.');
    await loadEntries();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const updateEntry = (section, id, key, value) => {
    setEntriesBySection((prev) => {
      const next = [...(prev[section] || [])];
      const index = next.findIndex((item) => item.id === id);
      if (index < 0) return prev;
      next[index] = { ...next[index], [key]: value };
      return { ...prev, [section]: next };
    });
  };

  const addEntry = (section) => {
    const template = SECTION_CONFIG[section]?.empty || {};
    const row = {
      id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      sort_order: (entriesBySection[section] || []).length,
      ...template,
    };
    setEntriesBySection((prev) => ({ ...prev, [section]: [...(prev[section] || []), row] }));
  };

  const saveEntry = async (section, entry) => {
    if (!session) return;
    const savingId = `${section}:${entry.id}`;
    setSavingKey(savingId);
    setAuthMessage('');

    const payload = cleanPayload(section, entry);
    const isNew = String(entry.id).startsWith('new-');
    const rowData = {
      section,
      sort_order: payload.sort_order,
      data: payload.data,
    };

    const query = isNew
      ? supabase.from('content_entries').insert(rowData).select('id, section, sort_order, data').single()
      : supabase.from('content_entries').update(rowData).eq('id', entry.id).select('id, section, sort_order, data').single();

    const { data, error } = await query;
    setSavingKey('');
    if (error) {
      setAuthMessage(error.message);
      return;
    }

    setEntriesBySection((prev) => {
      const current = [...(prev[section] || [])];
      const idx = current.findIndex((item) => item.id === entry.id);
      const nextRow = normalizeForEditor(section, data);
      if (idx >= 0) current[idx] = nextRow;
      return { ...prev, [section]: current };
    });
    setAuthMessage('Saved.');
  };

  const deleteEntry = async (section, entryId) => {
    if (!session || String(entryId).startsWith('new-')) {
      setEntriesBySection((prev) => ({
        ...prev,
        [section]: (prev[section] || []).filter((item) => item.id !== entryId),
      }));
      return;
    }

    const savingId = `${section}:${entryId}`;
    setSavingKey(savingId);
    setAuthMessage('');
    const { error } = await supabase.from('content_entries').delete().eq('id', entryId);
    setSavingKey('');
    if (error) {
      setAuthMessage(error.message);
      return;
    }
    setEntriesBySection((prev) => ({
      ...prev,
      [section]: (prev[section] || []).filter((item) => item.id !== entryId),
    }));
    setAuthMessage('Deleted.');
  };

  const importDefaults = async () => {
    if (!session) return;
    setSavingKey('import-defaults');
    setAuthMessage('');

    const { count, error: countError } = await supabase
      .from('content_entries')
      .select('id', { count: 'exact', head: true });

    if (countError) {
      setSavingKey('');
      setAuthMessage(countError.message);
      return;
    }

    if ((count || 0) > 0) {
      setSavingKey('');
      setAuthMessage('Table already has content. Clear rows first before importing defaults.');
      return;
    }

    const rows = [];
    portfolioSections.forEach((section) => {
      (fallbackContent[section] || []).forEach((entry, idx) => {
        rows.push({
          section,
          sort_order: idx,
          data: toDatabaseData(section, entry),
        });
      });
    });

    const { error } = await supabase.from('content_entries').insert(rows);
    setSavingKey('');
    if (error) {
      setAuthMessage(error.message);
      return;
    }

    setAuthMessage('Default content imported.');
    await loadEntries();
  };

  if (!isSupabaseConfigured) {
    return (
      <main className="admin-shell">
        <section className="admin-panel">
          <h1>Admin Setup Needed</h1>
          <p>Add Supabase URL + anon key in `src/lib/supabaseClient.js` (or set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) to enable persistence.</p>
          <p>You can still preview editable sections here, but changes will not be saved.</p>
        </section>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="admin-shell">
        <section className="admin-panel">
          <h1>Loading admin...</h1>
        </section>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="admin-shell">
        <section className="admin-panel">
          <h1>Portfolio Admin</h1>
          <p>Sign in with your Supabase Auth email and password.</p>
          <form onSubmit={handleLogin} className="admin-form">
            <label>
              Email
              <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
            </label>
            <label>
              Password
              <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
            </label>
            <button type="submit" className="btn-primary"><span>Sign In</span></button>
          </form>
          {authMessage ? <p className="admin-message">{authMessage}</p> : null}
        </section>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <section className="admin-panel">
        <div className="admin-head">
          <h1>Portfolio Content Admin</h1>
          <div className="admin-actions">
            <button
              type="button"
              className="btn-outline"
              onClick={importDefaults}
              disabled={savingKey === 'import-defaults'}
            >
              {savingKey === 'import-defaults' ? 'Importing...' : 'Import Defaults'}
            </button>
            <a href="/" className="btn-outline">Open Website</a>
            <button type="button" className="btn-outline" onClick={handleLogout}>Log Out</button>
          </div>
        </div>

        <div className="admin-tabs">
          {portfolioSections.map((section) => (
            <button
              key={section}
              type="button"
              className={`admin-tab${activeSection === section ? ' active' : ''}`}
              onClick={() => setActiveSection(section)}
            >
              {SECTION_CONFIG[section].label}
            </button>
          ))}
        </div>

        <div className="admin-list">
          <div className="admin-list-head">
            <p className="admin-count">{sectionEntries.length} item{sectionEntries.length === 1 ? '' : 's'}</p>
            <div className="admin-list-actions">
              <button
                type="button"
                className="btn-outline"
                onClick={() => setAllCollapsed(true)}
                disabled={!sectionEntries.length}
              >
                Minimize All
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={() => setAllCollapsed(false)}
                disabled={!sectionEntries.length}
              >
                Expand All
              </button>
            </div>
          </div>

          {!sectionEntries.length ? (
            <article className="admin-item admin-empty-card">
              <p>No entries yet in this section. Add one to get started.</p>
            </article>
          ) : null}

          {sectionEntries.map((entry) => {
            const cardKey = entryKey(activeSection, entry.id);
            const isCollapsed = Boolean(collapsedById[cardKey]);

            return (
              <article key={entry.id} className="admin-item">
                <div className="admin-item-head">
                  <span><strong>ID:</strong> {String(entry.id)}</span>
                  <button
                    type="button"
                    className="admin-card-toggle"
                    onClick={() => toggleCard(activeSection, entry.id)}
                  >
                    {isCollapsed ? 'Expand' : 'Minimize'}
                  </button>
                </div>

                {isCollapsed ? null : (
                  <>
                    <label>
                      Sort Order
                      <input
                        type="number"
                        value={entry.sort_order}
                        onChange={(e) => updateEntry(activeSection, entry.id, 'sort_order', e.target.value)}
                      />
                    </label>

                    {SECTION_CONFIG[activeSection].fields.map((field) => (
                      <label key={field.key}>
                        {field.label}
                        {field.type === 'textarea' ? (
                          <textarea
                            value={entry[field.key] || ''}
                            onChange={(e) => updateEntry(activeSection, entry.id, field.key, e.target.value)}
                          />
                        ) : (
                          <input
                            type={field.type}
                            value={entry[field.key] || ''}
                            onChange={(e) => updateEntry(activeSection, entry.id, field.key, e.target.value)}
                          />
                        )}
                      </label>
                    ))}

                    <div className="admin-item-actions">
                      <button
                        type="button"
                        className="btn-primary"
                        disabled={savingKey === `${activeSection}:${entry.id}`}
                        onClick={() => saveEntry(activeSection, entry)}
                      >
                        <span>{savingKey === `${activeSection}:${entry.id}` ? 'Saving...' : 'Save'}</span>
                      </button>
                      <button
                        type="button"
                        className="btn-outline"
                        disabled={savingKey === `${activeSection}:${entry.id}`}
                        onClick={() => deleteEntry(activeSection, entry.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </article>
            );
          })}
        </div>

        <div className="admin-footer">
          <button type="button" className="btn-primary" onClick={() => addEntry(activeSection)}>
            <span>Add New {SECTION_CONFIG[activeSection].label}</span>
          </button>
          {authMessage ? <p className="admin-message">{authMessage}</p> : null}
        </div>
      </section>
    </main>
  );
}
