import { useEffect, useRef, useState } from 'react'
import { useProgress } from '@react-three/drei'
import { useConfig } from './store'

// Trail traced from /loading/trail-map.jpg (path lives in the image's own 5504x3072 space,
// so it scales perfectly with the background whether the screen is wide or tall).
const TRAIL_D = "M784.0,1072.0 C785.3,1076.0 793.3,1086.7 792.0,1096.0 C790.7,1105.3 781.3,1105.3 776.0,1128.0 C770.7,1150.7 762.7,1198.7 760.0,1232.0 C757.3,1265.3 757.3,1302.0 760.0,1328.0 C762.7,1354.0 773.3,1364.7 776.0,1388.0 C778.7,1411.3 774.7,1452.0 776.0,1468.0 C777.3,1484.0 782.7,1476.7 784.0,1484.0 C785.3,1491.3 781.3,1500.0 784.0,1512.0 C786.7,1524.0 793.3,1543.3 800.0,1556.0 C806.7,1568.7 808.0,1570.7 824.0,1588.0 C840.0,1605.3 878.0,1644.0 896.0,1660.0 C914.0,1676.0 909.3,1676.7 932.0,1684.0 C954.7,1691.3 1003.3,1701.3 1032.0,1704.0 C1060.7,1706.7 1084.7,1702.0 1104.0,1700.0 C1123.3,1698.0 1131.3,1698.0 1148.0,1692.0 C1164.7,1686.0 1180.0,1673.3 1204.0,1664.0 C1228.0,1654.7 1262.0,1642.7 1292.0,1636.0 C1322.0,1629.3 1362.7,1628.0 1384.0,1624.0 C1405.3,1620.0 1408.7,1618.0 1420.0,1612.0 C1431.3,1606.0 1446.0,1594.7 1452.0,1588.0 C1458.0,1581.3 1452.0,1578.7 1456.0,1572.0 C1460.0,1565.3 1448.7,1578.0 1476.0,1548.0 C1503.3,1518.0 1576.7,1432.7 1620.0,1392.0 C1663.3,1351.3 1710.0,1328.7 1736.0,1304.0 C1762.0,1279.3 1747.3,1266.7 1776.0,1244.0 C1804.7,1221.3 1878.7,1182.7 1908.0,1168.0 C1937.3,1153.3 1932.7,1159.3 1952.0,1156.0 C1971.3,1152.7 2008.0,1148.7 2024.0,1148.0 C2040.0,1147.3 2035.3,1148.7 2048.0,1152.0 C2060.7,1155.3 2086.0,1159.3 2100.0,1168.0 C2114.0,1176.7 2123.3,1183.3 2132.0,1204.0 C2140.7,1224.7 2148.0,1266.7 2152.0,1292.0 C2156.0,1317.3 2150.7,1328.0 2156.0,1356.0 C2161.3,1384.0 2166.0,1428.0 2184.0,1460.0 C2202.0,1492.0 2244.7,1524.7 2264.0,1548.0 C2283.3,1571.3 2288.7,1577.3 2300.0,1600.0 C2311.3,1622.7 2323.3,1664.7 2332.0,1684.0 C2340.7,1703.3 2334.7,1699.3 2352.0,1716.0 C2369.3,1732.7 2418.7,1771.3 2436.0,1784.0 C2453.3,1796.7 2445.3,1783.3 2456.0,1792.0 C2466.7,1800.7 2487.3,1820.0 2500.0,1836.0 C2512.7,1852.0 2516.7,1869.3 2532.0,1888.0 C2547.3,1906.7 2562.0,1934.0 2592.0,1948.0 C2622.0,1962.0 2671.3,1972.7 2712.0,1972.0 C2752.7,1971.3 2800.0,1958.7 2836.0,1944.0 C2872.0,1929.3 2905.3,1901.3 2928.0,1884.0 C2950.7,1866.7 2951.3,1864.7 2972.0,1840.0 C2992.7,1815.3 3027.3,1764.7 3052.0,1736.0 C3076.7,1707.3 3096.7,1686.0 3120.0,1668.0 C3143.3,1650.0 3174.0,1640.0 3192.0,1628.0 C3210.0,1616.0 3207.3,1608.7 3228.0,1596.0 C3248.7,1583.3 3285.3,1563.3 3316.0,1552.0 C3346.7,1540.7 3383.3,1528.0 3412.0,1528.0 C3440.7,1528.0 3470.0,1539.3 3488.0,1552.0 C3506.0,1564.7 3512.7,1576.7 3520.0,1604.0 C3527.3,1631.3 3532.0,1684.7 3532.0,1716.0 C3532.0,1747.3 3526.7,1763.3 3520.0,1792.0 C3513.3,1820.7 3503.3,1862.7 3492.0,1888.0 C3480.7,1913.3 3462.0,1925.3 3452.0,1944.0 C3442.0,1962.7 3436.0,1982.0 3432.0,2000.0 C3428.0,2018.0 3426.7,2026.7 3428.0,2052.0 C3429.3,2077.3 3433.3,2122.0 3440.0,2152.0 C3446.7,2182.0 3456.0,2212.0 3468.0,2232.0 C3480.0,2252.0 3490.7,2256.7 3512.0,2272.0 C3533.3,2287.3 3576.7,2310.7 3596.0,2324.0 C3615.3,2337.3 3610.0,2318.0 3628.0,2352.0 C3646.0,2386.0 3683.3,2491.3 3704.0,2528.0 C3724.7,2564.7 3728.0,2561.3 3752.0,2572.0 C3776.0,2582.7 3826.7,2588.7 3848.0,2592.0 C3869.3,2595.3 3861.3,2594.7 3880.0,2592.0 C3898.7,2589.3 3933.3,2584.7 3960.0,2576.0 C3986.7,2567.3 4014.0,2550.0 4040.0,2540.0 C4066.0,2530.0 4096.0,2520.7 4116.0,2516.0 C4136.0,2511.3 4148.7,2514.7 4160.0,2512.0 C4171.3,2509.3 4151.3,2506.0 4184.0,2500.0 C4216.7,2494.0 4312.7,2484.7 4356.0,2476.0 C4399.3,2467.3 4398.7,2454.0 4444.0,2448.0 C4489.3,2442.0 4597.3,2441.3 4628.0,2440.0"

