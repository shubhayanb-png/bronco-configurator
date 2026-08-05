import { create } from 'zustand'
import * as THREE from 'three'

const BASE_PRICE = 4500000

export const broncoColors = [
  { name: 'Oxford White',   hex: '#e9e9e6', price: 0 },
  { name: 'Shadow Black',   hex: '#14140f', price: 0 },
  { name: 'Area 51',        hex: '#9aa7ad', price: 0 },
  { name: 'Cactus Gray',    hex: '#7c7d6d', price: 25000 },
  { name: 'Velocity Blue',  hex: '#1a4bab', price: 25000 },
  { name: 'Eruption Green', hex: '#3f5d43', price: 25000 },
  { name: 'Cyber Orange',   hex: '#d9531e', price: 55000 },
  { name: 'Hot Pepper Red', hex: '#7c1f22', price: 55000 },
]

export const wheelFinishes = [
  { name: 'Gloss Black', hex: '#1a1a1a', metalness: 0.9,  roughness: 0.15, price: 0 },
  { name: 'Matte Black', hex: '#1c1c1c', metalness: 0.4,  roughness: 0.75, price: 30000 },
  { name: 'Silver',      hex: '#c4c4c8', metalness: 1.0,  roughness: 0.25, price: 0 },
  { name: 'Gunmetal',    hex: '#4a4e54', metalness: 0.95, roughness: 0.35, price: 45000 },
  { name: 'Bronze',      hex: '#8a6d3b', metalness: 0.95, roughness: 0.3,  price: 65000 },
]

// Accessories that can be toggled on/off independently (each is its own node in the GLB)
export const accessoryOptions = [
  { id: 'roofRack', name: 'ROOF RACK' },
  { id: 'winch',    name: 'WINCH' },
]

// Top-nav tabs (placeholders for now; 'paint' and 'wheel' are the live ones)
export const navTabs = [
  { id: 'paint',      label: 'PAINT' },
  { id: 'wheel',      label: 'WHEELS & TIRES' },
  { id: 'armor',      label: 'ARMOR & PROTECTION' },
  { id: 'offroad',    label: 'OFF-ROAD GEAR' },
  { id: 'interior',   label: 'INTERIOR' },
  { id: 'technology', label: 'TECHNOLOGY' },
  { id: 'safety',     label: 'SAFETY & RECOVERY' },
  { id: 'capability', label: 'CAPABILITY' },
  { id: 'summary',    label: 'SUMMARY' },
]

export const cameraViews = {
  hero:  { pos: [-4.25, 1.69, 2.91], target: [-0.02, 0.81, -0.06] },
  paint: { pos: [-2.4, 1.4, 3.6],    target: [-0.1, 0.75, 0] },
  wheel: { pos: [-0.1, 1.04, 4.67],  target: [0.29, 0.74, -0.03] },
}

export const useConfig = create((set, get) => ({
  basePrice: BASE_PRICE,

  paintColor: '#9aa7ad',
  setPaintColor: (hex) => set({ paintColor: hex }),

  wheelFinish: wheelFinishes[0],
  setWheelFinish: (finish) => set({ wheelFinish: finish }),

  // DRL daytime running lights on/off
  drl: false,
  setDrl: (v) => set({ drl: v }),
  toggleDrl: () => set((s) => ({ drl: !s.drl })),

  // Accessory visibility (default: shown for the hero look)
  accessories: { roofRack: true, winch: true },
  toggleAccessory: (id) =>
    set((s) => ({ accessories: { ...s.accessories, [id]: !s.accessories[id] } })),

  openMenu: null,
  setOpenMenu: (menu) => set({ openMenu: menu }),

  // Which top-nav tab is active
  activeTab: 'paint',
  setActiveTab: (id) => set({ activeTab: id }),

  // Whether the config bubbles are shown (toggled by hamburger)
  showConfig: true,
  toggleConfig: () => set((s) => ({ showConfig: !s.showConfig })),

  // True once the loading screen finishes. The camera intro waits for this.
  ready: false,
  setReady: (v) => set({ ready: v }),

  getTotal: () => {
    const s = get()
    const paint = broncoColors.find((c) => c.hex === s.paintColor)
    const paintPrice = paint ? paint.price : 0
    const wheelPrice = s.wheelFinish ? s.wheelFinish.price : 0
    return s.basePrice + paintPrice + wheelPrice
  },
}))

export function formatINR(n) {
  return '₹' + n.toLocaleString('en-IN')
}