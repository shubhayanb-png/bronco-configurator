import { useState } from 'react'

function Swatch({ name, hex, active, x, y, anchorRight, open, delay, onSelect }) {
  const [isHover, setIsHover] = useState(false)
  const size = isHover ? 56 : active ? 48 : 36

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{
        position: 'absolute',
        top: '50%',
        right: `${anchorRight}px`,
        transform: `translate(${x}px, ${y}px) translate(50%, -50%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '14px',
        cursor: 'pointer',
        pointerEvents: open ? 'auto' : 'none',
        opacity: open ? 1 : 0,
        transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease',
        transitionDelay: open ? `${delay}s` : '0s',
      }}
    >
      <span style={{
        fontSize: isHover || active ? '15px' : '13px',
        fontFamily: 'system-ui, sans-serif',
        color: '#2a2a2a',
        opacity: isHover || active ? 1 : 0.55,
        fontWeight: isHover || active ? 600 : 400,
        whiteSpace: 'nowrap',
        transition: 'all 0.25s ease',
      }}>
        {name}
      </span>
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: hex,
        border: active ? '3px solid #fff' : '2px solid rgba(255,255,255,0.7)',
        boxShadow: isHover ? '0 6px 20px rgba(0,0,0,0.35)' : '0 2px 8px rgba(0,0,0,0.18)',
        transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        flexShrink: 0,
      }} />
    </div>
  )
}

export default function FanButton({
  label,
  options,
  activeValue,
  onSelect,
  getHex,
  getName,
  verticalOffset = 0,
  open,
  setOpen,
  dimmed,
}) {
  const count = options.length
  const arcRadius = 190
  const arcSpread = 150
  const anchorRight = 70

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      right: 0,
      width: '100%',
      height: '100%',
      zIndex: 10,
      pointerEvents: 'none',
      overflow: 'hidden',
      opacity: dimmed ? 0 : 1,
      transition: 'opacity 0.35s ease',
    }}>
      {options.map((opt, i) => {
        const t = count === 1 ? 0.5 : i / (count - 1)
        const angle = (-arcSpread / 2 + t * arcSpread) * (Math.PI / 180)
        const x = open ? -Math.cos(angle) * arcRadius : 0
        const y = open ? Math.sin(angle) * arcRadius : 0
        return (
          <Swatch
            key={getName(opt)}
            name={getName(opt)}
            hex={getHex(opt)}
            active={getName(activeValue) === getName(opt)}
            x={x}
            y={y + verticalOffset}
            anchorRight={anchorRight}
            open={open}
            delay={i * 0.03}
            onSelect={() => onSelect(opt)}
          />
        )
      })}

      <div
        onClick={() => setOpen(open ? null : true)}
        style={{
          position: 'absolute',
          top: '50%',
          right: `${anchorRight}px`,
          transform: `translate(50%, calc(-50% + ${verticalOffset}px))`,
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: '#1a1a1a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          cursor: 'pointer',
          pointerEvents: 'auto',
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
          zIndex: 20,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = `translate(50%, calc(-50% + ${verticalOffset}px)) scale(1.08)`)}
        onMouseLeave={(e) => (e.currentTarget.style.transform = `translate(50%, calc(-50% + ${verticalOffset}px)) scale(1)`)}
      >
        <div style={{
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          background: getHex(activeValue),
          border: '2px solid rgba(255,255,255,0.8)',
          transition: 'background 0.3s ease',
        }} />
        <span style={{
          fontSize: '9px',
          fontFamily: 'system-ui, sans-serif',
          color: '#fff',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textAlign: 'center',
          lineHeight: 1.2,
        }}>
          {label}
        </span>
      </div>
    </div>
  )
}