/* Omnyvora Workspace — Section 2: Applications */

function Applications({ onOpenApp }) {
  const cats = ['All', ...Array.from(new Set(APPS.map(a => a.category)))];
  const [cat, setCat] = React.useState('All');
  const list = cat === 'All' ? APPS : APPS.filter(a => a.category === cat);

  return (
    <Page>
      <PageHead title="Applications" subtitle="All available services on Omnyvora." />

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {cats.map(c => {
          const active = c === cat;
          return (
            <button key={c} onClick={() => setCat(c)}
              style={{
                height: 32, padding: '0 14px', borderRadius: 'var(--radius-pill)', cursor: 'pointer',
                border: `0.5px solid ${active ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                background: active ? 'var(--accent-subtle)' : 'var(--bg-surface-raised)',
                color: active ? 'var(--accent-text)' : 'var(--text-secondary)',
                font: `${active ? 500 : 400} 13px var(--font-sans)`,
                transition: 'background var(--duration-fast) var(--ease), border-color var(--duration-fast) var(--ease), color var(--duration-fast) var(--ease)',
              }}>{c}</button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {list.map(a => <AppCard key={a.id} app={a} showCategory onOpen={onOpenApp} />)}
      </div>
    </Page>
  );
}

Object.assign(window, { Applications });
