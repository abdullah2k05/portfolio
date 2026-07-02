import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { defaultPortfolioContent } from '../data/defaultPortfolioContent';

export function usePortfolioContent() {
  const [content, setContent] = useState(defaultPortfolioContent);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    setLoading(true);
    supabase
      .from('content_entries')
      .select('*')
      .order('sort_order')
      .then(({ data, error }) => {
        setLoading(false);
        if (error || !data || data.length === 0) return;

        const grouped = {};
        for (const row of data) {
          if (!grouped[row.section]) grouped[row.section] = [];
          grouped[row.section].push({
            id: row.id,
            ...row.data,
          });
        }

        setContent(prev => ({
          ...prev,
          ...grouped,
        }));
      });
  }, []);

  return { content, loading };
}
