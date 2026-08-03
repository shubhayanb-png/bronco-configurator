import { useConfig, formatINR } from './store'

export default function TopBar() {
  // Subscribe to the values that affect price so the bar re-renders on change
  const paintColor = useConfig((s) => s.paintColor)
  const wheelFinish = useConfig((s) => s.wheelFinish)
  const getTotal = useConfig((s) => s.getTotal)

  const total = getTotal()

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 32px',
      zIndex: 30,
      pointerEvents: 'none',
      fontFamily: 'system-ui, sans-serif',
    }}>
      {/* Left: model name */}
      <div style={{ pointerEvents: 'auto' }}>
        <div style={{
          fontSize: '20px',
          fontWeight: 700,
          color: '#1a1a1a',
          letterSpacing: '0.02em',
        }}>
          FORD BRONCO
        </div>
        <div style={{
          fontSize: '12px',
          color: '#666',
          letterSpacing: '0.08em',
          marginTop: '2px',
        }}>
          BADLANDS · 4-DOOR
        </div>
      </div>

      {/* Right: running price */}
      <div style={{ pointerEvents: 'auto', textAlign: 'right' }}>
        <div style={{
          fontSize: '11px',
          color: '#888',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          Total Price
        </div>
        <div style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#1a1a1a',
          marginTop: '2px',
        }}>
          {formatINR(total)}
        </div>
      </div>
    </div>
  )
}