import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Maximize2,
  Minimize2,
  RefreshCw,
  Loader2,
  ArrowLeft,
  Check,
  AlertCircle
} from 'lucide-react';

interface AvatarAdjustEditorProps {
  imageSource: string;
  onSave: (croppedDataUrl: string, blob: Blob) => void | Promise<void>;
  onCancel: () => void;
  uiTheme: 'dark' | 'light';
  isSaving?: boolean;
}

export const AvatarAdjustEditor: React.FC<AvatarAdjustEditorProps> = ({
  imageSource,
  onSave,
  onCancel,
  uiTheme,
  isSaving = false,
}) => {
  const isLight = uiTheme === 'light';
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [resolvedSrc, setResolvedSrc] = useState(imageSource);

  const [naturalDimensions, setNaturalDimensions] = useState({ width: 0, height: 0 });

  const [scale, setScale] = useState(1.0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  const VIEWPORT_SIZE = 170;

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setLoadError(null);

    const checkAndLoad = async () => {
      let srcToLoad = imageSource;

      if (
        imageSource.startsWith('http://') ||
        imageSource.startsWith('https://')
      ) {
        if (!imageSource.includes(window.location.host)) {
          srcToLoad = `/api/proxy-image?url=${encodeURIComponent(imageSource)}`;
        }
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        if (!active) return;
        imgRef.current = img;
        setNaturalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        setResolvedSrc(srcToLoad);
        setIsLoading(false);

        const minDim = Math.min(img.naturalWidth, img.naturalHeight);
        if (minDim > 0) {

          setScale(1.0);
          setPosition({ x: 0, y: 0 });
        }
      };

      img.onerror = () => {
        if (!active) return;

        if (srcToLoad !== imageSource) {
          const directImg = new Image();
          directImg.crossOrigin = 'anonymous';
          directImg.onload = () => {
            if (!active) return;
            imgRef.current = directImg;
            setNaturalDimensions({ width: directImg.naturalWidth, height: directImg.naturalHeight });
            setResolvedSrc(imageSource);
            setIsLoading(false);
          };
          directImg.onerror = () => {
            if (!active) return;
            setIsLoading(false);
            setLoadError('Unable to load image. Please verify the link or file format.');
          };
          directImg.src = imageSource;
        } else {
          setIsLoading(false);
          setLoadError('Unable to load image. Please verify the link or file format.');
        }
      };

      img.src = srcToLoad;
    };

    checkAndLoad();

    return () => {
      active = false;
    };
  }, [imageSource]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isLoading || loadError) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    setPosition({
      x: dragStartRef.current.posX + deltaX,
      y: dragStartRef.current.posY + deltaY,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {

      }
    }
  };

  const handleZoomChange = (newScale: number) => {
    const clamped = Math.min(3.5, Math.max(0.4, Number(newScale.toFixed(2))));
    setScale(clamped);
  };

  const handleZoomIn = () => {
    handleZoomChange(scale + 0.15);
  };

  const handleZoomOut = () => {
    handleZoomChange(scale - 0.15);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setScale(1.0);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  const handleFit = () => {
    if (!naturalDimensions.width || !naturalDimensions.height) return;
    const maxDim = Math.max(naturalDimensions.width, naturalDimensions.height);
    const fitScale = VIEWPORT_SIZE / maxDim;

    const baseScale = Math.min(naturalDimensions.width, naturalDimensions.height) / VIEWPORT_SIZE;
    setScale(Math.max(0.4, fitScale * baseScale));
    setPosition({ x: 0, y: 0 });
  };

  const handleFill = () => {
    setScale(1.0);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomStep = e.deltaY < 0 ? 0.08 : -0.08;
    handleZoomChange(scale + zoomStep);
  };

  const handleExport = useCallback(async () => {
    if (!imgRef.current) return;

    const isUnmodifiedRemote =
      (imageSource.startsWith('http://') || imageSource.startsWith('https://')) &&
      Math.abs(scale - 1.0) < 0.01 &&
      Math.abs(position.x) < 1 &&
      Math.abs(position.y) < 1 &&
      rotation % 360 === 0;

    if (isUnmodifiedRemote) {
      await onSave(imageSource, new Blob());
      return;
    }

    const img = imgRef.current;
    const OUTPUT_SIZE = 512;
    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const ratio = OUTPUT_SIZE / VIEWPORT_SIZE;

    ctx.save();

    ctx.translate(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2);

    ctx.rotate((rotation * Math.PI) / 180);

    ctx.translate(position.x * ratio, position.y * ratio);

    const imgAspect = img.naturalWidth / img.naturalHeight;
    let baseDrawWidth = OUTPUT_SIZE;
    let baseDrawHeight = OUTPUT_SIZE;

    if (imgAspect > 1) {

      baseDrawHeight = OUTPUT_SIZE;
      baseDrawWidth = OUTPUT_SIZE * imgAspect;
    } else {

      baseDrawWidth = OUTPUT_SIZE;
      baseDrawHeight = OUTPUT_SIZE / imgAspect;
    }

    const finalWidth = baseDrawWidth * scale;
    const finalHeight = baseDrawHeight * scale;

    ctx.drawImage(
      img,
      -finalWidth / 2,
      -finalHeight / 2,
      finalWidth,
      finalHeight
    );
    ctx.restore();

    try {
      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
            await onSave(dataUrl, new Blob());
            return;
          }
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          await onSave(dataUrl, blob);
        },
        'image/jpeg',
        0.92
      );
    } catch (exportErr) {
      console.warn('Canvas export tainted or failed, falling back to direct URL:', exportErr);

      await onSave(imageSource, new Blob());
    }
  }, [position, scale, rotation, onSave, imageSource]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to selection</span>
        </button>

        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Adjust Size & Framing
        </span>
      </div>

      <div className="flex flex-col items-center justify-center select-none">
        <div
          ref={containerRef}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ width: `${VIEWPORT_SIZE}px`, height: `${VIEWPORT_SIZE}px` }}
          className={`relative rounded-full overflow-hidden border-2 cursor-grab active:cursor-grabbing shadow-inner touch-none ${
            isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-900 border-slate-700'
          }`}
        >
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950/20 backdrop-blur-xs z-20">
              <Loader2 className="w-6 h-6 animate-spin text-[var(--brand-primary)]" />
              <span className="text-[11px] font-medium text-slate-500">Loading picture...</span>
            </div>
          )}

          {loadError ? (
            <div className="absolute inset-0 p-4 flex flex-col items-center justify-center text-center gap-2 bg-rose-500/10 text-rose-600 dark:text-rose-400 z-20">
              <AlertCircle className="w-6 h-6" />
              <p className="text-[11px] leading-tight">{loadError}</p>
            </div>
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-75"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${scale})`,
              }}
            >
              <img
                src={resolvedSrc}
                alt="Adjust preview"
                className="max-w-none pointer-events-none select-none"
                style={{
                  width: naturalDimensions.width >= naturalDimensions.height ? 'auto' : `${VIEWPORT_SIZE}px`,
                  height: naturalDimensions.width >= naturalDimensions.height ? `${VIEWPORT_SIZE}px` : 'auto',
                }}
                draggable={false}
              />
            </div>
          )}

          <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none ring-1 ring-black/10" />
        </div>

        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 flex items-center gap-1">
          Drag photo to position &bull; Use slider to resize
        </p>
      </div>

      <div
        className={`p-3 rounded-xl border space-y-2.5 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
        }`}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>Picture Size / Zoom</span>
            </span>
            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {Math.round(scale * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={scale <= 0.4 || isLoading}
              className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 cursor-pointer transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <input
              type="range"
              min="0.4"
              max="3.5"
              step="0.02"
              value={scale}
              onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
              disabled={isLoading || Boolean(loadError)}
              className="flex-1 accent-[var(--brand-primary)] h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />

            <button
              type="button"
              onClick={handleZoomIn}
              disabled={scale >= 3.5 || isLoading}
              className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 cursor-pointer transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleFill}
              disabled={isLoading || Boolean(loadError)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer inline-flex items-center gap-1"
              title="Cover entire circle"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Fill</span>
            </button>

            <button
              type="button"
              onClick={handleFit}
              disabled={isLoading || Boolean(loadError)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer inline-flex items-center gap-1"
              title="Fit entire image"
            >
              <Minimize2 className="w-3 h-3" />
              <span>Fit</span>
            </button>

            <button
              type="button"
              onClick={handleRotate}
              disabled={isLoading || Boolean(loadError)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer inline-flex items-center gap-1"
              title="Rotate 90 degrees"
            >
              <RotateCw className="w-3 h-3" />
              <span>Rotate</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading || Boolean(loadError)}
            className="px-2.5 py-1 rounded-full text-[11px] font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1"
            title="Reset position and size"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className={`px-4 py-2 rounded-full border text-xs font-semibold cursor-pointer disabled:opacity-50 transition-colors ${
            isLight
              ? 'border-slate-200 text-slate-700 hover:bg-slate-50'
              : 'border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleExport}
          disabled={isLoading || Boolean(loadError) || isSaving}
          className="px-5 py-2 rounded-full bg-[var(--brand-primary)] hover:opacity-90 disabled:opacity-50 text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs inline-flex items-center gap-1.5"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Applying Changes...</span>
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Apply Profile Picture</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
