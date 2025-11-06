import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DIcons } from "dicons";

type ExportControlsProps = {
  gradientCSS: string;
  tailwindClass: string;
  aspectRatio: string;
  onAspectRatioChange: (value: string) => void;
  onCopyCss: () => void;
  onCopyTailwind: () => void;
  onDownloadJpg: () => void;
  onDownloadSvg: () => void;
  onReset: () => void;
};

export const ExportControls = ({
  gradientCSS,
  tailwindClass,
  aspectRatio,
  onAspectRatioChange,
  onCopyCss,
  onCopyTailwind,
  onDownloadJpg,
  onDownloadSvg,
  onReset,
}: ExportControlsProps) => (
  <div className="space-y-3">
    <Label className="text-base font-semibold">Export</Label>
    <div className="space-y-4">
      <div className="space-y-2">
        <Label
          htmlFor="css"
          className="text-xs font-medium uppercase text-muted-foreground"
        >
          CSS
        </Label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            id="css"
            value={gradientCSS}
            readOnly
            className="flex-1 font-mono text-sm"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={onCopyCss}
            className="shrink-0"
            aria-label="Copy CSS"
          >
            <DIcons.Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="tailwind"
          className="text-xs font-medium uppercase text-muted-foreground"
        >
          Tailwind
        </Label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            id="tailwind"
            value={tailwindClass}
            readOnly
            className="flex-1 font-mono text-sm"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={onCopyTailwind}
            className="shrink-0"
            aria-label="Copy Tailwind classes"
          >
            <DIcons.Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <Select value={aspectRatio} onValueChange={onAspectRatioChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Aspect Ratio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="16:9">16:9 (HD)</SelectItem>
            <SelectItem value="21:9">21:9 (Ultrawide)</SelectItem>
            <SelectItem value="4:3">4:3 (Classic)</SelectItem>
            <SelectItem value="1:1">1:1 (Square)</SelectItem>
            <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
            <SelectItem value="3:4">3:4 (Portrait)</SelectItem>
            <SelectItem value="2:3">2:3 (Portrait)</SelectItem>
            <SelectItem value="3:2">3:2 (Landscape)</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={onDownloadJpg} className="w-full sm:flex-1">
          <DIcons.Download className="mr-2 h-4 w-4" />
          Download JPG
        </Button>
        <Button
          variant="outline"
          onClick={onDownloadSvg}
          className="w-full sm:flex-1"
        >
          Download SVG
        </Button>
        <Button
          size="icon"
          onClick={onReset}
          variant="secondary"
          className="shrink-0"
        >
          <DIcons.RotateCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
);
