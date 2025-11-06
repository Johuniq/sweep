import type { ColorStop, GradientPreset } from "./types";

export const defaultColorStops: ColorStop[] = [
  { id: "1", color: "#00e1ff", position: 0 },
  { id: "2", color: "#0000ff", position: 100 },
];

export const gradientPresets: GradientPreset[] = [
  {
    id: "sunset-glow",
    name: "Sunset Glow",
    angle: 42,
    stops: [
      { color: "#ff9a9e", position: 0 },
      { color: "#fad0c4", position: 50 },
      { color: "#fad0c4", position: 100 },
    ],
    applyBlur: true,
    blurAmount: 16,
  },
  {
    id: "ocean-breeze",
    name: "Ocean Breeze",
    angle: 120,
    stops: [
      { color: "#00c6ff", position: 0 },
      { color: "#0072ff", position: 50 },
      { color: "#152ea7", position: 100 },
    ],
  },
  {
    id: "aurora",
    name: "Aurora",
    isRadial: true,
    stops: [
      { color: "#051937", position: 0 },
      { color: "#004d7a", position: 35 },
      { color: "#008793", position: 68 },
      { color: "#00bf72", position: 85 },
      { color: "#a8eb12", position: 100 },
    ],
    applyNoise: true,
    noiseAmount: 18,
  },
  {
    id: "pastel-dream",
    name: "Pastel Dream",
    angle: 75,
    stops: [
      { color: "#a1c4fd", position: 0 },
      { color: "#c2e9fb", position: 50 },
      { color: "#fbc2eb", position: 100 },
    ],
  },
  {
    id: "midnight-ember",
    name: "Midnight Ember",
    angle: 15,
    stops: [
      { color: "#0f2027", position: 0 },
      { color: "#203a43", position: 45 },
      { color: "#2c5364", position: 70 },
      { color: "#f05f57", position: 100 },
    ],
    applyNoise: true,
    noiseAmount: 24,
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    angle: 98,
    stops: [
      { color: "#f6d365", position: 0 },
      { color: "#fda085", position: 100 },
    ],
    applyBlur: true,
    blurAmount: 12,
  },
];
