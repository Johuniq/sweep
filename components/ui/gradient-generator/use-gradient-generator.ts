import Color from "color";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { defaultColorStops, gradientPresets } from "./constants";
import type { ColorStop } from "./types";
import { createColorStopId } from "./utils";

type DownloadOptions = {
  aspectRatio: string;
  applyBlur: boolean;
  blurAmount: number;
  applyNoise: boolean;
  noiseAmount: number;
  sortedColorStops: ColorStop[];
  isRadialGradient: boolean;
  angle: number;
};

const ASPECT_BASE_WIDTH = 1920;

const parseAspectRatio = (aspectRatio: string) => {
  const [widthRatio, heightRatio] = aspectRatio.split(":").map(Number);
  return {
    exportWidth: ASPECT_BASE_WIDTH,
    exportHeight: Math.round((ASPECT_BASE_WIDTH / widthRatio) * heightRatio),
  };
};

const toTailwindClass = (
  gradientString: string,
  isRadial: boolean,
  angle: number,
  applyBlur: boolean,
  blurAmount: number
) => {
  const gradientValue = !isRadial
    ? `linear-gradient(${angle}deg, ${gradientString})`
    : `radial-gradient(circle, ${gradientString})`;

  const sanitized = gradientValue.replace(/\s+/g, "_");
  const classes = [`bg-[${sanitized}]`];

  if (applyBlur && blurAmount > 0) {
    classes.push(`blur-[${blurAmount}px]`);
  }

  return classes.join(" ");
};

