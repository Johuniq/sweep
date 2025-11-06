import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerEyeDropper,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerSelection,
} from "@/components/ui/ColorPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DIcons } from "dicons";
import type { ColorStop } from "./types";

type ColorStopsEditorProps = {
  colorStops: ColorStop[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, color: string, position: number) => void;
  onShuffle: () => void;
  canAddMore?: boolean;
};

const convertPickerValue = (value: number[]) => {
  const [r, g, b, a] = value;
  if (a === 1 || a === undefined) {
    return `#${Math.round(r).toString(16).padStart(2, "0")}${Math.round(g)
      .toString(16)
      .padStart(2, "0")}${Math.round(b).toString(16).padStart(2, "0")}`;
  }
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
};

export const ColorStopsEditor = ({
  colorStops,
  onAdd,
  onRemove,
  onUpdate,
  onShuffle,
  canAddMore = true,
}: ColorStopsEditorProps) => (
  <div className="space-y-3">
    <Label className="text-base font-semibold">Color Stops</Label>
    <p className="text-sm text-muted-foreground">
      Tap a swatch to adjust its color. Set{" "}
      <span className="font-medium">Position (%)</span> to control where the
      color sits along the gradient.
    </p>
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {colorStops.map((stop, index) => (
        <div key={stop.id} className="relative">
          <div className="flex w-full flex-col gap-4 rounded-lg border bg-background/50 p-4 md:flex-row md:items-center md:gap-5">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="size-10 rounded-lg border-2 p-0 transition-transform hover:scale-105"
                  style={{ backgroundColor: stop.color }}
                  aria-label={`Pick color ${index + 1}`}
                />
              </PopoverTrigger>
              <PopoverContent className="w-auto">
                <ColorPicker
                  value={stop.color || "#000000"}
                  defaultValue="#000000"
                  onChange={(value) => {
                    if (Array.isArray(value)) {
                      onUpdate(
                        stop.id,
                        convertPickerValue(value),
                        stop.position
                      );
                    }
                  }}
                  className="border-0 p-0 shadow-none"
                >
                  <ColorPickerSelection className="h-32 w-64" />
                  <div className="mt-4 flex items-center gap-4">
                    <ColorPickerEyeDropper />
                    <div className="grid w-full gap-2">
                      <ColorPickerHue />
                      <ColorPickerAlpha />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <ColorPickerOutput />
                    <ColorPickerFormat />
                  </div>
                </ColorPicker>
              </PopoverContent>
            </Popover>
            <div className="flex w-full flex-col gap-2 md:w-auto">
              <Label
                htmlFor={`position-${stop.id}`}
                className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
              >
                Position (%)
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id={`position-${stop.id}`}
                  type="number"
                  min={0}
                  max={100}
                  value={stop.position}
                  onChange={(event) =>
                    onUpdate(stop.id, stop.color, Number(event.target.value))
                  }
                  className="h-10 w-full text-center md:h-9 md:w-20"
                />
                <span className="text-xs font-medium text-muted-foreground">
                  %
                </span>
              </div>
            </div>
          </div>
          {colorStops.length > 2 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-2 h-9 w-9 -translate-y-1/2 rounded-full border bg-background hover:bg-destructive/10 hover:text-destructive md:h-8 md:w-8"
              onClick={() => onRemove(stop.id)}
            >
              <DIcons.Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      <div className="col-span-full flex flex-wrap items-center justify-center gap-2 md:justify-start">
        {canAddMore && (
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-lg"
            onClick={onAdd}
          >
            <DIcons.Plus className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="secondary"
          className="h-10 rounded-lg px-4"
          onClick={onShuffle}
        >
          Shuffle
        </Button>
      </div>
    </div>
  </div>
);
