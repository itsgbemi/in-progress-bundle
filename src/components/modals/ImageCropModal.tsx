import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Check,
  RotateCw,
  Maximize,
  Move,
  Crop as CropIcon,
  RefreshCw,
} from 'lucide-react';

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onApplyCrop: (croppedDataUrl: string) => void;
  isLight?: boolean;
}

type AspectPreset = 'free' | '1/1' | '16/9' | '4/3' | '3/2' | '9/16';

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  onApplyCrop,
  isLight = false,
}) => {
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({
    width: 500,
    height: 400,
  });

  const [crop, setCrop] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });
  const [aspect, setAspect] = useState<AspectPreset>('free');
  const [rotation, setRotation] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const dragModeRef = useRef<
    | 'move'
    | 'nw'
    | 'ne'
    | 'sw'
    | 'se'
    | 'n'
    | 's'
    | 'w'
    | 'e'
    | null
  >(null);
  const dragStartRef = useRef<{ clientX: number; clientY: number; crop: typeof crop }>({
    clientX: 0,
    clientY: 0,
    crop: { x: 0, y: 0, width: 0, height: 0 },
  });

  useEffect(() => {
    if (isOpen && imageUrl) {
      setRotation(0);
      setAspect('free');
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
        setCrop({ x: 10, y: 10, width: 80, height: 80 });
      };
      img.src = imageUrl;
    }
  }, [isOpen, imageUrl]);

  useEffect(() => {
    if (!isOpen) return;
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [isOpen]);

  const handlePointerDown = (
    e: React.PointerEvent,
    mode: 'move' | 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'w' | 'e'
  ) => {
    e.preventDefault();
    e.stopPropagation();
    dragModeRef.current = mode;
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      crop: { ...crop },
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragModeRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const deltaXPercent = ((e.clientX - dragStartRef.current.clientX) / rect.width) * 100;
      const deltaYPercent = ((e.clientY - dragStartRef.current.clientY) / rect.height) * 100;
      const init = dragStartRef.current.crop;
      const mode = dragModeRef.current;

      let newCrop = { ...init };

      if (mode === 'move') {
        const maxX = 100 - init.width;
        const maxY = 100 - init.height;
        newCrop.x = Math.max(0, Math.min(maxX, init.x + deltaXPercent));
        newCrop.y = Math.max(0, Math.min(maxY, init.y + deltaYPercent));
      } else {
        let left = init.x;
        let right = init.x + init.width;
        let top = init.y;
        let bottom = init.y + init.height;

        if (mode.includes('w')) {
          left = Math.min(right - 5, Math.max(0, init.x + deltaXPercent));
        }
        if (mode.includes('e')) {
          right = Math.max(left + 5, Math.min(100, init.x + init.width + deltaXPercent));
        }
        if (mode.includes('n')) {
          top = Math.min(bottom - 5, Math.max(0, init.y + deltaYPercent));
        }
        if (mode.includes('s')) {
          bottom = Math.max(top + 5, Math.min(100, init.y + init.height + deltaYPercent));
        }

        newCrop = {
          x: left,
          y: top,
          width: right - left,
          height: bottom - top,
        };
      }

      setCrop(newCrop);
    },
    []
  );

  const handlePointerUp = (e: React.PointerEvent) => {
    dragModeRef.current = null;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {

    }
  };

  const applyPreset = (preset: AspectPreset) => {
    setAspect(preset);
    if (preset === 'free') return;

    let targetRatio = 1;
    switch (preset) {
      case '1/1':
        targetRatio = 1;
        break;
      case '16/9':
        targetRatio = 16 / 9;
        break;
      case '4/3':
        targetRatio = 4 / 3;
        break;
      case '3/2':
        targetRatio = 3 / 2;
        break;
      case '9/16':
        targetRatio = 9 / 16;
        break;
    }

    if (naturalSize.width && naturalSize.height) {
      const imgRatio = naturalSize.width / naturalSize.height;

      const percentRatio = targetRatio / imgRatio;
      let newW = 70;
      let newH = newW / percentRatio;
      if (newH > 80) {
        newH = 80;
        newW = newH * percentRatio;
      }
      if (newW > 90) {
        newW = 90;
        newH = newW / percentRatio;
      }

      const newX = Math.max(0, (100 - newW) / 2);
      const newY = Math.max(0, (100 - newH) / 2);
      setCrop({
        x: Math.round(newX),
        y: Math.round(newY),
        width: Math.round(newW),
        height: Math.round(newH),
      });
    }
  };

  const handleApply = async () => {
    if (!naturalSize.width || !naturalSize.height) return;
    setIsProcessing(true);

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context unavailable');

      const cropX = Math.round((crop.x / 100) * naturalSize.width);
      const cropY = Math.round((crop.y / 100) * naturalSize.height);
      const cropW = Math.max(1, Math.round((crop.width / 100) * naturalSize.width));
      const cropH = Math.max(1, Math.round((crop.height / 100) * naturalSize.height));

      if (rotation % 180 !== 0) {
        canvas.width = cropH;
        canvas.height = cropW;
      } else {
        canvas.width = cropW;
        canvas.height = cropH;
      }

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      const drawW = rotation % 180 !== 0 ? cropH : cropW;
      const drawH = rotation % 180 !== 0 ? cropW : cropH;

      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropW,
        cropH,
        -drawW / 2,
        -drawH / 2,
        drawW,
        drawH
      );

      const croppedDataUrl = canvas.toDataURL('image/png', 0.95);
      onApplyCrop(croppedDataUrl);
      onClose();
    } catch (err) {
      console.error('Failed to crop image:', err);

      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
              <CropIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Freeform Image Cropper</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Drag corners or the box to freely crop the image to any dimension
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-semibold text-slate-500 mr-1">Aspect:</span>
            {[
              { id: 'free', label: 'Freeform' },
              { id: '1/1', label: '1:1 Square' },
              { id: '16/9', label: '16:9 Widescreen' },
              { id: '4/3', label: '4:3 Standard' },
              { id: '3/2', label: '3:2 Photo' },
              { id: '9/16', label: '9:16 Story' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id as AspectPreset)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                  aspect === p.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : isLight
                    ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRotation((prev) => (prev + 90) % 360)}
              className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
              title="Rotate 90° clockwise"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Rotate</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setCrop({ x: 5, y: 5, width: 90, height: 90 });
                setRotation(0);
                setAspect('free');
              }}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
              title="Reset Crop"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="relative flex-1 p-6 flex items-center justify-center bg-slate-950/90 overflow-hidden min-h-[350px]">
          <div
            ref={containerRef}
            className="relative inline-block max-w-full max-h-[50vh] shadow-2xl overflow-hidden rounded-lg"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: 'transform 0.2s ease',
            }}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <img
              ref={imgRef}
              src={imageUrl}
              alt="Crop target"
              crossOrigin="anonymous"
              className="max-w-full max-h-[50vh] object-contain block pointer-events-none select-none"
            />

            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at ${crop.x + crop.width / 2}% ${
                  crop.y + crop.height / 2
                }%, transparent 0%, transparent 100%)`,
              }}
            >
              <div
                className="absolute left-0 right-0 top-0 bg-black/60 backdrop-blur-[1px]"
                style={{ height: `${crop.y}%` }}
              />
              <div
                className="absolute left-0 right-0 bottom-0 bg-black/60 backdrop-blur-[1px]"
                style={{ height: `${100 - (crop.y + crop.height)}%` }}
              />
              <div
                className="absolute left-0 bg-black/60 backdrop-blur-[1px]"
                style={{
                  top: `${crop.y}%`,
                  height: `${crop.height}%`,
                  width: `${crop.x}%`,
                }}
              />
              <div
                className="absolute right-0 bg-black/60 backdrop-blur-[1px]"
                style={{
                  top: `${crop.y}%`,
                  height: `${crop.height}%`,
                  width: `${100 - (crop.x + crop.width)}%`,
                }}
              />
            </div>

            <div
              className="absolute border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.5)] cursor-move group"
              style={{
                left: `${crop.x}%`,
                top: `${crop.y}%`,
                width: `${crop.width}%`,
                height: `${crop.height}%`,
              }}
              onPointerDown={(e) => handlePointerDown(e, 'move')}
            >
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity">
                <div className="border-r border-b border-white/60" />
                <div className="border-r border-b border-white/60" />
                <div className="border-b border-white/60" />
                <div className="border-r border-b border-white/60" />
                <div className="border-r border-b border-white/60" />
                <div className="border-b border-white/60" />
                <div className="border-r border-white/60" />
                <div className="border-r border-white/60" />
                <div />
              </div>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-80 transition-opacity">
                <div className="p-1 rounded-full bg-black/60 text-white shadow-xs">
                  <Move className="w-4 h-4" />
                </div>
              </div>

              <div
                className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-sm shadow-md cursor-nwse-resize hover:scale-125 transition-transform"
                onPointerDown={(e) => handlePointerDown(e, 'nw')}
              />
              <div
                className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-sm shadow-md cursor-nesw-resize hover:scale-125 transition-transform"
                onPointerDown={(e) => handlePointerDown(e, 'ne')}
              />
              <div
                className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-sm shadow-md cursor-nesw-resize hover:scale-125 transition-transform"
                onPointerDown={(e) => handlePointerDown(e, 'sw')}
              />
              <div
                className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-sm shadow-md cursor-nwse-resize hover:scale-125 transition-transform"
                onPointerDown={(e) => handlePointerDown(e, 'se')}
              />

              <div
                className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 h-3 bg-white border border-indigo-600 rounded-xs shadow-xs cursor-ns-resize"
                onPointerDown={(e) => handlePointerDown(e, 'n')}
              />
              <div
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-6 h-3 bg-white border border-indigo-600 rounded-xs shadow-xs cursor-ns-resize"
                onPointerDown={(e) => handlePointerDown(e, 's')}
              />
              <div
                className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-6 bg-white border border-indigo-600 rounded-xs shadow-xs cursor-ew-resize"
                onPointerDown={(e) => handlePointerDown(e, 'w')}
              />
              <div
                className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-6 bg-white border border-indigo-600 rounded-xs shadow-xs cursor-ew-resize"
                onPointerDown={(e) => handlePointerDown(e, 'e')}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            {naturalSize.width > 0 && (
              <span>
                Selection: {Math.round((crop.width / 100) * naturalSize.width)} ×{' '}
                {Math.round((crop.height / 100) * naturalSize.height)} px
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={isProcessing}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Cropping...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Apply Crop</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
