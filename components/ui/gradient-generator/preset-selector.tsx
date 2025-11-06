import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { GradientPreset } from "./types";

type GradientPresetSelectorProps = {
  presets: GradientPreset[];
  selectedPresetId: string | null;
  onSelect: (presetId: string) => void;
};

const getPresetPreviewStyle = (preset: GradientPreset) => {
  const gradientStops = preset.stops
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(", ");

  if (!preset.isRadial) {
    const angle = preset.angle ?? 90;
    return {
      background: `linear-gradient(${angle}deg, ${gradientStops})`,
    };
  }

  return {
    background: `radial-gradient(circle, ${gradientStops})`,
  };
};

export const GradientPresetSelector = ({
  presets,
  selectedPresetId,
  onSelect,
}: GradientPresetSelectorProps) => (
  <div className="space-y-3">
    <Label className="text-base font-semibold">Gradient Library</Label>
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
      {presets.map((preset) => {
        const isActive = preset.id === selectedPresetId;
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelect(preset.id)}
            className={cn(
              "group rounded-xl border bg-background/60 p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:border-primary",
              isActive ? "border-primary ring-2 ring-ring" : "border-border"
            )}
            aria-pressed={isActive}
          >
            <div
              className="h-12 w-full rounded-lg border border-border/40"
              style={getPresetPreviewStyle(preset)}
            />
            <p className="mt-2 text-sm font-semibold text-foreground">
              {preset.name}
            </p>
          </button>
        );
      })}
    </div>
  </div>
);
