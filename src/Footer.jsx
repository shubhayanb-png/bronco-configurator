export default function Footer() {
  const iconStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: '#1a1a1a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#fff',
    fontSize: '18px',
  }

  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      height: '72px',
      zIndex: 40,
      fontFamily: 'system-ui, sans-serif',
      pointerEvents: 'none',
    }}>
      {/* Terms */}
      <div style={{
        fontSize: '12px',
        color: '#555',
        textDecoration: 'underline',
        cursor: 'pointer',
        pointerEvents: 'auto',
      }}>
        Terms and conditions
      </div>

      {/* Disclaimer */}
      <div style={{
        fontSize: '11px',
        color: '#999',
        maxWidth: '620px',
        textAlign: 'center',
        lineHeight: 1.4,
      }}>
        This configurator is intended as a guide only. Designs, specifications, or colors are subject to change and may differ from how they appear on screen or on your vehicle. © Bronco 2026
      </div>

      {/* View preset icons */}
      <div style={{ display: 'flex', gap: '12px', pointerEvents: 'auto' }}>
        <div style={iconStyle} title="Environment">⛰</div>
        <div style={iconStyle} title="Interior">◉</div>
        <div style={iconStyle} title="Seats">▤</div>
        <div style={iconStyle} title="Lift">⇅</div>
      </div>
    </div>
  )
}