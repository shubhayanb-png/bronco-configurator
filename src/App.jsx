import { Suspense, useRef, useLayoutEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, MeshReflectorMaterial, useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { useConfig, cameraViews } from './store'
import SwatchPanel from './SwatchPanel'
import NavBar from './NavBar'
import Footer from './Footer'
import LoadingScreen from './LoadingScreen'
import './App.css'

const HERO = { pos: [-4.25, 1.69, 2.91], target: [-0.02, 0.81, -0.06] }
const INTRO_DURATION = 2.0
const CAMERA_GLIDE = 0.02

// ---- DRL glow tuning ----
// Bright emissive lens core (toneMapped=false) + additive "halo" shells hugging the lens.
// This is pure geometry -- it never touches the rest of the scene (no post-processing).
const DRL_COLOR = '#dfeaff'          // cool daytime-running-light white
const DRL_INTENSITY = 2.0            // brightness of the lit lens core
const DRL_ON_TRANSMISSION = 0.15     // lens goes near-solid when lit (base is clear glass)
// halo shells: [outward offset in metres, peak opacity]. More layers = softer falloff.
const DRL_HALO_LAYERS = [
  [0.006, 0.35],
  [0.015, 0.20],
  [0.028, 0.10],
]

// ---- one-line switch: pillars follow body paint (true) or fixed semi-gloss black (false) ----
const PILLAR_FOLLOWS_BODY = true

function CameraRig({ controlsRef }) {
  const { camera } = useThree()
  const openMenu = useConfig((s) => s.openMenu)
  const ready = useConfig((s) => s.ready)

  const introDone = useRef(false)
  const introStart = useRef(null)
  const animating = useRef(false)
  const desiredPos = useRef(new THREE.Vector3(...HERO.pos))
  const desiredTarget = useRef(new THREE.Vector3(...HERO.target))

  useLayoutEffect(() => {
    const hero = new THREE.Vector3(...HERO.pos)
    const tgt = new THREE.Vector3(...HERO.target)
    const dir = hero.clone().sub(tgt).normalize()
    const startDist = hero.distanceTo(tgt) * 0.75
    camera.position.copy(tgt).add(dir.multiplyScalar(startDist))
    camera.lookAt(tgt)
  }, [camera])

  useLayoutEffect(() => {
    if (!introDone.current) return
    const view = openMenu && cameraViews[openMenu] ? cameraViews[openMenu] : HERO
    desiredPos.current.set(...view.pos)
    desiredTarget.current.set(...view.target)
    animating.current = true
  }, [openMenu])

  useLayoutEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    const onStart = () => { animating.current = false }
    controls.addEventListener('start', onStart)
    return () => controls.removeEventListener('start', onStart)
  }, [controlsRef])

  useFrame((state) => {
    if (!ready) return

    const controls = controlsRef.current

    if (!introDone.current) {
      if (introStart.current === null) introStart.current = state.clock.elapsedTime
      const elapsed = state.clock.elapsedTime - introStart.current
      let t = Math.min(elapsed / INTRO_DURATION, 1)
      t = 1 - Math.pow(1 - t, 3)

      const hero = new THREE.Vector3(...HERO.pos)
      const tgt = new THREE.Vector3(...HERO.target)
      const dir = hero.clone().sub(tgt).normalize()
      const startDist = hero.distanceTo(tgt) * 0.75
      const endDist = hero.distanceTo(tgt)
      const dist = startDist + (endDist - startDist) * t

      camera.position.copy(tgt).add(dir.multiplyScalar(dist))
      camera.lookAt(tgt)

      if (t >= 1) {
        introDone.current = true
        if (controls) { controls.target.copy(tgt); controls.update() }
      }
      return
    }

    if (animating.current && controls) {
      camera.position.lerp(desiredPos.current, CAMERA_GLIDE)
      controls.target.lerp(desiredTarget.current, CAMERA_GLIDE)
      controls.update()

      const posClose = camera.position.distanceTo(desiredPos.current) < 0.05
      const tgtClose = controls.target.distanceTo(desiredTarget.current) < 0.05
      if (posClose && tgtClose) animating.current = false
    }
  })

  return null
}

