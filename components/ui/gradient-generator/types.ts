export type ColorStop = {
  id: string;
  color: string;
  position: number;
};

export type GradientPresetStop = {
  color: string;
  position: number;
};

export type GradientPreset = {
  id: string;
  name: string;
  stops: GradientPresetStop[];
  angle?: number;
  isRadial?: boolean;
  applyNoise?: boolean;
  noiseAmount?: number;
  applyBlur?: boolean;
  blurAmount?: number;
};
