import { navTabs, useConfig } from './store'

export default function NavBar() {
  const activeTab = useConfig((s) => s.activeTab)
  const setActiveTab = useConfig((s) => s.setActiveTab)
  const toggleConfig = useConfig((s) => s.toggleConfig)

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      padding: '0 28px',
      height: '80px',
      background: 'rgba(245, 243, 238, 0.9)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(0,0,0,0.06)',
      zIndex: 10000,
      fontFamily: 'system-ui, sans-serif',
      gap: '24px',
    }}>
      {/* Logo image (transparent PNG) */}
      <img
        src="/ui/bronco-logo.png"
        alt="Bronco"
        style={{
          height: '64px',
          width: 'auto',
          objectFit: 'contain',
          flexShrink: 0,
        }}
      />

      {/* Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '26px',
        flex: 1,
        justifyContent: 'center',
      }}>
        {navTabs.map((tab) => {
          const active = activeTab === tab.id
          return (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                position: 'relative',
                fontSize: '12.5px',
                fontWeight: active ? 700 : 500,
                letterSpacing: '0.06em',
                color: active ? '#1a1a1a' : '#6b6b6b',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                paddingBottom: '4px',
                transition: 'color 0.2s ease',
              }}
            >
              {tab.label}
              {active && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '2px',
                  background: '#c8542a',
                  borderRadius: '2px',
                }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Build button + hamburger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #d9622a, #b8461c)',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          padding: '11px 22px',
          borderRadius: '24px',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}>
          BUILD MY BRONCO
        </div>

        <div
          onClick={toggleConfig}
          title="Show Configuration"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            cursor: 'pointer',
            padding: '6px',
          }}
        >
          <span style={{ width: '22px', height: '2px', background: '#1a1a1a', borderRadius: '2px' }} />
          <span style={{ width: '22px', height: '2px', background: '#1a1a1a', borderRadius: '2px' }} />
          <span style={{ width: '22px', height: '2px', background: '#1a1a1a', borderRadius: '2px' }} />
        </div>
      </div>
    </div>
  )
}