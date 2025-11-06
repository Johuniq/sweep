"use client";

import { Slider } from "@/components/ui/slider";
import Color from "color";
import { DIcons } from "dicons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerEyeDropper,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerSelection,
} from "@/components/kibo-ui/color-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type ColorStop = {
  id: string;
  color: string;
  position: number;
};

const defaultColorStops: ColorStop[] = [
  { id: "1", color: "#00e1ff", position: 0 },
  { id: "2", color: "#0000ff", position: 100 },
];

export function GradientGenerator() {
  const [colorStops, setColorStops] = useState<ColorStop[]>(defaultColorStops);
  const [angle, setAngle] = useState(90);
  const [noiseAmount, setNoiseAmount] = useState(0);
  const [applyNoise, setApplyNoise] = useState(false);
  const [blurAmount, setBlurAmount] = useState(0);
  const [applyBlur, setApplyBlur] = useState(false);
  const [isRadialGradient, setIsRadialGradient] = useState(false);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);

  const sortedColorStops = useMemo(
    () => [...colorStops].sort((a, b) => a.position - b.position),
    [colorStops]
  );

  const gradientString = sortedColorStops
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(", ");

  const blurCSS =
    applyBlur && blurAmount > 0 ? ` filter: blur(${blurAmount}px);` : "";

  const gradientCSS =
    (!isRadialGradient
      ? `background: linear-gradient(${angle}deg, ${gradientString});`
      : `background: radial-gradient(circle, ${gradientString});`) + blurCSS;

  const tailwindGradientClass = useMemo(() => {
    const gradientValue = !isRadialGradient
      ? `linear-gradient(${angle}deg, ${gradientString})`
      : `radial-gradient(circle, ${gradientString})`;

    const sanitized = gradientValue.replace(/\s+/g, "_");

    const classes = [`bg-[${sanitized}]`];

    if (applyBlur && blurAmount > 0) {
      classes.push(`blur-[${blurAmount}px]`);
    }

    return classes.join(" ");
  }, [isRadialGradient, angle, gradientString, applyBlur, blurAmount]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(gradientCSS).then(() => {});
  };

  const copyTailwindClasses = () => {
    navigator.clipboard.writeText(tailwindGradientClass).then(() => {});
  };

  const renderGradientOnCanvas = useCallback(
    (
      targetCanvas: HTMLCanvasElement,
      width?: number,
      height?: number,
      options?: { applyBlur?: boolean }
    ) => {
      const renderWidth = width ?? targetCanvas.width;
      const renderHeight = height ?? targetCanvas.height;

      if (targetCanvas.width !== renderWidth) {
        targetCanvas.width = renderWidth;
      }

      if (targetCanvas.height !== renderHeight) {
        targetCanvas.height = renderHeight;
      }

      const ctx = targetCanvas.getContext("2d");
      if (!ctx) {
        return;
      }

      const needsBlur = options?.applyBlur && applyBlur && blurAmount > 0;
      const blurPadding = needsBlur ? Math.ceil(blurAmount * 4) : 0;

      const baseCanvas = needsBlur
        ? document.createElement("canvas")
        : targetCanvas;
      const baseWidth = needsBlur ? renderWidth + blurPadding * 2 : renderWidth;
      const baseHeight = needsBlur
        ? renderHeight + blurPadding * 2
        : renderHeight;

      if (baseCanvas.width !== baseWidth) {
        baseCanvas.width = baseWidth;
      }
      if (baseCanvas.height !== baseHeight) {
        baseCanvas.height = baseHeight;
      }

      const baseCtx = baseCanvas.getContext("2d");
      if (!baseCtx) {
        return;
      }

      baseCtx.clearRect(0, 0, baseWidth, baseHeight);

      let gradient: CanvasGradient;
      if (!isRadialGradient) {
        const angleRad = ((angle - 90) * Math.PI) / 180;
        const centerX = baseWidth / 2;
        const centerY = baseHeight / 2;
        const diagonal = Math.sqrt(
          baseWidth * baseWidth + baseHeight * baseHeight
        );

        const x1 = centerX + (Math.cos(angleRad) * diagonal) / 2;
        const y1 = centerY + (Math.sin(angleRad) * diagonal) / 2;
        const x2 = centerX - (Math.cos(angleRad) * diagonal) / 2;
        const y2 = centerY - (Math.sin(angleRad) * diagonal) / 2;

        gradient = baseCtx.createLinearGradient(x1, y1, x2, y2);
      } else {
        const radius = Math.max(baseWidth, baseHeight) / 2;
        gradient = baseCtx.createRadialGradient(
          baseWidth / 2,
          baseHeight / 2,
          0,
          baseWidth / 2,
          baseHeight / 2,
          radius
        );
      }

      sortedColorStops.forEach((stop) => {
        gradient.addColorStop(stop.position / 100, stop.color);
      });

      baseCtx.fillStyle = gradient;
      baseCtx.fillRect(0, 0, baseWidth, baseHeight);

      if (needsBlur) {
        const blurCanvas = document.createElement("canvas");
        blurCanvas.width = baseWidth;
        blurCanvas.height = baseHeight;
        const blurCtx = blurCanvas.getContext("2d");
        if (blurCtx) {
          blurCtx.filter = `blur(${blurAmount}px)`;
          blurCtx.drawImage(baseCanvas, 0, 0);
          blurCtx.filter = "none";

          ctx.clearRect(0, 0, renderWidth, renderHeight);
          ctx.drawImage(
            blurCanvas,
            blurPadding,
            blurPadding,
            renderWidth,
            renderHeight,
            0,
            0,
            renderWidth,
            renderHeight
          );
          ctx.save();
          ctx.globalCompositeOperation = "destination-over";
          ctx.drawImage(
            baseCanvas,
            blurPadding,
            blurPadding,
            renderWidth,
            renderHeight,
            0,
            0,
            renderWidth,
            renderHeight
          );
          ctx.restore();
        } else {
          ctx.clearRect(0, 0, renderWidth, renderHeight);
          ctx.drawImage(
            baseCanvas,
            blurPadding,
            blurPadding,
            renderWidth,
            renderHeight,
            0,
            0,
            renderWidth,
            renderHeight
          );
          ctx.save();
          ctx.globalCompositeOperation = "destination-over";
          ctx.drawImage(
            baseCanvas,
            blurPadding,
            blurPadding,
            renderWidth,
            renderHeight,
            0,
            0,
            renderWidth,
            renderHeight
          );
          ctx.restore();
        }
      } else if (baseCanvas !== targetCanvas) {
        ctx.clearRect(0, 0, renderWidth, renderHeight);
        ctx.drawImage(baseCanvas, 0, 0, renderWidth, renderHeight);
      } else {
        // baseCanvas === targetCanvas and already drawn
      }

      if (applyNoise && noiseAmount > 0) {
        const imageData = ctx.getImageData(0, 0, renderWidth, renderHeight);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const noise = (Math.random() - 0.5) * noiseAmount;
          data[i] = Math.min(255, Math.max(0, data[i] + noise));
          data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
          data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
        }
        ctx.putImageData(imageData, 0, 0);
      }
    },
    [
      sortedColorStops,
      isRadialGradient,
      angle,
      applyNoise,
      noiseAmount,
      applyBlur,
      blurAmount,
    ]
  );

  const updateCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const displayCanvas = displayCanvasRef.current;
    if (!canvas || !displayCanvas) {
      return;
    }

    renderGradientOnCanvas(canvas, undefined, undefined, { applyBlur: true });

    const displayCtx = displayCanvas.getContext("2d");
    if (!displayCtx) {
      return;
    }

    displayCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
    displayCtx.drawImage(
      canvas,
      0,
      0,
      displayCanvas.width,
      displayCanvas.height
    );
  }, [renderGradientOnCanvas]);

  useEffect(() => {
    updateCanvas();
  }, [updateCanvas]);

  const downloadJPG = () => {
    const canvas = document.createElement("canvas");

    // Calculate dimensions based on aspect ratio
    const [widthRatio, heightRatio] = aspectRatio.split(":").map(Number);
    const baseWidth = 1920; // Base width for high quality
    const exportWidth = baseWidth;
    const exportHeight = Math.round((baseWidth / widthRatio) * heightRatio);

    renderGradientOnCanvas(canvas, exportWidth, exportHeight, {
      applyBlur: true,
    });

    const dataURL = canvas.toDataURL("image/jpeg", 0.95);
    const link = document.createElement("a");
    link.download = `gradient-${aspectRatio.replace(":", "x")}.jpg`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const addColorStop = () => {
    if (sortedColorStops.length >= 5) {
      return;
    }

    if (sortedColorStops.length < 2) {
      return;
    }

    let insertIndex = 0;
    let largestGap = -1;

    for (let i = 0; i < sortedColorStops.length - 1; i++) {
      const gap =
        sortedColorStops[i + 1].position - sortedColorStops[i].position;
      if (gap > largestGap) {
        largestGap = gap;
        insertIndex = i;
      }
    }

    if (largestGap <= 1) {
      return;
    }

    const leftStop = sortedColorStops[insertIndex];
    const rightStop = sortedColorStops[insertIndex + 1];
    if (!rightStop) {
      return;
    }
    const rawPosition = leftStop.position + largestGap / 2;
    let newPosition = Math.round(rawPosition);

    if (newPosition <= leftStop.position) {
      newPosition = leftStop.position + 1;
    }

    if (newPosition >= rightStop.position) {
      newPosition = rightStop.position - 1;
    }

    newPosition = Math.max(0, Math.min(100, newPosition));

    let blendedColor = "#ffffff";
    try {
      const mixed = Color(leftStop.color).mix(Color(rightStop.color), 0.5);
      blendedColor =
        mixed.alpha() === 1 ? mixed.hex().toLowerCase() : mixed.rgb().string();
    } catch (error) {
      console.error("Failed to blend colors", error);
    }

    setColorStops(
      [
        ...sortedColorStops,
        {
          id: Date.now().toString(),
          color: blendedColor,
          position: newPosition,
        },
      ].sort((a, b) => a.position - b.position)
    );
  };

  const removeColorStop = (id: string) => {
    if (colorStops.length > 2) {
      setColorStops(colorStops.filter((stop) => stop.id !== id));
    }
  };

  const updateColorStop = (id: string, color: string, position: number) => {
    const newColorStops = colorStops.map((stop) =>
      stop.id === id ? { ...stop, color, position } : stop
    );
    setColorStops(newColorStops.sort((a, b) => a.position - b.position));
  };

  const shuffleGradient = () => {
    if (!colorStops.length) {
      return;
    }

    const shuffleArray = <T,>(items: T[]) => {
      const arr = [...items];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    const shuffledColors = shuffleArray(
      sortedColorStops.map((stop) => stop.color)
    );

    const positions = (() => {
      if (sortedColorStops.length <= 2) {
        return [0, 100].slice(0, sortedColorStops.length);
      }

      const interiorCount = sortedColorStops.length - 2;
      const used = new Set<number>([0, 100]);
      const interior: number[] = [];

      while (interior.length < interiorCount) {
        const candidate = Math.floor(Math.random() * 99) + 1; // 1-99 inclusive
        if (!used.has(candidate)) {
          used.add(candidate);
          interior.push(candidate);
        }
      }

      interior.sort((a, b) => a - b);
      return [0, ...interior, 100];
    })();

    const shuffledStops = sortedColorStops.map((stop, index) => ({
      ...stop,
      color: shuffledColors[index] ?? stop.color,
      position: positions[index] ?? stop.position,
    }));

    setColorStops(shuffledStops);

    if (!isRadialGradient) {
      setAngle(Math.floor(Math.random() * 361));
    }
  };

  const resetSettings = () => {
    setColorStops(defaultColorStops);
    setAngle(90);
    setNoiseAmount(0);
    setApplyNoise(false);
    setBlurAmount(0);
    setApplyBlur(false);
    setIsRadialGradient(false);
  };

  return (
    <div className="mt-10 flex items-center justify-center p-6 xl:p-0">
      <div className="mx-auto w-full max-w-7xl space-y-6 rounded-2xl border-2 bg-popover/80 p-8">
        {/* Gradient Display */}
        <div className="relative w-full">
          <canvas
            ref={displayCanvasRef}
            width={1000}
            height={1000}
            className="aspect-video w-full h-full rounded-xl shadow-lg"
          />
        </div>

        {/* Controls Panel */}
        <div className="space-y-6">
          {/* Color Stops Section */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Color Stops</Label>
            <div className="flex flex-wrap items-center gap-3">
              {colorStops.map((stop, index) => (
                <div
                  key={stop.id}
                  className="flex items-center gap-2 rounded-lg border bg-background/50 p-2"
                >
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="size-10 rounded-lg border-2 p-0 hover:scale-105 transition-transform"
                        style={{ backgroundColor: stop.color }}
                        aria-label={`Pick color ${index + 1}`}
                      />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto">
                      <ColorPicker
                        value={stop.color || "#000000"}
                        defaultValue="#000000"
                        onChange={(color) => {
                          if (Array.isArray(color)) {
                            const [r, g, b, a] = color;
                            let colorValue;
                            if (a === 1 || a === undefined) {
                              colorValue = `#${Math.round(r)
                                .toString(16)
                                .padStart(2, "0")}${Math.round(g)
                                .toString(16)
                                .padStart(2, "0")}${Math.round(b)
                                .toString(16)
                                .padStart(2, "0")}`;
                            } else {
                              colorValue = `rgba(${Math.round(r)}, ${Math.round(
                                g
                              )}, ${Math.round(b)}, ${a})`;
                            }
                            updateColorStop(stop.id, colorValue, stop.position);
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
                  <div className="flex items-center gap-1.5">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={stop.position}
                      onChange={(e) =>
                        updateColorStop(
                          stop.id,
                          stop.color,
                          Number(e.target.value)
                        )
                      }
                      className="w-16 h-8 text-center"
                    />
                    <span className="text-xs text-muted-foreground">%</span>
                  </div>
                  {colorStops.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => removeColorStop(stop.id)}
                    >
                      <DIcons.Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <div className="flex items-center gap-2">
                {colorStops.length < 5 && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-lg"
                    onClick={addColorStop}
                  >
                    <DIcons.Plus className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="secondary"
                  className="h-10 rounded-lg px-4"
                  onClick={shuffleGradient}
                >
                  Shuffle
                </Button>
              </div>
            </div>
          </div>

          {/* Gradient Type Section */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Gradient Type</Label>
            <div className="flex items-center gap-3 rounded-lg border bg-background/50 p-4">
              <div className="flex items-center gap-3">
                <Label
                  htmlFor="gradient-type"
                  className={`cursor-pointer transition-colors ${
                    !isRadialGradient
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  Linear
                </Label>
                <Switch
                  id="gradient-type"
                  checked={isRadialGradient}
                  onCheckedChange={(checked) => setIsRadialGradient(checked)}
                />
                <Label
                  htmlFor="gradient-type"
                  className={`cursor-pointer transition-colors ${
                    isRadialGradient
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  Radial
                </Label>
              </div>
              {!isRadialGradient && (
                <>
                  <div className="h-8 w-px bg-border mx-2" />
                  <div className="flex flex-1 items-center gap-3">
                    <Label htmlFor="angle" className="text-sm font-medium">
                      Angle
                    </Label>
                    <Slider
                      id="angle"
                      value={[angle]}
                      defaultValue={[33]}
                      min={0}
                      max={360}
                      className="flex-1"
                      onValueChange={(value) => setAngle(value[0] ?? angle)}
                    />
                    <span className="min-w-12 text-sm font-medium text-right">
                      {angle}°
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Noise Section */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Effects</Label>
            <div className="space-y-4 rounded-lg border bg-background/50 p-4">
              <div className="flex items-center gap-3">
                <Switch
                  id="apply-noise"
                  checked={applyNoise}
                  onCheckedChange={setApplyNoise}
                />
                <Label
                  htmlFor="apply-noise"
                  className="cursor-pointer font-medium"
                >
                  Noise Texture
                </Label>
              </div>
              {applyNoise && (
                <div className="flex flex-1 items-center gap-3">
                  <Label htmlFor="noise" className="text-sm font-medium">
                    Amount
                  </Label>
                  <Slider
                    id="noise"
                    defaultValue={[33]}
                    min={0}
                    max={200}
                    value={[noiseAmount]}
                    className="flex-1"
                    onValueChange={(value) =>
                      setNoiseAmount(value[0] ?? noiseAmount)
                    }
                  />
                  <span className="min-w-12 text-sm font-medium text-right">
                    {noiseAmount}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Switch
                  id="apply-blur"
                  checked={applyBlur}
                  onCheckedChange={setApplyBlur}
                />
                <Label
                  htmlFor="apply-blur"
                  className="cursor-pointer font-medium"
                >
                  Blur
                </Label>
              </div>
              {applyBlur && (
                <div className="flex flex-1 items-center gap-3">
                  <Label htmlFor="blur" className="text-sm font-medium">
                    Radius
                  </Label>
                  <Slider
                    id="blur"
                    defaultValue={[8]}
                    min={0}
                    max={50}
                    value={[blurAmount]}
                    className="flex-1"
                    onValueChange={(value) =>
                      setBlurAmount(value[0] ?? blurAmount)
                    }
                  />
                  <span className="min-w-12 text-sm font-medium text-right">
                    {blurAmount}px
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Export Section */}
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
                <div className="flex items-center gap-2">
                  <Input
                    id="css"
                    value={gradientCSS}
                    readOnly
                    className="flex-1 font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
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
                <div className="flex items-center gap-2">
                  <Input
                    id="tailwind"
                    value={tailwindGradientClass}
                    readOnly
                    className="flex-1 font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyTailwindClasses}
                    className="shrink-0"
                    aria-label="Copy Tailwind classes"
                  >
                    <DIcons.Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select value={aspectRatio} onValueChange={setAspectRatio}>
                  <SelectTrigger className="w-[140px]">
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
                <Button onClick={downloadJPG} className="flex-1">
                  <DIcons.Download className="h-4 w-4 mr-2" />
                  Download JPG
                </Button>
                <Button
                  size="icon"
                  onClick={resetSettings}
                  variant="secondary"
                  className="shrink-0"
                >
                  <DIcons.RotateCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width="1000"
        height="1000"
        style={{ display: "none" }}
      />
    </div>
  );
}
