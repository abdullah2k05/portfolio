import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { defaultPortfolioContent } from '../data/defaultPortfolioContent';
import useSEO from '../hooks/useSEO';

/* ───── Section config ───── */
const SECTIONS = [
  {
    key: 'aboutParagraphs', label: 'About — Paragraphs',
    icon: '📝', desc: 'Bio paragraphs shown in the About section',
    fields: [
      { key: 'text', label: 'Paragraph Text', type: 'textarea', rows: 4 },
      { key: 'linkLabel', label: 'Link Label (optional)', type: 'text' },
      { key: 'linkUrl', label: 'Link URL (optional)', type: 'text' },
    ],
    preview: (d) => (
      <div>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: '#aaa', maxWidth: 500 }}>{d.text}</p>
        {d.linkUrl && d.linkLabel && (
          <div style={{ fontSize: 12, color: '#4a9eff', marginTop: 8, fontFamily: "'JetBrains Mono', monospace" }}>
            {d.linkLabel} ↗
          </div>
        )}
      </div>
    ),
  },
  {
    key: 'aboutStats', label: 'About — Stats',
    icon: '📊', desc: 'Stat boxes next to the bio (value + label)',
    fields: [
      { key: 'value', label: 'Value (e.g. "3+")', type: 'text' },
      { key: 'label', label: 'Label (e.g. "AI Projects Built")', type: 'text' },
      { key: 'linkLabel', label: 'Link Label (optional)', type: 'text' },
      { key: 'linkUrl', label: 'Link URL (optional)', type: 'text' },
    ],
    preview: (d) => (
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', padding: '16px 24px', background: '#161616', borderRadius: 8, border: '1px solid #2e2e2e' }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: '#fff', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2 }}>{d.value}</span>
        <span style={{ fontSize: 11, color: '#888', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{d.label}</span>
        {d.linkUrl && d.linkLabel && (
          <div style={{ fontSize: 12, color: '#4a9eff', marginTop: 8, fontFamily: "'JetBrains Mono', monospace" }}>
            {d.linkLabel} ↗
          </div>
        )}
      </div>
    ),
  },
  {
    key: 'aboutHighlights', label: 'About — Highlights',
    icon: '⭐', desc: 'Highlight cards on the right side of About',
    fields: [
      { key: 'icon', label: 'Icon (emoji)', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'text', label: 'Description', type: 'textarea', rows: 3 },
      { key: 'linkLabel', label: 'Link Label (optional)', type: 'text' },
      { key: 'linkUrl', label: 'Link URL (optional)', type: 'text' },
    ],
    preview: (d) => (
      <div style={{ padding: '16px 20px', background: '#161616', borderRadius: 8, borderLeft: '2px solid #c8c8c8' }}>
        <div style={{ fontSize: 22, marginBottom: 6 }}>{d.icon}</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', marginBottom: 4 }}>{d.title}</div>
        <div style={{ fontSize: 13, color: '#888', lineHeight: 1.6 }}>{d.text}</div>
        {d.linkUrl && d.linkLabel && (
          <div style={{ fontSize: 12, color: '#4a9eff', marginTop: 8, fontFamily: "'JetBrains Mono', monospace" }}>
            {d.linkLabel} ↗
          </div>
        )}
      </div>
    ),
  },
  {
    key: 'skills', label: 'Skills / Expertise',
    icon: '🛠️', desc: 'Skill category cards in the Expertise section',
    fields: [
      { key: 'icon', label: 'Icon (emoji)', type: 'text' },
      { key: 'title', label: 'Category Title', type: 'text' },
      { key: 'tags', label: 'Skills (one per line)', type: 'array' },
      { key: 'linkLabel', label: 'Link Label (optional)', type: 'text' },
      { key: 'linkUrl', label: 'Link URL (optional)', type: 'text' },
    ],
    preview: (d) => (
      <div style={{ padding: '16px 20px', background: '#161616', borderRadius: 8, border: '1px solid #2e2e2e' }}>
        <div style={{ fontSize: 22, marginBottom: 4 }}>{d.icon}</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', marginBottom: 8 }}>{d.title}</div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {(d.tags || []).map(t => (
            <span key={t} style={{ fontSize: 11, padding: '2px 8px', background: '#2e2e2e', borderRadius: 4, color: '#aaa' }}>{t}</span>
          ))}
        </div>
        {d.linkUrl && d.linkLabel && (
          <div style={{ fontSize: 12, color: '#4a9eff', marginTop: 8, fontFamily: "'JetBrains Mono', monospace" }}>
            {d.linkLabel} ↗
          </div>
        )}
      </div>
    ),
  },
  {
    key: 'projects', label: 'Projects',
    icon: '🚀', desc: 'Featured project cards on the homepage',
    fields: [
      { key: 'title', label: 'Project Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea', rows: 4 },
      { key: 'tech', label: 'Tech Stack (one per line)', type: 'array' },
      { key: 'liveUrl', label: 'Live Demo URL', type: 'text' },
      { key: 'githubUrl', label: 'GitHub URL', type: 'text' },
      { key: 'linkLabel', label: 'Link Label (optional)', type: 'text' },
      { key: 'linkUrl', label: 'Link URL (optional)', type: 'text' },
    ],
    preview: (d) => (
      <div style={{ padding: '16px 20px', background: '#161616', borderRadius: 8, border: '1px solid #2e2e2e' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#f0f0f0', marginBottom: 4, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1 }}>{(d.title || '').toUpperCase()}</div>
        <div style={{ fontSize: 11, color: '#888', marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>{(d.tech || []).join(' · ')}</div>
        <div style={{ fontSize: 13, color: '#aaa', lineHeight: 1.6 }}>{(d.description || '').slice(0, 150)}</div>
        {d.linkUrl && d.linkLabel && (
          <div style={{ fontSize: 12, color: '#4a9eff', marginTop: 8, fontFamily: "'JetBrains Mono', monospace" }}>
            {d.linkLabel} ↗
          </div>
        )}
      </div>
    ),
  },
  {
    key: 'photoSlides', label: 'Photo Slides',
    icon: '📸', desc: 'Images shown in the photography carousel',
    fields: [
      { key: 'label', label: 'Image Label / Caption', type: 'text' },
      { key: 'image', label: 'Image Path (e.g. /images/two.jpg)', type: 'text' },
      { key: 'linkLabel', label: 'Link Label (optional)', type: 'text' },
      { key: 'linkUrl', label: 'Link URL (optional)', type: 'text' },
    ],
    preview: (d) => (
      <div style={{ padding: '12px 16px', background: '#161616', borderRadius: 8, border: '1px solid #2e2e2e', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 60, height: 40, background: '#2e2e2e', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#666', overflow: 'hidden' }}>
          {d.image ? <span style={{ fontSize: 20 }}>🖼️</span> : '?'}
        </div>
        <div>
          <div style={{ fontSize: 13, color: '#f0f0f0' }}>{d.label}</div>
          <div style={{ fontSize: 11, color: '#666', fontFamily: "'JetBrains Mono', monospace" }}>{d.image}</div>
        </div>
        {d.linkUrl && d.linkLabel && (
          <div style={{ fontSize: 12, color: '#4a9eff', marginTop: 8, fontFamily: "'JetBrains Mono', monospace" }}>
            {d.linkLabel} ↗
          </div>
        )}
      </div>
    ),
  },
  {
    key: 'events', label: 'Events',
    icon: '🎪', desc: 'Events timeline in the Media section',
    fields: [
      { key: 'year', label: 'Year (e.g. "24")', type: 'text' },
      { key: 'title', label: 'Event Title', type: 'text' },
      { key: 'org', label: 'Organization', type: 'text' },
      { key: 'role', label: 'Your Role', type: 'text' },
      { key: 'linkLabel', label: 'Link Label (optional)', type: 'text' },
      { key: 'linkUrl', label: 'Link URL (optional)', type: 'text' },
    ],
    preview: (d) => (
      <div style={{ padding: '14px 18px', background: '#161616', borderRadius: 8, border: '1px solid #2e2e2e', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#666', fontFamily: "'Bebas Neue', sans-serif", minWidth: 30 }}>{d.year}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>{d.title}</div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{d.org}</div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{d.role}</div>
          {d.linkUrl && d.linkLabel && (
            <div style={{ fontSize: 12, color: '#4a9eff', marginTop: 8, fontFamily: "'JetBrains Mono', monospace" }}>
              {d.linkLabel} ↗
            </div>
          )}
        </div>
      </div>
    ),
  },
  {
    key: 'products', label: 'Products',
    icon: '💳', desc: 'Paid tools and digital products for sale',
    fields: [
      { key: 'title', label: 'Product Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea', rows: 4 },
      { key: 'price', label: 'Price (e.g. "$29")', type: 'text' },
      { key: 'image', label: 'Image URL / Path', type: 'text' },
      { key: 'features', label: 'Features (one per line)', type: 'array' },
      { key: 'linkLabel', label: 'Link Label (e.g. "Buy Now")', type: 'text' },
      { key: 'linkUrl', label: 'Link URL', type: 'text' },
    ],
    preview: (d) => (
      <div style={{ padding: '16px 20px', background: '#161616', borderRadius: 8, border: '1px solid #2e2e2e' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          {d.image && <div style={{ width: 60, height: 60, background: '#2e2e2e', borderRadius: 6, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#666' }}>📷</div>}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#f0f0f0', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1 }}>{d.title}</span>
              {d.price && <span style={{ fontSize: 10, padding: '2px 8px', background: '#1a3a1a', borderRadius: 4, color: '#6aff6a', fontFamily: "'JetBrains Mono', monospace" }}>{d.price}</span>}
            </div>
            <div style={{ fontSize: 12, color: '#888', lineHeight: 1.5, marginBottom: 6 }}>{(d.description || '').slice(0, 100)}</div>
            {d.features && d.features.length > 0 && (
              <div style={{ fontSize: 11, color: '#aaa', fontFamily: "'JetBrains Mono', monospace" }}>{d.features.slice(0, 3).join(' · ')}</div>
            )}
          </div>
        </div>
      </div>
    ),
  },
  {
    key: 'experience', label: 'Experience',
    icon: '💼', desc: 'Career timeline entries',
    fields: [
      { key: 'title', label: 'Organization / Company', type: 'text' },
      { key: 'role', label: 'Your Role', type: 'text' },
      { key: 'subtitle', label: 'Subtitle (optional)', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea', rows: 3 },
      { key: 'linkLabel', label: 'Link Label (optional)', type: 'text' },
      { key: 'linkUrl', label: 'Link URL (optional)', type: 'text' },
    ],
    preview: (d) => (
      <div style={{ padding: '14px 18px', background: '#161616', borderRadius: 8, border: '1px solid #2e2e2e' }}>
        <div style={{ fontSize: 11, color: '#888', fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>{d.role}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#f0f0f0', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1 }}>{(d.title || '').toUpperCase()}</div>
        {d.subtitle && <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{d.subtitle}</div>}
        <div style={{ fontSize: 13, color: '#aaa', lineHeight: 1.6, marginTop: 6 }}>{(d.description || '').slice(0, 120)}</div>
        {d.linkUrl && d.linkLabel && (
          <div style={{ fontSize: 12, color: '#4a9eff', marginTop: 8, fontFamily: "'JetBrains Mono', monospace" }}>
            {d.linkLabel} ↗
          </div>
        )}
      </div>
    ),
  },
  {
    key: 'education', label: 'Education',
    icon: '🎓', desc: 'Education timeline entries',
    fields: [
      { key: 'period', label: 'Period (e.g. "2024 - 2028")', type: 'text' },
      { key: 'title', label: 'Institution', type: 'text' },
      { key: 'subtitle', label: 'Degree / Program', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea', rows: 3 },
      { key: 'linkLabel', label: 'Link Label (optional)', type: 'text' },
      { key: 'linkUrl', label: 'Link URL (optional)', type: 'text' },
    ],
    preview: (d) => (
      <div style={{ padding: '14px 18px', background: '#161616', borderRadius: 8, border: '1px solid #2e2e2e' }}>
        <div style={{ fontSize: 11, color: '#888', fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>{d.period}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#f0f0f0', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1 }}>{d.title}</div>
        <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{d.subtitle}</div>
        <div style={{ fontSize: 13, color: '#aaa', lineHeight: 1.6, marginTop: 6 }}>{(d.description || '').slice(0, 120)}</div>
        {d.linkUrl && d.linkLabel && (
          <div style={{ fontSize: 12, color: '#4a9eff', marginTop: 8, fontFamily: "'JetBrains Mono', monospace" }}>
            {d.linkLabel} ↗
          </div>
        )}
      </div>
    ),
  },
];

const SECTION_MAP = Object.fromEntries(SECTIONS.map(s => [s.key, s]));

/* ───── Notification ───── */
function Notification({ message, type, onClose }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div style={{
      position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 9999,
      padding: '12px 28px', borderRadius: 8,
      background: type === 'error' ? '#3a1a1a' : '#1a3a1a',
      border: `1px solid ${type === 'error' ? 'rgba(255,138,138,0.2)' : 'rgba(138,255,138,0.2)'}`,
      color: type === 'error' ? '#ff8a8a' : '#8aff8a',
      fontSize: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      animation: 'fadeUp 0.3s ease-out',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span>{type === 'error' ? '✕' : '✓'}</span>
      {message}
    </div>
  );
}

/* ───── Confirm Dialog ───── */
function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9998,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        background: '#161616', border: '1px solid #2e2e2e', borderRadius: 12,
        padding: '28px 32px', maxWidth: 400, width: '90%',
      }}>
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 2, color: '#f0f0f0', marginBottom: 10 }}>{title}</h3>
        <p style={{ fontSize: 14, color: '#888', lineHeight: 1.6, marginBottom: 20 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} className="admin-btn admin-btn-sm">Cancel</button>
          <button onClick={onConfirm} className="admin-btn admin-btn-sm admin-btn-danger">Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ───── Field renderers ───── */
function FieldRenderer({ field, value, onChange, sectionKey }) {
  const id = `field-${sectionKey}-${field.key}`;

  if (field.type === 'textarea') {
    return (
      <div className="admin-field">
        <label htmlFor={id} className="admin-field-label">{field.label}</label>
        <textarea
          id={id}
          value={value || ''}
          onChange={e => onChange(field.key, e.target.value)}
          rows={field.rows || 3}
          className="admin-input"
        />
      </div>
    );
  }

  if (field.type === 'array') {
    const arr = value || [];
    return (
      <div className="admin-field">
        <label className="admin-field-label">{field.label}</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {arr.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 6 }}>
              <input
                value={item}
                onChange={e => {
                  const next = [...arr];
                  next[i] = e.target.value;
                  onChange(field.key, next);
                }}
                className="admin-input"
                placeholder="Enter item..."
              />
              <button
                className="admin-btn admin-btn-sm admin-btn-danger"
                onClick={() => onChange(field.key, arr.filter((_, idx) => idx !== i))}
                title="Remove"
              >×</button>
            </div>
          ))}
          <button
            className="admin-btn admin-btn-sm"
            style={{ alignSelf: 'flex-start', borderStyle: 'dashed', opacity: 0.7 }}
            onClick={() => onChange(field.key, [...arr, ''])}
          >+ Add item</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-field">
      <label htmlFor={id} className="admin-field-label">{field.label}</label>
      <input
        id={id}
        type="text"
        value={value || ''}
        onChange={e => onChange(field.key, e.target.value)}
        className="admin-input"
      />
    </div>
  );
}

/* ───── Main Admin ───── */
export default function Admin() {
  useSEO({
    title: 'Admin Portal | Muhammad Abdullah',
    robots: 'noindex, nofollow',
  });

  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [entries, setEntries] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ section: '', data: {} });
  const [importing, setImporting] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [notif, setNotif] = useState({ message: '', type: '' });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [activeSection, setActiveSection] = useState(SECTIONS[0].key);

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
      data: JSON.parse(JSON.stringify(entry.data)),
    });
  }

  function cancelEdit() {
    setEditing(null);
    setEditForm({ section: '', data: {} });
  }

  function updateField(key, value) {
    setEditForm(prev => ({
      ...prev,
      data: { ...prev.data, [key]: value },
    }));
  }

  async function saveEdit(entry) {
    setSaving(s => ({ ...s, [entry.id]: true }));
    const { error } = await supabase
      .from('content_entries')
      .update({ data: editForm.data })
      .eq('id', entry.id);
    setSaving(s => ({ ...s, [entry.id]: false }));
    if (error) { notify(error.message, 'error'); return; }
    notify('Entry updated');
    cancelEdit();
    fetchEntries();
  }

  function handleDeleteClick(id) {
    setConfirmDelete(id);
  }

  async function confirmDeleteEntry() {
    const id = confirmDelete;
    if (!id) return;
    setDeleting(id);
    setConfirmDelete(null);
    const { error } = await supabase.from('content_entries').delete().eq('id', id);
    setDeleting(null);
    if (error) { notify(error.message, 'error'); return; }
    notify('Entry deleted');
    cancelEdit();
    fetchEntries();
  }

  async function moveEntry(entryId, direction) {
    const section = Object.keys(entries).find(s =>
      entries[s].some(e => e.id === entryId)
    );
    if (!section) return;

    const list = entries[section];
    const idx = list.findIndex(e => e.id === entryId);
    if (idx === -1) return;

    const neighborIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (neighborIdx < 0 || neighborIdx >= list.length) return;

    const entry = list[idx];
    const neighbor = list[neighborIdx];

    const temp = entry.sort_order;
    await supabase.from('content_entries').update({ sort_order: neighbor.sort_order }).eq('id', entry.id);
    await supabase.from('content_entries').update({ sort_order: temp }).eq('id', neighbor.id);

    fetchEntries();
    notify(`Entry moved ${direction}`);
  }

  function addEntry(sectionKey) {
    const config = SECTION_MAP[sectionKey];
    const defaults = {};
    if (config) {
      for (const f of config.fields) {
        defaults[f.key] = f.type === 'array' ? [] : '';
      }
    }
    const newEntry = {
      id: `new-${Date.now()}`,
      section: sectionKey,
      data: defaults,
    };
    startEdit(newEntry);
  }

  async function saveNewEntry() {
    if (editing === null) return;
    setSaving(s => ({ ...s, [editing]: true }));

    const existing = entries[editForm.section] || [];
    for (const entry of existing) {
      await supabase
        .from('content_entries')
        .update({ sort_order: entry.sort_order + 1 })
        .eq('id', entry.id);
    }

    const { error } = await supabase
      .from('content_entries')
      .insert({ section: editForm.section, sort_order: 0, data: editForm.data })
      .select();
    setSaving(s => ({ ...s, [editing]: false }));
    if (error) { notify(error.message, 'error'); return; }
    notify('Entry created');
    cancelEdit();
    fetchEntries();
  }

  async function importDefaults() {
    setConfirmDelete(null);
    setImporting(true);
    const rows = [];
    for (const sectionConfig of SECTIONS) {
      const items = defaultPortfolioContent[sectionConfig.key];
      if (!items) continue;
      items.forEach((item, i) => {
        const { id, ...data } = item;
        rows.push({ section: sectionConfig.key, sort_order: i, data });
      });
    }
    await supabase.from('content_entries').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { error } = await supabase.from('content_entries').insert(rows);
    setImporting(false);
    if (error) { notify(error.message, 'error'); return; }
    notify(`Imported ${rows.length} entries`);
    fetchEntries();
  }

  /* ───── Not configured ───── */
  if (!isSupabaseConfigured()) {
    return (
      <div className="admin-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: 3, marginBottom: 12 }}>Admin Portal</h1>
          <p style={{ color: '#ff8a8a', fontSize: 14 }}>
            Supabase is not configured.
          </p>
          <p style={{ color: '#888', fontSize: 13, marginTop: 12 }}>
            Set <code style={{ background: '#1e1e1e', padding: '2px 6px', borderRadius: 4 }}>VITE_SUPABASE_URL</code> and{' '}
            <code style={{ background: '#1e1e1e', padding: '2px 6px', borderRadius: 4 }}>VITE_SUPABASE_ANON_KEY</code> in your environment.
          </p>
        </div>
      </div>
    );
  }

  /* ───── Login ───── */
  if (!session) {
    return (
      <div className="admin-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{
          width: '100%', maxWidth: 380,
          background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12, padding: '40px 32px',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🔐</div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 3 }}>Admin Portal</h1>
            <p style={{ fontSize: 13, color: '#888', marginTop: 8 }}>Sign in to manage your portfolio content</p>
          </div>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input
              type="email" placeholder="Email"
              value={email} onChange={e => setEmail(e.target.value)}
              required className="admin-input"
            />
            <input
              type="password" placeholder="Password"
              value={password} onChange={e => setPassword(e.target.value)}
              required className="admin-input"
            />
            {authError && <p style={{ color: '#ff8a8a', fontSize: 13, margin: 0 }}>{authError}</p>}
            <button type="submit" disabled={authLoading} className="admin-btn admin-btn-primary" style={{ width: '100%', padding: '14px', fontSize: 14 }}>
              {authLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ───── Dashboard ───── */
  return (
    <div className="admin-page">
      <Notification message={notif.message} type={notif.type} onClose={clearNotif} />
      <ConfirmDialog
        open={confirmDelete !== null}
        title="Delete entry?"
        message="This cannot be undone. The change will go live immediately."
        onConfirm={confirmDeleteEntry}
        onCancel={() => setConfirmDelete(null)}
      />

      {/* Header */}
      <div className="admin-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 24 }}>⚙️</span>
          <div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 3, margin: 0 }}>Portfolio Admin</h1>
            <p style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{session.user.email}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              if (!confirm('Import defaults replaces ALL existing content. Continue?')) return;
              importDefaults();
            }}
            disabled={importing}
            className="admin-btn admin-btn-sm"
            style={{ background: '#1a2a1a', borderColor: '#2a4a2a', color: '#6aff6a' }}
          >
            {importing ? 'Importing...' : 'Import Defaults'}
          </button>
          <button onClick={() => { cancelEdit(); fetchEntries(); }} className="admin-btn admin-btn-sm">
            Refresh
          </button>
          <button onClick={handleLogout} className="admin-btn admin-btn-sm admin-btn-danger">
            Sign Out
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 80, color: '#666' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          <p>Loading content...</p>
        </div>
      ) : (
        <div className="admin-body">
          {/* Section tabs */}
          <div className="admin-tabs">
            {SECTIONS.map(s => (
              <button
                key={s.key}
                className={`admin-tab${activeSection === s.key ? ' active' : ''}`}
                onClick={() => { cancelEdit(); setActiveSection(s.key); }}
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
                <span className="admin-tab-count">{(entries[s.key] || []).length}</span>
              </button>
            ))}
          </div>

          {/* Active section */}
          {SECTIONS.filter(s => s.key === activeSection).map(section => {
            const sectionEntries = entries[section.key] || [];
            const isCreatingNew = editing && editing.startsWith('new-') && editForm.section === section.key;
            return (
              <div key={section.key} className="admin-section">
                <div className="admin-section-header">
                  <div>
                    <h2 className="admin-section-title">
                      <span style={{ marginRight: 8 }}>{section.icon}</span>
                      {section.label}
                    </h2>
                    <p className="admin-section-desc">{section.desc}</p>
                  </div>
                  <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={() => addEntry(section.key)}>
                    + New Entry
                  </button>
                </div>

                {isCreatingNew && (
                  <div className="admin-entry editing" style={{ marginBottom: 24 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <span style={{ fontSize: 12, color: '#888', fontFamily: "'JetBrains Mono', monospace" }}>
                          Creating new entry
                        </span>
                      </div>

                      {section.fields.map(field => (
                        <FieldRenderer
                          key={field.key}
                          field={field}
                          value={editForm.data[field.key]}
                          onChange={updateField}
                          sectionKey={section.key}
                        />
                      ))}

                      <div className="admin-preview-wrap">
                        <div className="admin-preview-label">Live Preview</div>
                        <div className="admin-preview-box">
                          {section.preview(editForm.data)}
                        </div>
                      </div>

                      <div className="admin-entry-actions" style={{ marginTop: 16 }}>
                        <button onClick={saveNewEntry} disabled={saving[editing]} className="admin-btn admin-btn-primary">
                          {saving[editing] ? 'Creating...' : 'Create Entry'}
                        </button>
                        <button onClick={cancelEdit} className="admin-btn">Cancel</button>
                      </div>
                    </div>
                  </div>
                )}

                {!isCreatingNew && sectionEntries.length === 0 ? (
                  <div className="admin-empty">
                    <p>No entries yet. Click "+ New Entry" to create one.</p>
                  </div>
                ) : (
                  <div className="admin-entries">
                    {sectionEntries.map((entry, idx) => (
                      <div key={entry.id} className={`admin-entry${editing === entry.id ? ' editing' : ''}`}>
                        {editing === entry.id ? (
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                              <span style={{ fontSize: 12, color: '#888', fontFamily: "'JetBrains Mono', monospace" }}>
                                Editing #{entry.id.slice(0, 8)}
                              </span>
                              <span style={{ fontSize: 11, color: '#666' }}>sort: {entry.sort_order}</span>
                            </div>

                            {section.fields.map(field => (
                              <FieldRenderer
                                key={field.key}
                                field={field}
                                value={editForm.data[field.key]}
                                onChange={updateField}
                                sectionKey={section.key}
                              />
                            ))}

                            <div className="admin-preview-wrap">
                              <div className="admin-preview-label">Live Preview</div>
                              <div className="admin-preview-box">
                                {section.preview(editForm.data)}
                              </div>
                            </div>

                            <div className="admin-entry-actions" style={{ marginTop: 16 }}>
                              <button onClick={() => saveEdit(entry)} disabled={saving[entry.id]} className="admin-btn admin-btn-primary">
                                {saving[entry.id] ? 'Saving...' : 'Save Changes'}
                              </button>
                              <button onClick={cancelEdit} className="admin-btn">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="admin-entry-meta">
                              <span className="admin-entry-id">#{idx + 1}</span>
                              <span className="admin-entry-date">
                                {new Date(entry.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                              <span className="admin-entry-order">sort: {entry.sort_order}</span>
                            </div>
                            <div className="admin-entry-preview">
                              {section.preview(entry.data)}
                            </div>
                            <div className="admin-entry-actions">
                              <button
                                onClick={() => moveEntry(entry.id, 'up')}
                                disabled={idx === 0 || saving[entry.id]}
                                className="admin-btn admin-btn-sm"
                                title="Move up"
                              >↑</button>
                              <button
                                onClick={() => moveEntry(entry.id, 'down')}
                                disabled={idx === sectionEntries.length - 1 || saving[entry.id]}
                                className="admin-btn admin-btn-sm"
                                title="Move down"
                              >↓</button>
                              <button onClick={() => startEdit(entry)} className="admin-btn admin-btn-sm">
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => handleDeleteClick(entry.id)}
                                disabled={deleting === entry.id}
                                className="admin-btn admin-btn-sm admin-btn-danger"
                              >
                                {deleting === entry.id ? '...' : '🗑️ Delete'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