// Build an outward-inflated copy of a geometry (vertices pushed along their normals)
function inflatedGeometry(geom, offset) {
  const g = geom.clone()
  const pos = g.attributes.position
  const nor = g.attributes.normal
  if (!pos || !nor) return null
  for (let i = 0; i < pos.count; i++) {
    pos.setXYZ(
      i,
      pos.getX(i) + nor.getX(i) * offset,
      pos.getY(i) + nor.getY(i) * offset,
      pos.getZ(i) + nor.getZ(i) * offset,
    )
  }
  pos.needsUpdate = true
  g.computeBoundingSphere()
  return g
}

function Bronco() {
  const { scene } = useGLTF('/bronco_v2.glb')
  const ref = useRef()
  const paintColor = useConfig((s) => s.paintColor)
  const wheelFinish = useConfig((s) => s.wheelFinish)
  const drl = useConfig((s) => s.drl)
  const accessories = useConfig((s) => s.accessories)

  const paintMats = useRef([])
  const wheelMats = useRef([])
  const drlMats = useRef([])          // [{ mat, baseTrans }]
  const haloMats = useRef([])         // additive glow shell materials (with .userData.maxOpacity)
  const roofRackObjs = useRef([])
  const winchObjs = useRef([])

  const targetColor = useRef(new THREE.Color(paintColor))
  const wheelTargetColor = useRef(new THREE.Color(wheelFinish.hex))
  const wheelTargetMetal = useRef(wheelFinish.metalness)
  const wheelTargetRough = useRef(wheelFinish.roughness)
  const drlRef = useRef(drl)
  drlRef.current = drl

  useLayoutEffect(() => {
    const paints = []
    const wheels = []
    const drls = []
    const drlMeshes = []
    const roofRack = []
    const winch = []

    scene.traverse((obj) => {
      const on = obj.name || ''
      if (on.includes('Roof_Rack')) roofRack.push(obj)
      if (on.includes('Wench') || on.includes('Warn') || on.includes('Wanr')) winch.push(obj)

      if (obj.isMesh && obj.material) {
        obj.castShadow = true
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
        mats.forEach((m) => {
          m.side = THREE.DoubleSide
          const n = m.name || ''

          // --- BODY PAINT: main body always; pillars follow body unless switched off ---
          if (n === 'CarPaint' || (PILLAR_FOLLOWS_BODY && n === 'CarPaint_Pillar')) {
            m.metalness = 0.6
            m.roughness = 0.35
            m.clearcoat = 1.0
            m.clearcoatRoughness = 0.08
            m.envMapIntensity = 1.5
            m.needsUpdate = true
            paints.push(m)
          } else if (!PILLAR_FOLLOWS_BODY && n === 'CarPaint_Pillar') {
            m.color.set('#141414')
            m.metalness = 0.1
            m.roughness = 0.45
            m.clearcoat = 0.35
            m.clearcoatRoughness = 0.2
            m.needsUpdate = true
          }

          // --- WHEEL FINISH: only the alloy face ---
          if (n === 'Alloy') wheels.push(m)

          // --- DISC BRAKE: brushed-metal grain (specular.jpg) was exported into the
          //     normal slot; route it to roughness and make the rotor metallic steel ---
          if (n === 'Disc Brake') {
            if (m.normalMap) { m.roughnessMap = m.normalMap; m.normalMap = null }
            m.metalness = 1.0
            m.roughness = 0.55
            m.color.set('#8f9296')
            m.needsUpdate = true
          }

          // --- TYRE: reveal the Michelin sidewall (baseColorFactor was crushed to ~0.03,
          //     and the colour JPG was mis-assigned as a normal map) ---
          if (n === 'Tyre') {
            m.color.set('#ffffff')
            if (m.normalMap) m.normalMap = null
            m.needsUpdate = true
          }

          // --- DRL: emissive lens core (toneMapped=false = bright when lit) ---
          if (n === 'DRL_Glass') {
            m.emissive = new THREE.Color(DRL_COLOR)
            m.emissiveIntensity = 0
            m.toneMapped = false
            m.needsUpdate = true
            drls.push({ mat: m, baseTrans: m.transmission ?? 0 })
            drlMeshes.push(obj)
          }
        })
      }
    })

    // --- build additive glow shells around each DRL lens (pure geometry, self-contained) ---
    const halos = []
    drlMeshes.forEach((dm) => {
      DRL_HALO_LAYERS.forEach(([offset, maxOpacity]) => {
        const g = inflatedGeometry(dm.geometry, offset)
        if (!g) return
        const mat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(DRL_COLOR),
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          toneMapped: false,
          side: THREE.FrontSide,
        })
        mat.userData.maxOpacity = maxOpacity
        const shell = new THREE.Mesh(g, mat)
        shell.renderOrder = 999
        shell.castShadow = false
        dm.add(shell)          // child of the lens -> inherits its exact transform
        halos.push(mat)
      })
    })

    paintMats.current = paints
    wheelMats.current = wheels
    drlMats.current = drls
    haloMats.current = halos
    roofRackObjs.current = roofRack
    winchObjs.current = winch

    const box = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    scene.position.x -= center.x
    scene.position.z -= center.z
    scene.position.y -= box.min.y
  }, [scene])

  useLayoutEffect(() => {
    targetColor.current.set(paintColor)
  }, [paintColor])

  useLayoutEffect(() => {
    wheelTargetColor.current.set(wheelFinish.hex)
    wheelTargetMetal.current = wheelFinish.metalness
    wheelTargetRough.current = wheelFinish.roughness
  }, [wheelFinish])

  useLayoutEffect(() => {
    roofRackObjs.current.forEach((o) => { o.visible = accessories.roofRack })
    winchObjs.current.forEach((o) => { o.visible = accessories.winch })
  }, [accessories])

  useFrame(() => {
    paintMats.current.forEach((m) => {
      m.color.lerp(targetColor.current, 0.08)
    })
    wheelMats.current.forEach((m) => {
      m.color.lerp(wheelTargetColor.current, 0.08)
      m.metalness += (wheelTargetMetal.current - m.metalness) * 0.08
      m.roughness += (wheelTargetRough.current - m.roughness) * 0.08
    })
    const on = drlRef.current
    // lens core
    const targetI = on ? DRL_INTENSITY : 0
    drlMats.current.forEach(({ mat, baseTrans }) => {
      mat.emissiveIntensity += (targetI - mat.emissiveIntensity) * 0.15
      if (mat.transmission !== undefined) {
        const targetT = on ? DRL_ON_TRANSMISSION : baseTrans
        mat.transmission += (targetT - mat.transmission) * 0.15
      }
    })
    // halo shells
    haloMats.current.forEach((mat) => {
      const target = on ? mat.userData.maxOpacity : 0
      mat.opacity += (target - mat.opacity) * 0.15
    })
  })

  return <primitive ref={ref} object={scene} />
}

