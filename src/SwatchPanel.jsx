import { broncoColors, wheelFinishes, useConfig } from './store'
import FanButton from './FanButton'

export default function SwatchPanel() {
  const paintColor = useConfig((s) => s.paintColor)
  const setPaintColor = useConfig((s) => s.setPaintColor)
  const wheelFinish = useConfig((s) => s.wheelFinish)
  const setWheelFinish = useConfig((s) => s.setWheelFinish)
  const openMenu = useConfig((s) => s.openMenu)
  const setOpenMenu = useConfig((s) => s.setOpenMenu)
  const showConfig = useConfig((s) => s.showConfig)

  if (!showConfig) return null

  const activePaint = broncoColors.find((c) => c.hex === paintColor) || broncoColors[0]

  return (
    <>
      <FanButton
        label={<>BODY<br />PAINT</>}
        options={broncoColors}
        activeValue={activePaint}
        onSelect={(c) => setPaintColor(c.hex)}
        getHex={(c) => c.hex}
        getName={(c) => c.name}
        verticalOffset={-110}
        open={openMenu === 'paint'}
        setOpen={(v) => setOpenMenu(v ? 'paint' : null)}
        dimmed={openMenu === 'wheel'}
      />

      <FanButton
        label={<>WHEEL<br />FINISH</>}
        options={wheelFinishes}
        activeValue={wheelFinish}
        onSelect={(f) => setWheelFinish(f)}
        getHex={(f) => f.hex}
        getName={(f) => f.name}
        verticalOffset={110}
        open={openMenu === 'wheel'}
        setOpen={(v) => setOpenMenu(v ? 'wheel' : null)}
        dimmed={openMenu === 'paint'}
      />
    </>
  )
}