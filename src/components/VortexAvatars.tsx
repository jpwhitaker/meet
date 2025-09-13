import React, { useEffect, useMemo, useRef, useState } from "react";
import { getColorFromId, getInitialsFromName } from "@/lib/colorUtils";

/**
 * VortexAvatars (Pure Component)
 * - Organic whirlpool of rounded 20x20 avatars using <canvas> (≤200 ok).
 * - Inner orbits move faster; outer slower. Everyone slowly migrates in/out.
 * - Toggle button: Vortex ⇄ 10 groups of 3 (5 stacks left, 5 right).
 * - HiDPI aware, resizes to container, lightweight tween engine for transitions.
 */

export type Person = { id: string; name: string; image?: string };

// ---------- Math & Utils ----------
const TAU = Math.PI * 2;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

const loadImage = (src?: string | null): Promise<HTMLImageElement | null> =>
  new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

// ---------- Component ----------
export default function VortexAvatars({ 
  people,
  showControls = true,
  showStats = true,
  statusText,
  className = "w-full h-[540px]"
}: { 
  people: Person[];
  showControls?: boolean;
  showStats?: boolean;
  statusText?: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mode, setMode] = useState<"vortex" | "groups">("vortex");

  // Runtime state
  const actorsRef = useRef<any[]>([]);
  const imagesRef = useRef<Map<string, HTMLImageElement | null>>(new Map());
  const sizeRef = useRef({ w: 800, h: 520, dpr: 1 });
  const tweensRef = useRef<any[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);

  // Mount: setup canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const onResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      sizeRef.current = { w: rect.width, h: rect.height, dpr };
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    onResize();
    const ro = new ResizeObserver(onResize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  // Load assets + initialize actors
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(people.map(async (p) => [p.id, await loadImage(p.image)] as const));
      if (cancelled) return;
      imagesRef.current = new Map(entries);

      const { w, h } = sizeRef.current;
      const cx = w / 2;
      const cy = h / 2;
      const rMax = Math.min(cx, cy) - 12;

      // Randomized initial placement across rings
      const actors = people.map((p) => {
        const r = clamp(20 + Math.random() * rMax, 20, rMax);
        const theta = Math.random() * TAU;
        const x = cx + r * Math.cos(theta);
        const y = cy + r * Math.sin(theta);
        const baseOmega = 0.5; // rad/s inner
        const omegaScale = 0.85 + Math.random() * 0.3;
        const radPhase = Math.random();
        const angPhase = Math.random();
        const rDest = r + (Math.random() * 60 - 30);
        
        // Floaty noise parameters for organic movement
        const floatPhaseX = Math.random() * TAU;
        const floatPhaseY = Math.random() * TAU;
        const floatPhaseScale = Math.random() * TAU;
        const floatPhaseRotation = Math.random() * TAU;
        const floatSpeedX = 0.8 + Math.random() * 0.6; // 0.8-1.4 Hz
        const floatSpeedY = 0.9 + Math.random() * 0.8; // 0.9-1.7 Hz
        const floatSpeedScale = 0.6 + Math.random() * 0.4; // 0.6-1.0 Hz
        const floatSpeedRotation = 0.3 + Math.random() * 0.4; // 0.3-0.7 Hz
        const floatAmplitudeX = 1.2 + Math.random() * 1.8; // 1.2-3.0 px
        const floatAmplitudeY = 1.0 + Math.random() * 2.0; // 1.0-3.0 px
        const floatAmplitudeScale = 0.08 + Math.random() * 0.04; // 0.08-0.12 scale variation
        const floatAmplitudeRotation = 0.05 + Math.random() * 0.03; // 0.05-0.08 rad rotation
        
        return {
          id: p.id,
          name: p.name,
          img: imagesRef.current.get(p.id) ?? null,
          x,
          y,
          r,
          rDest,
          theta,
          plane: 0.5 + Math.random() * 1.7,
          baseOmega,
          omegaScale,
          radPhase,
          angPhase,
          // Floaty noise properties
          floatPhaseX,
          floatPhaseY, 
          floatPhaseScale,
          floatPhaseRotation,
          floatSpeedX,
          floatSpeedY,
          floatSpeedScale,
          floatSpeedRotation,
          floatAmplitudeX,
          floatAmplitudeY,
          floatAmplitudeScale,
          floatAmplitudeRotation,
          // Computed floaty values (will be updated each frame)
          floatOffsetX: 0,
          floatOffsetY: 0,
          floatScale: 1,
          floatRotation: 0,
        };
      });

      actorsRef.current = actors;
      startAnimation();
    })();

    return () => {
      cancelled = true;
      stopAnimation();
    };
  }, [people]);

  // RAF
  const startAnimation = () => {
    stopAnimation();
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      timeRef.current += dt;
      step(dt);
      draw();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };
  const stopAnimation = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
  };

  // Simulation step
  const step = (dt: number) => {
    const actors = actorsRef.current;
    if (!actors.length) return;

    // Tweens
    if (tweensRef.current.length) {
      const now = performance.now();
      tweensRef.current = tweensRef.current.filter((tw) => {
        const t = clamp((now - tw.start) / tw.duration, 0, 1);
        tw.update(easeInOut(t));
        if (t >= 1) {
          tw.done?.();
          return false;
        }
        return true;
      });
    }

    if (mode === "vortex") {
      const { w, h } = sizeRef.current;
      const cx = w / 2;
      const cy = h / 2;
      const time = timeRef.current;
      const rMax = Math.min(cx, cy) - 12;

      for (const a of actors) {
        // Z-plane (size/alpha) subtle drift
        a.plane += (Math.random() - 0.5) * 0.02;
        a.plane = clamp(a.plane, 0.6, 2.2);

        // Organic radial migration: slowly wandering target radius
        const wander = Math.sin(time * 0.25 + a.radPhase * TAU) * 6;
        a.rDest = clamp(a.rDest + wander * 0.02, 20, rMax);

        // Integrated neighbor-aware orbital dynamics
        let radialPressure = 0;
        let angularPressure = 0;
        const neighborInfluence = 45; // Influence radius
        const spacingPreference = 35; // Preferred spacing

        // Check neighbors for orbital adjustments
        for (const b of actors) {
          if (a === b) continue;
          
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < neighborInfluence && dist > 0.1) {
            const crowdingFactor = Math.max(0, spacingPreference - dist) / spacingPreference;
            
            // Radial pressure: push to different radius when crowded
            const radialDir = (b.r > a.r) ? -1 : 1; // Move away radially
            radialPressure += radialDir * crowdingFactor * 15;
            
            // Angular pressure: speed up/slow down to space out
            const angleDir = Math.atan2(dy, dx);
            const relativeAngle = ((angleDir - a.theta + TAU) % TAU) - Math.PI;
            const angularForce = Math.sign(relativeAngle) * crowdingFactor * 0.3;
            angularPressure += angularForce;
          }
        }

        // Apply neighbor-influenced radial target
        a.rDest += radialPressure * dt;
        a.rDest = clamp(a.rDest, 20, rMax);

        // Spring toward rDest
        const radialSpring = 0.9;
        a.r += (a.rDest - a.r) * radialSpring * dt;
        a.r = clamp(a.r, 20, rMax);

        // Neighbor-influenced angular velocity
        const p = 1.1;
        const baseOmega = a.omegaScale * a.baseOmega * Math.pow(120 / (a.r + 20), p);
        const wobble = 0.15 * Math.sin(time * 0.7 + a.angPhase * TAU);
        const neighborInfluencedOmega = baseOmega + angularPressure;
        
        // Ensure rotation never goes negative
        const totalSpeed = Math.max(0.1, neighborInfluencedOmega + wobble);
        a.theta += totalSpeed * dt;

        // Calculate base orbital position
        a.x = cx + a.r * Math.cos(a.theta);
        a.y = cy + a.r * Math.sin(a.theta);
        
        // Apply organic floaty noise effects
        a.floatOffsetX = Math.sin(time * a.floatSpeedX + a.floatPhaseX) * a.floatAmplitudeX;
        a.floatOffsetY = Math.sin(time * a.floatSpeedY + a.floatPhaseY) * a.floatAmplitudeY;
        a.floatScale = 1; // Keep uniform size
        a.floatRotation = Math.sin(time * a.floatSpeedRotation + a.floatPhaseRotation) * a.floatAmplitudeRotation;
        
        // Add floaty offset to position
        a.x += a.floatOffsetX;
        a.y += a.floatOffsetY;
      }

    } else {
      // Grouped mode: tiny jiggle + floaty effects
      for (const a of actors) {
        a.x += (Math.random() - 0.5) * 0.25;
        a.y += (Math.random() - 0.5) * 0.25;
        
        // Apply floaty effects in grouped mode too
        const time = timeRef.current;
        a.floatOffsetX = Math.sin(time * a.floatSpeedX + a.floatPhaseX) * a.floatAmplitudeX;
        a.floatOffsetY = Math.sin(time * a.floatSpeedY + a.floatPhaseY) * a.floatAmplitudeY;
        a.floatScale = 1; // Keep uniform size
        a.floatRotation = Math.sin(time * a.floatSpeedRotation + a.floatPhaseRotation) * a.floatAmplitudeRotation;
        
        a.x += a.floatOffsetX;
        a.y += a.floatOffsetY;
      }
    }
  };

  // Draw
  const draw = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const { w, h } = sizeRef.current;

    ctx.clearRect(0, 0, w, h);

    // Depth sort
    const actors = [...actorsRef.current].sort((a, b) => a.plane - b.plane);
    for (const a of actors) {
      const size = 20; // Uniform size for all avatars
      const alpha = 1; // Always 100% opacity
      drawAvatar(ctx, a, size, alpha);
    }
  };

  const drawAvatar = (ctx: CanvasRenderingContext2D, a: any, size: number, alpha: number) => {
    // Use consistent size (no more scale variation)
    const r = size / 2;
    const x = a.x - r;
    const y = a.y - r;

    ctx.save();
    ctx.globalAlpha = alpha;
    
    // Apply floaty rotation around avatar center
    if (a.floatRotation !== 0) {
      ctx.translate(a.x, a.y);
      ctx.rotate(a.floatRotation);
      ctx.translate(-a.x, -a.y);
    }

    roundRect(ctx, x, y, size, size, r);
    ctx.clip();

    if (a.img) {
      // cover fit
      const iw = a.img.naturalWidth || a.img.width;
      const ih = a.img.naturalHeight || a.img.height;
      const ir = iw / ih;
      const sr = 1;
      let sx, sy, sw, sh;
      if (ir > sr) {
        sh = ih;
        sw = ih * sr;
        sx = (iw - sw) / 2;
        sy = 0;
      } else {
        sw = iw;
        sh = iw / sr;
        sx = 0;
        sy = (ih - sh) / 2;
      }
      ctx.drawImage(a.img, sx, sy, sw, sh, x, y, size, size);
    } else {
      ctx.fillStyle = getColorFromId(a.id);
      ctx.fillRect(x, y, size, size);
      ctx.fillStyle = "#0b1020";
      ctx.font = `${Math.round(size * 0.48)}px ui-sans-serif, system-ui, -apple-system`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(getInitialsFromName(a.name), x + r, y + r + 0.5);
    }

    ctx.restore();

    // hairline stroke
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    roundRect(ctx, x, y, size, size, r);
    ctx.stroke();
    ctx.restore();
  };

  const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, rr: number) => {
    const r = Math.min(rr, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  // ----- Layout targets -----
  const computeGroupTargets = () => {
    const actors = actorsRef.current as any[];
    const { w, h } = sizeRef.current;

    const padX = 28;
    const padY = 18;
    const colW = 22;

    const leftX = 20 + padX;
    const rightX = w - (20 + padX) - colW * 2;

    const totalRows = 5;
    const stackH = totalRows * (20 + padY) - padY;
    const topY = (h - stackH) / 2;

    const groups = 10;
    const targets: { x: number; y: number }[] = [];

    for (let g = 0; g < groups; g++) {
      const sideLeft = g < groups / 2;
      const row = sideLeft ? g : g - groups / 2;
      const baseX = sideLeft ? leftX : rightX;
      const baseY = topY + row * (20 + padY);
      for (let k = 0; k < 3; k++) targets.push({ x: baseX + k * colW, y: baseY });
    }
    return actors.map((_, i) => targets[i % targets.length]);
  };

  const computeVortexTargets = () => {
    const actors = actorsRef.current as any[];
    const { w, h } = sizeRef.current;
    const cx = w / 2;
    const cy = h / 2;
    const rMax = Math.min(cx, cy) - 12;

    return actors.map(() => {
      const r = 20 + Math.random() * rMax;
      const t = Math.random() * TAU;
      return { x: cx + r * Math.cos(t), y: cy + r * Math.sin(t) };
    });
  };

  // Toggle with tweens
  const toggleMode = () => {
    const goingToGroups = mode === "vortex";
    const targets = goingToGroups ? computeGroupTargets() : computeVortexTargets();
    const actors = actorsRef.current as any[];
    const duration = 900;
    const jitter = 180;
    const now = performance.now();

    tweensRef.current.push(
      ...actors.map((a, i) => {
        const sx = a.x,
          sy = a.y;
        const tx = targets[i].x,
          ty = targets[i].y;
        const delay = (i * 17) % jitter;
        return {
          start: now + delay,
          duration,
          update: (t: number) => {
            if (t < 0) return;
            const tt = clamp(t, 0, 1);
            a.x = lerp(sx, tx, tt);
            a.y = lerp(sy, ty, tt);
          },
        };
      })
    );

    setMode(goingToGroups ? "groups" : "vortex");
  };

  return (
    <div className={`${className} relative rounded-2xl overflow-hidden`}>
      {showControls && (
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-800">
              Mode: <span className="font-semibold">{mode}</span>
            </div>
            {showStats && (
              <div className="flex items-center gap-1 text-xs text-gray-800">
                {statusText && <span>{statusText}</span>}
                <span>{people.length} avatars</span>
              </div>
            )}
          </div>
          <button
            onClick={toggleMode}
            className="px-3 py-1.5 rounded-xl bg-white/80 text-gray-800 text-sm hover:bg-white/90 active:scale-[0.98] transition border border-gray-200"
          >
            {mode === "vortex" ? "Group into 10×3" : "Back to Vortex"}
          </button>
        </div>
      )}
      <canvas ref={canvasRef} className="w-full h-full" />

    </div>
  );
}
