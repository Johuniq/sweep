import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

type GradientTypeControlsProps = {
  isRadial: boolean;
  angle: number;
  onToggleRadial: (checked: boolean) => void;
  onAngleChange: (value: number) => void;
};

export const GradientTypeControls = ({
  isRadial,
  angle,
  onToggleRadial,
  onAngleChange,
}: GradientTypeControlsProps) => (
  <div className="space-y-3">
    <Label className="text-base font-semibold">Gradient Type</Label>
    <div className="flex flex-col gap-4 rounded-lg border bg-background/50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Label
          htmlFor="gradient-type"
          className={`cursor-pointer transition-colors ${
            !isRadial
              ? "font-semibold text-foreground"
              : "text-muted-foreground"
          }`}
        >
          Linear
        </Label>
        <Switch
          id="gradient-type"
          checked={isRadial}
          onCheckedChange={onToggleRadial}
        />
        <Label
          htmlFor="gradient-type"
          className={`cursor-pointer transition-colors ${
            isRadial ? "font-semibold text-foreground" : "text-muted-foreground"
          }`}
        >
          Radial
        </Label>
      </div>
      {!isRadial && (
        <div className="flex flex-col gap-3 sm:w-full sm:flex-row sm:items-center">
          <Label htmlFor="angle" className="text-sm font-medium">
            Angle
          </Label>
          <Slider
            id="angle"
            value={[angle]}
            min={0}
            max={360}
            className="flex-1 min-w-40"
            onValueChange={(value) => onAngleChange(value[0] ?? angle)}
          />
          <span className="min-w-12 text-right text-sm font-medium">
            {angle}°
          </span>
        </div>
      )}
    </div>
  </div>
);
