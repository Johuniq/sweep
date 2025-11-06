"use client";

import { ColorStopsEditor } from "./gradient-generator/color-stops-editor";
import { EffectControls } from "./gradient-generator/effect-controls";
import { ExportControls } from "./gradient-generator/export-controls";
import { GradientTypeControls } from "./gradient-generator/gradient-type-controls";
import { GradientPresetSelector } from "./gradient-generator/preset-selector";
import { useGradientGenerator } from "./gradient-generator/use-gradient-generator";

export function GradientGenerator() {
  const { state, refs, presets, actions } = useGradientGenerator();
  const { canvasRef, displayCanvasRef } = refs;

  return (
    <div className="mt-10 flex items-center justify-center px-4 pb-8 sm:px-6 lg:px-8 xl:px-0">
      <div className="mx-auto w-full max-w-7xl space-y-6 rounded-2xl border-2 bg-popover/80 p-4 sm:p-6 lg:p-8">
        <div className="relative w-full">
          <canvas
            ref={displayCanvasRef}
            width={1000}
            height={1000}
            className="aspect-video h-full w-full rounded-xl shadow-lg"
          />
        </div>

        <div className="space-y-6">
          <GradientPresetSelector
            presets={presets}
            selectedPresetId={state.selectedPresetId}
            onSelect={actions.applyPreset}
          />

          <ColorStopsEditor
            colorStops={state.colorStops}
            onAdd={actions.addColorStop}
            onRemove={actions.removeColorStop}
            onUpdate={actions.updateColorStop}
            onShuffle={actions.shuffleGradient}
            canAddMore={state.colorStops.length < 5}
          />

          <GradientTypeControls
            isRadial={state.isRadialGradient}
            angle={state.angle}
            onToggleRadial={actions.setIsRadialGradient}
            onAngleChange={actions.setAngle}
          />

          <EffectControls
            applyNoise={state.applyNoise}
            noiseAmount={state.noiseAmount}
            onToggleNoise={actions.setApplyNoise}
            onNoiseAmountChange={actions.setNoiseAmount}
            applyBlur={state.applyBlur}
            blurAmount={state.blurAmount}
            onToggleBlur={actions.setApplyBlur}
            onBlurAmountChange={actions.setBlurAmount}
          />

          <ExportControls
            gradientCSS={state.gradientCSS}
            tailwindClass={state.tailwindGradientClass}
            aspectRatio={state.aspectRatio}
            onAspectRatioChange={actions.setAspectRatio}
            onCopyCss={actions.copyGradientCss}
            onCopyTailwind={actions.copyTailwind}
            onDownloadJpg={actions.downloadJpg}
            onDownloadSvg={actions.downloadSvg}
            onReset={actions.resetSettings}
          />
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