const MIN_MS = 2500     // counter always runs at least this long (deliberate pacing)
const CAR_TRAIL = 300   // how far behind the pin the car trails, in map units

export default function LoadingScreen() {
  const setReady = useConfig((s) => s.setReady)
  const { progress } = useProgress()   // real load progress (GLB + EXR + floor textures)
  const progressRef = useRef(0)
  progressRef.current = progress

  const [removed, setRemoved] = useState(false)
  const screenRef = useRef(null)
  const coreRef = useRef(null)
  const haloRef = useRef(null)
  const midRef = useRef(null)
  const markerRef = useRef(null)
  const carRef = useRef(null)
  const pctRef = useRef(null)

  useEffect(() => {
    const core = coreRef.current
    const glows = [haloRef.current, midRef.current, coreRef.current]
    const L = core.getTotalLength()
    glows.forEach((p) => { p.style.strokeDasharray = L; p.style.strokeDashoffset = L })
    const ptAt = (len) => core.getPointAtLength(Math.max(0, Math.min(L, len)))

    const draw = (p) => {
      p = Math.max(0, Math.min(1, p))
      const off = L * (1 - p)
      glows.forEach((g) => { g.style.strokeDashoffset = off })

      const pt = ptAt(p * L)
      markerRef.current.setAttribute('transform', `translate(${pt.x},${pt.y})`)
      pctRef.current.textContent = Math.round(p * 100) + '%'

      const s = Math.max(0, p * L - CAR_TRAIL)
      const a = ptAt(s), b = ptAt(s + 2)
      let dx = b.x - a.x, dy = b.y - a.y
      const len = Math.hypot(dx, dy) || 1
      let deg = Math.atan2(dy, dx) * 180 / Math.PI, sx = 1
      if (deg > 90) { deg -= 180; sx = -1 } else if (deg < -90) { deg += 180; sx = -1 }
      deg = Math.max(-26, Math.min(26, deg))
      const bob = 7 * Math.sin(s * 0.011) + 4 * Math.sin(s * 0.024)
      const pitch = 2.0 * Math.sin(s * 0.017) + 1.2 * Math.sin(s * 0.033)
      const nx = -dy / len, ny = dx / len
      carRef.current.setAttribute('opacity', Math.min(1, (p * L) / CAR_TRAIL).toFixed(2))
      carRef.current.setAttribute('transform',
        `translate(${a.x + nx * bob},${a.y + ny * bob}) rotate(${deg + pitch}) scale(${sx},1)`)
    }

    const startT = performance.now()
    let shown = 0, finished = false, raf
    const frame = (now) => {
      const elapsed = now - startT
      const timeFrac = Math.min(elapsed / MIN_MS, 1)
      const realFrac = Math.min(progressRef.current / 100, 1)
      const target = Math.min(timeFrac, realFrac)
      shown += (target - shown) * 0.12
      if (target >= 1 && 1 - shown < 0.004) shown = 1
      draw(shown)
      if (shown >= 1 && !finished) {
        finished = true
        setReady(true)                                 // camera intro begins as the map lifts
        screenRef.current.classList.add('is-hidden')
        setTimeout(() => setRemoved(true), 1150)
      }
      raf = requestAnimationFrame(frame)
    }
    draw(0)
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [setReady])

  if (removed) return null

  return (
    <div className="bl-screen" ref={screenRef}>
      <style>{`
        .bl-screen {
          position: fixed; inset: 0; z-index: 9000;
          background: #efeaf2;
          opacity: 1; transition: opacity 1.1s ease, transform 1.1s ease;
        }
        .bl-screen.is-hidden { opacity: 0; transform: scale(1.03); pointer-events: none; }
        .bl-stage {
          position: absolute; inset: 0;
          --f: clamp(36px, 6vmin, 92px);
          -webkit-mask:
            linear-gradient(to right, transparent, #000 var(--f), #000 calc(100% - var(--f)), transparent),
            linear-gradient(to bottom, transparent, #000 var(--f), #000 calc(100% - var(--f)), transparent);
          -webkit-mask-composite: source-in; mask-composite: intersect;
          mask:
            linear-gradient(to right, transparent, #000 var(--f), #000 calc(100% - var(--f)), transparent),
            linear-gradient(to bottom, transparent, #000 var(--f), #000 calc(100% - var(--f)), transparent);
        }
        .bl-stage svg { width: 100%; height: 100%; display: block; }
      `}</style>

      <div className="bl-stage">
        <svg viewBox="0 0 5504 3072" preserveAspectRatio="xMidYMid slice">
          <defs>
            <filter id="blTglow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="18" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="blTsoft" x="-120%" y="-120%" width="340%" height="340%">
              <feGaussianBlur stdDeviation="42" />
            </filter>
            <filter id="blPinglow" x="-90%" y="-90%" width="280%" height="280%">
              <feMorphology in="SourceAlpha" operator="dilate" radius="3" result="dil" />
              <feGaussianBlur in="dil" stdDeviation="20" result="blur" />
              <feFlood floodColor="#ff7a1a" floodOpacity="0.95" />
              <feComposite in2="blur" operator="in" result="glow" />
              <feMerge><feMergeNode in="glow" /><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="blCarglow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor="#ff7a1a" floodOpacity="0.55" />
            </filter>
          </defs>

          <image href="/loading/trail-map.jpg" x="0" y="0" width="5504" height="3072" />

          <path ref={haloRef} d={TRAIL_D} fill="none" stroke="#ff7a1a" strokeWidth="100" strokeLinecap="round" filter="url(#blTsoft)" />
          <path ref={midRef}  d={TRAIL_D} fill="none" stroke="#ff8f34" strokeWidth="46" strokeLinecap="round" filter="url(#blTglow)" />
          <path ref={coreRef} d={TRAIL_D} fill="none" stroke="#ffe6c8" strokeWidth="12" strokeLinecap="round" filter="url(#blTglow)" />

          <g ref={carRef}>
            <image href="/loading/car.png" x="-122.5" y="-51.4" width="245.0" height="102.8" filter="url(#blCarglow)" />
          </g>

          <g ref={markerRef}>
            <g transform="translate(161,0)">
              <text ref={pctRef} x="0" y="-194" fontSize="111" fontWeight="800" fill="#ff6a00" filter="url(#blTglow)" />
              <g transform="translate(3,-148)" stroke="#ff6a00" strokeWidth="4.4"><line x1="0.0" y1="0" x2="0.0" y2="17.7" /><line x1="17.7" y1="0" x2="17.7" y2="10.3" /><line x1="35.5" y1="0" x2="35.5" y2="17.7" /><line x1="53.2" y1="0" x2="53.2" y2="10.3" /><line x1="71.0" y1="0" x2="71.0" y2="17.7" /><line x1="88.7" y1="0" x2="88.7" y2="10.3" /><line x1="106.4" y1="0" x2="106.4" y2="17.7" /><line x1="124.2" y1="0" x2="124.2" y2="10.3" /></g>
            </g>
            <image href="/loading/pin.png" x="-109.0" y="-337.8" width="218.5" height="340.0" filter="url(#blPinglow)" />
          </g>
        </svg>
      </div>
    </div>
  )
}