function StoneFloor() {
  const [colorMap, normalMap] = useTexture([
    '/floor/floor_color.jpg',
    '/floor/floor_normal.jpg',
  ])

  ;[colorMap, normalMap].forEach((t) => {
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(25, 25)
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <MeshReflectorMaterial
        map={colorMap}
        normalMap={normalMap}
        normalScale={[0.3, 0.3]}
        color="#ffffff"
        roughness={0.92}
        metalness={0}
        resolution={1024}
        mixBlur={20}
        blur={[800, 400]}
        mirror={0.12}
        mixStrength={0.15}
        depthScale={1}
        minDepthThreshold={0.6}
        maxDepthThreshold={1.5}
      />
    </mesh>
  )
}

export default function App() {
  const controlsRef = useRef()

  return (
    <div className="app">
      <Canvas
        shadows="soft"
        camera={{ position: [-4.25, 1.69, 2.91], fov: 40 }}
        gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.85 }}
      >
        <color attach="background" args={['#e0e0e0']} />
        <fog attach="fog" args={['#e0e0e0', 12, 28]} />

        <Suspense fallback={null}>
          <Bronco />
          <Environment files="/hdri/studio_small_08_4k.exr" environmentIntensity={0.9} />
          <directionalLight
            position={[4, 8, 2]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[4096, 4096]}
            shadow-bias={-0.0004}
            shadow-radius={12}
          >
            <orthographicCamera attach="shadow-camera" args={[-8, 8, 8, -8, 0.1, 30]} />
          </directionalLight>
          <StoneFloor />
          <CameraRig controlsRef={controlsRef} />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          screenSpacePanning={true}
          target={[-0.02, 0.81, -0.06]}
          minDistance={3}
          maxDistance={7.5}
          minPolarAngle={0.3}
          maxPolarAngle={Math.PI / 2}
          mouseButtons={{ LEFT: 0, MIDDLE: 2, RIGHT: 0 }}
        />
      </Canvas>

      <NavBar />
      <SwatchPanel />
      <Footer />
      <LoadingScreen />
    </div>
  )
}