const buildSvgMarkup = (
  options: DownloadOptions
): { svg: string; filenameSuffix: string } => {
  const {
    aspectRatio,
    applyBlur,
    blurAmount,
    applyNoise,
    noiseAmount,
    sortedColorStops,
    isRadialGradient,
    angle,
  } = options;

  const { exportWidth, exportHeight } = parseAspectRatio(aspectRatio);
  const gradientId = `gradient-${Date.now()}`;
  const filterId = `effects-${Date.now()}`;
  const seed = Math.floor(Math.random() * 10_000);

  const gradientStops = sortedColorStops
    .map((stop) => {
      try {
        const parsed = Color(stop.color);
        const stopColor = parsed.hex().toLowerCase();
        const alpha = parsed.alpha();
        const opacityAttr =
          alpha < 1 ? ` stop-opacity="${alpha.toFixed(2)}"` : "";
        return `<stop offset="${stop.position}%" stop-color="${stopColor}"${opacityAttr} />`;
      } catch {
        return `<stop offset="${stop.position}%" stop-color="${stop.color}" />`;
      }
    })
    .join("\n      ");

  let gradientDefinition = "";

  if (!isRadialGradient) {
    const angleRad = ((angle - 90) * Math.PI) / 180;
    const centerX = exportWidth / 2;
    const centerY = exportHeight / 2;
    const diagonal = Math.sqrt(
      exportWidth * exportWidth + exportHeight * exportHeight
    );

    const x1 = centerX + (Math.cos(angleRad) * diagonal) / 2;
    const y1 = centerY + (Math.sin(angleRad) * diagonal) / 2;
    const x2 = centerX - (Math.cos(angleRad) * diagonal) / 2;
    const y2 = centerY - (Math.sin(angleRad) * diagonal) / 2;

    gradientDefinition = `<linearGradient id="${gradientId}" gradientUnits="userSpaceOnUse" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
      ${gradientStops}
    </linearGradient>`;
  } else {
    const centerX = exportWidth / 2;
    const centerY = exportHeight / 2;
    const radius = Math.max(exportWidth, exportHeight) / 2;

    gradientDefinition = `<radialGradient id="${gradientId}" gradientUnits="userSpaceOnUse" cx="${centerX}" cy="${centerY}" r="${radius}">
      ${gradientStops}
    </radialGradient>`;
  }

  const shouldApplyBlur = applyBlur && blurAmount > 0;
  const shouldApplyNoise = applyNoise && noiseAmount > 0;
  const hasFilter = shouldApplyBlur || shouldApplyNoise;

  let filterDefinition = "";
  let rectFilterAttribute = "";

  if (hasFilter) {
    const blurDeviation = shouldApplyBlur ? blurAmount / 2 : 0;
    const noiseStrength = shouldApplyNoise ? Math.min(1, noiseAmount / 200) : 0;
    const baseFrequency = noiseStrength
      ? (0.02 + noiseStrength * 0.08).toFixed(3)
      : "0";
    const noiseOpacity = noiseStrength ? (noiseStrength * 0.6).toFixed(2) : "0";

    const filterPrimitives = [
      `<feGaussianBlur in="SourceGraphic" stdDeviation="${blurDeviation}" result="blurred" />`,
    ];

    if (noiseStrength > 0) {
      filterPrimitives.push(
        `<feTurbulence type="fractalNoise" baseFrequency="${baseFrequency}" numOctaves="3" seed="${seed}" result="noise" />`
      );
      filterPrimitives.push(
        `<feColorMatrix in="noise" type="matrix" values="0.6 0 0 0 0 0 0.6 0 0 0 0 0 0.6 0 0 0 0 0 ${noiseOpacity} 0" result="noiseAlpha" />`
      );
      filterPrimitives.push(
        `<feBlend in="blurred" in2="noiseAlpha" mode="soft-light" result="withNoise" />`
      );
    }

    const filterBody = filterPrimitives.filter(Boolean).join("\n      ");

    filterDefinition = `<filter id="${filterId}" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
      ${filterBody}
    </filter>`;

    rectFilterAttribute = ` filter="url(#${filterId})"`;
  }

  const defsContent = [gradientDefinition, filterDefinition]
    .filter(Boolean)
    .join("\n    ");

  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${exportWidth}" height="${exportHeight}" viewBox="0 0 ${exportWidth} ${exportHeight}">
  <defs>
    ${defsContent}
  </defs>
  <rect width="${exportWidth}" height="${exportHeight}" fill="url(#${gradientId})"${rectFilterAttribute} />
</svg>`;

  return {
    svg: svgString,
    filenameSuffix: aspectRatio.replace(":", "x"),
  };
};

export const useGradientGenerator = () => {
  const [colorStops, setColorStops] = useState<ColorStop[]>(defaultColorStops);
  const [angle, setAngle] = useState(90);
  const [noiseAmount, setNoiseAmount] = useState(0);
  const [applyNoise, setApplyNoise] = useState(false);
  const [blurAmount, setBlurAmount] = useState(0);
  const [applyBlur, setApplyBlur] = useState(false);
  const [isRadialGradient, setIsRadialGradient] = useState(false);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);

  const sortedColorStops = useMemo(
    () => [...colorStops].sort((a, b) => a.position - b.position),
    [colorStops]
  );

  const gradientString = useMemo(
    () =>
      sortedColorStops
        .map((stop) => `${stop.color} ${stop.position}%`)
        .join(", "),
    [sortedColorStops]
  );

  const blurCSS = useMemo(
    () =>
      applyBlur && blurAmount > 0 ? ` filter: blur(${blurAmount}px);` : "",
    [applyBlur, blurAmount]
  );

  const gradientCSS = useMemo(
    () =>
      (!isRadialGradient
        ? `background: linear-gradient(${angle}deg, ${gradientString});`
        : `background: radial-gradient(circle, ${gradientString});`) + blurCSS,
    [isRadialGradient, angle, gradientString, blurCSS]
  );

  const tailwindGradientClass = useMemo(
    () =>
      toTailwindClass(
        gradientString,
        isRadialGradient,
        angle,
        applyBlur,
        blurAmount
      ),
    [gradientString, isRadialGradient, angle, applyBlur, blurAmount]
  );

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
      applyBlur,
      blurAmount,
      applyNoise,
      noiseAmount,
      isRadialGradient,
      angle,
      sortedColorStops,
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

  const copyGradientCss = useCallback(() => {
    navigator.clipboard.writeText(gradientCSS).catch(() => {});
  }, [gradientCSS]);

  const copyTailwind = useCallback(() => {
    navigator.clipboard.writeText(tailwindGradientClass).catch(() => {});
  }, [tailwindGradientClass]);

  const downloadJpg = useCallback(() => {
    const { exportWidth, exportHeight } = parseAspectRatio(aspectRatio);
    const canvas = document.createElement("canvas");

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
  }, [aspectRatio, renderGradientOnCanvas]);

  const downloadSvg = useCallback(() => {
    const { svg, filenameSuffix } = buildSvgMarkup({
      aspectRatio,
      applyBlur,
      blurAmount,
      applyNoise,
      noiseAmount,
      sortedColorStops,
      isRadialGradient,
      angle,
    });

    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `gradient-${filenameSuffix}.svg`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [
    angle,
    applyBlur,
    blurAmount,
    applyNoise,
    noiseAmount,
    aspectRatio,
    sortedColorStops,
    isRadialGradient,
  ]);

  const addColorStop = useCallback(() => {
    if (sortedColorStops.length >= 5 || sortedColorStops.length < 2) {
      return;
    }

    setSelectedPresetId(null);

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

    setColorStops((prev) =>
      [
        ...prev,
        {
          id: createColorStopId(),
          color: blendedColor,
          position: newPosition,
        },
      ].sort((a, b) => a.position - b.position)
    );
  }, [sortedColorStops]);

  const removeColorStop = useCallback((id: string) => {
    setSelectedPresetId(null);
    setColorStops((prev) =>
      prev.length > 2 ? prev.filter((stop) => stop.id !== id) : prev
    );
  }, []);

  const updateColorStop = useCallback(
    (id: string, color: string, position: number) => {
      setSelectedPresetId(null);
      setColorStops((prev) =>
        prev
          .map((stop) => (stop.id === id ? { ...stop, color, position } : stop))
          .sort((a, b) => a.position - b.position)
      );
    },
    []
  );

  const shuffleGradient = useCallback(() => {
    if (!sortedColorStops.length) {
      return;
    }

    setSelectedPresetId(null);

    const shuffleArray = <T>(items: T[]) => {
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
        const candidate = Math.floor(Math.random() * 99) + 1;
        if (!used.has(candidate)) {
          used.add(candidate);
          interior.push(candidate);
        }
      }

      interior.sort((a, b) => a - b);
      return [0, ...interior, 100];
    })();

    setColorStops((prev) =>
      prev
        .map((stop, index) => ({
          ...stop,
          color: shuffledColors[index] ?? stop.color,
          position: positions[index] ?? stop.position,
        }))
        .sort((a, b) => a.position - b.position)
    );

    if (!isRadialGradient) {
      setAngle(Math.floor(Math.random() * 361));
    }
  }, [sortedColorStops, isRadialGradient]);

  const applyPreset = useCallback((presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = gradientPresets.find((item) => item.id === presetId);
    if (!preset) {
      return;
    }

    const clonedStops = preset.stops.map((stop) => ({
      id: createColorStopId(),
      color: stop.color,
      position: stop.position,
    }));

    setColorStops(clonedStops);

    const radial = preset.isRadial ?? false;
    setIsRadialGradient(radial);
    if (!radial) {
      setAngle(preset.angle ?? 90);
    } else if (preset.angle !== undefined) {
      setAngle(preset.angle);
    }

    const shouldApplyNoise = preset.applyNoise ?? false;
    setApplyNoise(shouldApplyNoise);
    setNoiseAmount(shouldApplyNoise ? preset.noiseAmount ?? 20 : 0);

    const shouldApplyBlur = preset.applyBlur ?? false;
    setApplyBlur(shouldApplyBlur);
    setBlurAmount(shouldApplyBlur ? preset.blurAmount ?? 12 : 0);
  }, []);

  const resetSettings = useCallback(() => {
    setColorStops(defaultColorStops);
    setAngle(90);
    setNoiseAmount(0);
    setApplyNoise(false);
    setBlurAmount(0);
    setApplyBlur(false);
    setIsRadialGradient(false);
    setSelectedPresetId(null);
  }, []);

  return {
    state: {
      colorStops,
      sortedColorStops,
      angle,
      noiseAmount,
      applyNoise,
      blurAmount,
      applyBlur,
      isRadialGradient,
      aspectRatio,
      selectedPresetId,
      gradientCSS,
      tailwindGradientClass,
      gradientString,
    },
    refs: {
      canvasRef,
      displayCanvasRef,
    },
    presets: gradientPresets,
    actions: {
      setAngle,
      setNoiseAmount,
      setApplyNoise,
      setBlurAmount,
      setApplyBlur,
      setIsRadialGradient,
      setAspectRatio,
      setSelectedPresetId,
      copyGradientCss,
      copyTailwind,
      downloadJpg,
      downloadSvg,
      addColorStop,
      removeColorStop,
      updateColorStop,
      shuffleGradient,
      applyPreset,
      resetSettings,
    },
  };
};
