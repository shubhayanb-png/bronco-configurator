import { broncoColors, wheelFinishes, accessoryOptions, useConfig } from './store'
import FanButton from './FanButton'

// DRL shown as a 2-option pick (OFF / ON), matching the paint/alloy fan style.
const drlOptions = [
  { id: 'off', name: 'OFF', hex: '#2a2a2a' },
  { id: 'on',  name: 'ON',  hex: '#fff4c2' },
]

export default function SwatchPanel() {
  const paintColor = useConfig((s) => s.paintColor)
  const setPaintColor = useConfig((s) => s.setPaintColor)
  const wheelFinish = useConfig((s) => s.wheelFinish)
  const setWheelFinish = useConfig((s) => s.setWheelFinish)
  const drl = useConfig((s) => s.drl)
  const setDrl = useConfig((s) => s.setDrl)
  const accessories = useConfig((s) => s.accessories)
  const toggleAccessory = useConfig((s) => s.toggleAccessory)
  const openMenu = useConfig((s) => s.openMenu)
  const setOpenMenu = useConfig((s) => s.setOpenMenu)
  const showConfig = useConfig((s) => s.showConfig)

  if (!showConfig) return null

  const activePaint = broncoColors.find((c) => c.hex === paintColor) || broncoColors[0]
  const activeDrl = drl ? drlOptions[1] : drlOptions[0]

  // When any menu is open, dim all the others.
  const dimOthers = (id) => openMenu !== null && openMenu !== id

  return (
    <>
      <FanButton
        label={<>BODY<br />PAINT</>}
        options={broncoColors}
        activeValue={activePaint}
        onSelect={(c) => setPaintColor(c.hex)}
        getHex={(c) => c.hex}
        getName={(c) => c.name}
        verticalOffset={-168}
        open={openMenu === 'paint'}
        setOpen={(v) => setOpenMenu(v ? 'paint' : null)}
        dimmed={dimOthers('paint')}
      />

      <FanButton
        label={<>WHEEL<br />FINISH</>}
        options={wheelFinishes}
        activeValue={wheelFinish}
        onSelect={(f) => setWheelFinish(f)}
        getHex={(f) => f.hex}
        getName={(f) => f.name}
        verticalOffset={-56}
        open={openMenu === 'wheel'}
        setOpen={(v) => setOpenMenu(v ? 'wheel' : null)}
        dimmed={dimOthers('wheel')}
      />

      <FanButton
        label={<>DRL<br />LIGHTS</>}
        options={drlOptions}
        activeValue={activeDrl}
        onSelect={(o) => setDrl(o.id === 'on')}
        getHex={(o) => o.hex}
        getName={(o) => o.name}
        verticalOffset={56}
        open={openMenu === 'drl'}
        setOpen={(v) => setOpenMenu(v ? 'drl' : null)}
        dimmed={dimOthers('drl')}
      />

      <FanButton
        label={<>ACCESS-<br />ORIES</>}
        options={accessoryOptions}
        toggle
        isOn={(o) => !!accessories[o.id]}
        onSelect={(o) => toggleAccessory(o.id)}
        getHex={() => '#d9622a'}
        getName={(o) => o.name}
        verticalOffset={168}
        open={openMenu === 'accessories'}
        setOpen={(v) => setOpenMenu(v ? 'accessories' : null)}
        dimmed={dimOthers('accessories')}
      />
    </>
  )
}