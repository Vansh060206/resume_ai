'use client';

import { useSimpleTheme } from '@/lib/SimpleTheme';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SimpleThemeSwitcher() {
  const { isDark, toggle, mounted } = useSimpleTheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setReady(true);
  }, []);

  if (!mounted || !ready) return null;

  return (
    <button
      onClick={toggle}
      style={{
        background: isDark ? '#1f2937' : '#f3f4f6',
        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
        padding: '0.5rem',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: isDark ? '#fbbf24' : '#4f46e5',
      }}
      title={isDark ? 'Light Mode' : 'Dark Mode'}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
