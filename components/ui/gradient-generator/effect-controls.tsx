import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

type EffectControlsProps = {
  applyNoise: boolean;
  noiseAmount: number;
  onToggleNoise: (checked: boolean) => void;
  onNoiseAmountChange: (value: number) => void;
  applyBlur: boolean;
  blurAmount: number;
  onToggleBlur: (checked: boolean) => void;
  onBlurAmountChange: (value: number) => void;
};

export const EffectControls = ({
  applyNoise,
  noiseAmount,
  onToggleNoise,
  onNoiseAmountChange,
  applyBlur,
  blurAmount,
  onToggleBlur,
  onBlurAmountChange,
}: EffectControlsProps) => (
  <div className="space-y-3">
    <Label className="text-base font-semibold">Effects</Label>
    <div className="space-y-4 rounded-lg border bg-background/50 p-4">
      <div className="flex items-center gap-3">
        <Switch
          id="apply-noise"
          checked={applyNoise}
          onCheckedChange={onToggleNoise}
        />
        <Label htmlFor="apply-noise" className="cursor-pointer font-medium">
          Noise Texture
        </Label>
      </div>
      {applyNoise && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Label htmlFor="noise" className="text-sm font-medium">
            Amount
          </Label>
          <Slider
            id="noise"
            min={0}
            max={200}
            value={[noiseAmount]}
            className="flex-1 min-w-40"
            onValueChange={(value) =>
              onNoiseAmountChange(value[0] ?? noiseAmount)
            }
          />
          <span className="min-w-12 text-right text-sm font-medium">
            {noiseAmount}
          </span>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Switch
          id="apply-blur"
          checked={applyBlur}
          onCheckedChange={onToggleBlur}
        />
        <Label htmlFor="apply-blur" className="cursor-pointer font-medium">
          Blur
        </Label>
      </div>
      {applyBlur && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Label htmlFor="blur" className="text-sm font-medium">
            Radius
          </Label>
          <Slider
            id="blur"
            min={0}
            max={50}
            value={[blurAmount]}
            className="flex-1 min-w-40"
            onValueChange={(value) =>
              onBlurAmountChange(value[0] ?? blurAmount)
            }
          />
          <span className="min-w-12 text-right text-sm font-medium">
            {blurAmount}px
          </span>
        </div>
      )}
    </div>
  </div>
);
