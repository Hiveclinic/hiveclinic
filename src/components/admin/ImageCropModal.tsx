import { useState, useRef, useCallback, useEffect } from "react";
import { X, Crop, RotateCw } from "lucide-react";

type Props = {
  imageFile: File;
  aspectRatio?: number; // width/height, e.g. 16/9
  onCrop: (croppedBlob: Blob) => void;
  onCancel: () => void;
};

const PRESETS = [
  { label: "Free", ratio: 0 },
  { label: "16:9 (Hero)", ratio: 16 / 9 },
  { label: "1:1 (Square)", ratio: 1 },
  { label: "4:3", ratio: 4 / 3 },
];

const ImageCropModal = ({ imageFile, aspectRatio = 0, onCrop, onCancel }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imgSrc, setImgSrc] = useState("");
  const [imgLoaded, setImgLoaded] = useState(false);
  const [ratio, setRatio] = useState(aspectRatio);
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, cx: 0, cy: 0 });
  const [displaySize, setDisplaySize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const url = URL.createObjectURL(imageFile);
    setImgSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const onImgLoad = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    const maxW = Math.min(600, window.innerWidth - 80);
    const scale = maxW / img.naturalWidth;
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    setDisplaySize({ w: dw, h: dh });

    // Initial crop: centered, 80% of image
    let cw = dw * 0.8;
    let ch = dh * 0.8;
    if (ratio > 0) {
      if (cw / ch > ratio) cw = ch * ratio;
      else ch = cw / ratio;
    }
    setCrop({ x: (dw - cw) / 2, y: (dh - ch) / 2, w: cw, h: ch });
    setImgLoaded(true);
  }, [ratio]);

  useEffect(() => {
    if (!imgLoaded) return;
    let cw = displaySize.w * 0.8;
    let ch = displaySize.h * 0.8;
    if (ratio > 0) {
      if (cw / ch > ratio) cw = ch * ratio;
      else ch = cw / ratio;
    }
    setCrop({ x: (displaySize.w - cw) / 2, y: (displaySize.h - ch) / 2, w: cw, h: ch });
  }, [ratio, imgLoaded, displaySize]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    if (mx >= crop.x && mx <= crop.x + crop.w && my >= crop.y && my <= crop.y + crop.h) {
      setDragging(true);
      setDragStart({ x: mx, y: my, cx: crop.x, cy: crop.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    let nx = dragStart.cx + (mx - dragStart.x);
    let ny = dragStart.cy + (my - dragStart.y);
    nx = Math.max(0, Math.min(nx, displaySize.w - crop.w));
    ny = Math.max(0, Math.min(ny, displaySize.h - crop.h));
    setCrop(prev => ({ ...prev, x: nx, y: ny }));
  };

  const handleMouseUp = () => setDragging(false);

  const doCrop = () => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const scale = img.naturalWidth / displaySize.w;
    const sx = crop.x * scale;
    const sy = crop.y * scale;
    const sw = crop.w * scale;
    const sh = crop.h * scale;
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    canvas.toBlob(blob => { if (blob) onCrop(blob); }, "image/jpeg", 0.92);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-background border border-border max-w-[700px] w-full p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <h3 className="font-display text-lg flex items-center gap-2"><Crop size={16} /> Crop Image</h3>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>

        {/* Aspect ratio presets */}
        <div className="flex gap-2 flex-wrap">
          {PRESETS.map(p => (
            <button
              key={p.label}
              onClick={() => setRatio(p.ratio)}
              className={`px-3 py-1.5 border font-body text-xs tracking-wider uppercase transition-colors ${ratio === p.ratio ? "border-gold text-gold" : "border-border text-muted-foreground hover:border-foreground"}`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Image + crop area */}
        <div
          ref={containerRef}
          className="relative mx-auto cursor-move select-none"
          style={{ width: displaySize.w, height: displaySize.h }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            ref={imgRef}
            src={imgSrc}
            onLoad={onImgLoad}
            className="block"
            style={{ width: displaySize.w, height: displaySize.h }}
            alt="Crop preview"
          />
          {imgLoaded && (
            <>
              {/* Darkened overlay */}
              <div className="absolute inset-0 bg-black/50 pointer-events-none"
                style={{
                  clipPath: `polygon(0% 0%, 0% 100%, ${crop.x}px 100%, ${crop.x}px ${crop.y}px, ${crop.x + crop.w}px ${crop.y}px, ${crop.x + crop.w}px ${crop.y + crop.h}px, ${crop.x}px ${crop.y + crop.h}px, ${crop.x}px 100%, 100% 100%, 100% 0%)`
                }}
              />
              {/* Crop border */}
              <div
                className="absolute border-2 border-gold pointer-events-none"
                style={{ left: crop.x, top: crop.y, width: crop.w, height: crop.h }}
              />
            </>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 border border-border font-body text-xs uppercase tracking-wider hover:border-foreground transition-colors">Cancel</button>
          <button onClick={doCrop} className="px-4 py-2 bg-foreground text-background font-body text-xs uppercase tracking-wider hover:bg-accent transition-colors">Apply Crop</button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
