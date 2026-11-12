import { Model3DConfig } from '../types/watch';

/**
 * Procedural Luxury Watch Visual Generator
 * Generates ultra-crisp luxury studio photographs of watches onto 2D canvas/data URLs
 * with realistic metallic bezels, reflections, dials, hands, and straps.
 */

export function generateWatchImage(
  name: string,
  modelConfig: Model3DConfig,
  angle: 'front' | 'angled' | 'detail' = 'front',
  width: number = 800,
  height: number = 800
): string {
  if (typeof document === 'undefined') return '';

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const cx = width / 2;
  const cy = height / 2;
  const r = width * 0.28;

  // Background - Dark luxury studio with subtle radial glow
  const bgGrad = ctx.createRadialGradient(cx, cy * 0.9, 50, cx, cy, width * 0.7);
  bgGrad.addColorStop(0, '#1a1924');
  bgGrad.addColorStop(0.5, '#0c0c11');
  bgGrad.addColorStop(1, '#050507');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Soft studio floor reflection
  const shadowGrad = ctx.createRadialGradient(cx, cy + r * 1.35, 10, cx, cy + r * 1.35, r * 1.4);
  shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
  shadowGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0.4)');
  shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = shadowGrad;
  ctx.beginPath();
  ctx.ellipse(cx, cy + r * 1.35, r * 1.2, r * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();

  // Draw Straps
  const strapWidth = r * 0.85;
  const isLeather = modelConfig.strapType === 'leather-stitch';
  const isRubber = modelConfig.strapType === 'rubber-sport';
  const isGold = modelConfig.metalFinish === 'yellow-gold' || modelConfig.metalFinish === 'rose-gold';

  let strapColor1 = '#1c1b22';
  let strapColor2 = '#0d0d12';
  if (modelConfig.strapType === 'metal-bracelet') {
    if (modelConfig.metalFinish === 'yellow-gold') {
      strapColor1 = '#e5c158';
      strapColor2 = '#997c23';
    } else if (modelConfig.metalFinish === 'rose-gold') {
      strapColor1 = '#e8a598';
      strapColor2 = '#a05c50';
    } else if (modelConfig.metalFinish === 'steel') {
      strapColor1 = '#d1d5db';
      strapColor2 = '#64748b';
    } else {
      strapColor1 = '#27272a';
      strapColor2 = '#09090b';
    }
  } else if (isLeather) {
    strapColor1 = '#261b17';
    strapColor2 = '#130d0b';
  } else if (isRubber) {
    strapColor1 = '#18181b';
    strapColor2 = '#09090b';
  }

  // Draw top strap
  const topGrad = ctx.createLinearGradient(cx - strapWidth / 2, 0, cx + strapWidth / 2, 0);
  topGrad.addColorStop(0, strapColor2);
  topGrad.addColorStop(0.5, strapColor1);
  topGrad.addColorStop(1, strapColor2);
  ctx.fillStyle = topGrad;
  ctx.beginPath();
  ctx.roundRect(cx - strapWidth / 2, 40, strapWidth, cy - 40, [16, 16, 0, 0]);
  ctx.fill();

  // Draw bottom strap
  const botGrad = ctx.createLinearGradient(cx - strapWidth / 2, 0, cx + strapWidth / 2, 0);
  botGrad.addColorStop(0, strapColor2);
  botGrad.addColorStop(0.5, strapColor1);
  botGrad.addColorStop(1, strapColor2);
  ctx.fillStyle = botGrad;
  ctx.beginPath();
  ctx.roundRect(cx - strapWidth / 2, cy, strapWidth, height - cy - 40, [0, 0, 16, 16]);
  ctx.fill();

  // If leather, draw luxury stitching
  if (isLeather) {
    ctx.strokeStyle = '#d4af37';
    ctx.setLineDash([8, 8]);
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx - strapWidth / 2 + 12, 60);
    ctx.lineTo(cx - strapWidth / 2 + 12, cy - 80);
    ctx.moveTo(cx + strapWidth / 2 - 12, 60);
    ctx.lineTo(cx + strapWidth / 2 - 12, cy - 80);
    ctx.moveTo(cx - strapWidth / 2 + 12, cy + 80);
    ctx.lineTo(cx - strapWidth / 2 + 12, height - 60);
    ctx.moveTo(cx + strapWidth / 2 - 12, cy + 80);
    ctx.lineTo(cx + strapWidth / 2 - 12, height - 60);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Metal bracelet segments
  if (modelConfig.strapType === 'metal-bracelet') {
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.lineWidth = 2;
    for (let y = 60; y < cy - 60; y += 32) {
      ctx.beginPath();
      ctx.moveTo(cx - strapWidth / 2, y);
      ctx.lineTo(cx + strapWidth / 2, y);
      ctx.stroke();
    }
    for (let y = cy + 90; y < height - 60; y += 32) {
      ctx.beginPath();
      ctx.moveTo(cx - strapWidth / 2, y);
      ctx.lineTo(cx + strapWidth / 2, y);
      ctx.stroke();
    }
  }

  // Case Bezel & Body
  let metalHighlight = '#ffffff';
  let metalMid = '#d1d5db';
  let metalDark = '#475569';

  if (modelConfig.metalFinish === 'yellow-gold') {
    metalHighlight = '#fff5cf';
    metalMid = '#e5c158';
    metalDark = '#856417';
  } else if (modelConfig.metalFinish === 'rose-gold') {
    metalHighlight = '#ffe0db';
    metalMid = '#e8a598';
    metalDark = '#8a4b41';
  } else if (modelConfig.metalFinish === 'black-dlc') {
    metalHighlight = '#52525b';
    metalMid = '#27272a';
    metalDark = '#09090b';
  }

  // Crown at 3 o'clock
  ctx.fillStyle = metalMid;
  ctx.beginPath();
  ctx.roundRect(cx + r * 1.05, cy - 24, 28, 48, [4, 8, 8, 4]);
  ctx.fill();
  ctx.fillStyle = metalDark;
  for (let c = cy - 18; c <= cy + 18; c += 8) {
    ctx.fillRect(cx + r * 1.07, c, 22, 2.5);
  }

  // Chrono pushers if chronograph
  if (modelConfig.hasChronographSubdials) {
    ctx.fillStyle = metalMid;
    ctx.beginPath();
    ctx.roundRect(cx + r * 0.95, cy - r * 0.65, 22, 34, [4, 6, 6, 4]);
    ctx.roundRect(cx + r * 0.95, cy + r * 0.45, 22, 34, [4, 6, 6, 4]);
    ctx.fill();
  }

  // Case Outer Ring
  const caseGrad = ctx.createLinearGradient(cx - r * 1.1, cy - r * 1.1, cx + r * 1.1, cy + r * 1.1);
  caseGrad.addColorStop(0, metalHighlight);
  caseGrad.addColorStop(0.3, metalMid);
  caseGrad.addColorStop(0.5, metalDark);
  caseGrad.addColorStop(0.7, metalMid);
  caseGrad.addColorStop(1, metalHighlight);

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowBlur = 35;
  ctx.shadowOffsetY = 15;

  if (modelConfig.caseStyle === 'royal-oak') {
    // Octagonal Bezel
    ctx.fillStyle = caseGrad;
    ctx.beginPath();
    const sides = 8;
    const outerR = r * 1.15;
    for (let i = 0; i < sides; i++) {
      const a = (i * Math.PI * 2) / sides - Math.PI / 8;
      const px = cx + Math.cos(a) * outerR;
      const py = cy + Math.sin(a) * outerR;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();

    // 8 Bezel Screws
    for (let i = 0; i < sides; i++) {
      const a = (i * Math.PI * 2) / sides - Math.PI / 8;
      const sx = cx + Math.cos(a) * (outerR * 0.88);
      const sy = cy + Math.sin(a) * (outerR * 0.88);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(sx, sy, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(sx - 5, sy);
      ctx.lineTo(sx + 5, sy);
      ctx.stroke();
    }
  } else {
    // Classic Round or Fluted
    ctx.fillStyle = caseGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.12, 0, Math.PI * 2);
    ctx.fill();

    if (modelConfig.bezelType === 'fluted') {
      // Fluted coin bezel teeth
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 40) {
        ctx.strokeStyle = a % (Math.PI / 20) < 0.05 ? metalHighlight : metalDark;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * r * 1.02, cy + Math.sin(a) * r * 1.02);
        ctx.lineTo(cx + Math.cos(a) * r * 1.12, cy + Math.sin(a) * r * 1.12);
        ctx.stroke();
      }
    }
  }
  ctx.restore();

  // Inner Bezel (Tachymeter / Chapter Ring)
  const innerBezelGrad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  innerBezelGrad.addColorStop(0, '#1c1c24');
  innerBezelGrad.addColorStop(1, '#09090d');
  ctx.fillStyle = innerBezelGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.98, 0, Math.PI * 2);
  ctx.fill();

  // Dial Face
  const dialColor = modelConfig.dialColor || '#0a0a0f';
  const dialGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, r * 0.92);
  dialGrad.addColorStop(0, dialColor);
  dialGrad.addColorStop(0.85, dialColor);
  dialGrad.addColorStop(1, '#000000');
  ctx.fillStyle = dialGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.92, 0, Math.PI * 2);
  ctx.fill();

  // Dial Pattern (Guilloche / Sunray)
  if (modelConfig.dialPattern === 'sunray') {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 72) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * (r * 0.9), cy + Math.sin(a) * (r * 0.9));
      ctx.stroke();
    }
  } else if (modelConfig.dialPattern === 'skeleton') {
    // Open heart skeleton gears & rubies
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx - r * 0.25, cy + r * 0.15, r * 0.28, 0, Math.PI * 2);
    ctx.stroke();

    // Ruby Jewel
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(cx - r * 0.25, cy + r * 0.15, 7, 0, Math.PI * 2);
    ctx.fill();

    // Balance wheel spokes
    for (let a = 0; a < Math.PI * 2; a += (Math.PI * 2) / 3) {
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.25, cy + r * 0.15);
      ctx.lineTo(cx - r * 0.25 + Math.cos(a) * (r * 0.26), cy + r * 0.15 + Math.sin(a) * (r * 0.26));
      ctx.stroke();
    }
  }

  // Subdials for Chronograph
  if (modelConfig.hasChronographSubdials) {
    const subdialPositions = [
      { x: cx - r * 0.42, y: cy },
      { x: cx + r * 0.42, y: cy },
      { x: cx, y: cy + r * 0.42 }
    ];
    subdialPositions.forEach((pos) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, r * 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Tiny hand
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineTo(pos.x + 12, pos.y - 18);
      ctx.stroke();
    });
  }

  // Tourbillon Cage at 6 o'clock
  if (modelConfig.hasTourbillon) {
    const tx = cx;
    const ty = cy + r * 0.42;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(tx, ty, r * 0.26, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Tourbillon Bridge
    ctx.fillStyle = metalMid;
    ctx.fillRect(tx - r * 0.24, ty - 4, r * 0.48, 8);

    // Ruby Pivot
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(tx, ty, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Hour Indices (Faceted Markers with SuperLuminova)
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6 - Math.PI / 2;
    const isMajor = i % 3 === 0;
    const d1 = r * 0.72;
    const d2 = r * 0.86;

    const x1 = cx + Math.cos(a) * d1;
    const y1 = cy + Math.sin(a) * d1;
    const x2 = cx + Math.cos(a) * d2;
    const y2 = cy + Math.sin(a) * d2;

    ctx.strokeStyle = isGold ? '#f7e5a0' : '#f1f5f9';
    ctx.lineWidth = isMajor ? 5 : 3.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Luminous inner line
    ctx.strokeStyle = '#86efac';
    ctx.lineWidth = isMajor ? 2.5 : 1.5;
    ctx.beginPath();
    ctx.moveTo(x1 + Math.cos(a) * 3, y1 + Math.sin(a) * 3);
    ctx.lineTo(x2 - Math.cos(a) * 3, y2 - Math.sin(a) * 3);
    ctx.stroke();
  }

  // Brand Name & Emblem
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fef08a';
  ctx.font = `600 ${Math.round(r * 0.085)}px 'Cinzel', Georgia, serif`;
  ctx.fillText('LUXORA', cx, cy - r * 0.42);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = `500 ${Math.round(r * 0.045)}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillText('GENÈVE', cx, cy - r * 0.32);
  ctx.fillText('CHRONOMETER', cx, cy - r * 0.24);

  // Swiss Made at bottom
  ctx.font = `400 ${Math.round(r * 0.038)}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fillText('SWISS MADE', cx, cy + r * 0.82);

  // Watch Hands (10:10 classic aesthetic time)
  // Hour hand pointing at ~10
  const hourAngle = (10.15 * Math.PI) / 6 - Math.PI / 2;
  const hourLen = r * 0.5;
  ctx.strokeStyle = metalHighlight;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - Math.cos(hourAngle) * 15, cy - Math.sin(hourAngle) * 15);
  ctx.lineTo(cx + Math.cos(hourAngle) * hourLen, cy + Math.sin(hourAngle) * hourLen);
  ctx.stroke();

  // Minute hand pointing at ~2 (10 past)
  const minAngle = (2.12 * Math.PI) / 6 - Math.PI / 2;
  const minLen = r * 0.72;
  ctx.strokeStyle = metalHighlight;
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(cx - Math.cos(minAngle) * 18, cy - Math.sin(minAngle) * 18);
  ctx.lineTo(cx + Math.cos(minAngle) * minLen, cy + Math.sin(minAngle) * minLen);
  ctx.stroke();

  // Second needle hand (Sweeping red or gold needle)
  const secAngle = (7.5 * Math.PI) / 6 - Math.PI / 2;
  const secLen = r * 0.78;
  ctx.strokeStyle = modelConfig.accentColor || '#ef4444';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(cx - Math.cos(secAngle) * 26, cy - Math.sin(secAngle) * 26);
  ctx.lineTo(cx + Math.cos(secAngle) * secLen, cy + Math.sin(secAngle) * secLen);
  ctx.stroke();

  // Center Pinion Cap
  ctx.fillStyle = metalMid;
  ctx.beginPath();
  ctx.arc(cx, cy, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Sapphire Crystal Specular Glare (Luxury Arc)
  const glareGrad = ctx.createLinearGradient(cx - r, cy - r, cx + r * 0.8, cy + r * 0.8);
  glareGrad.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
  glareGrad.addColorStop(0.25, 'rgba(255, 255, 255, 0.08)');
  glareGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0)');
  glareGrad.addColorStop(0.8, 'rgba(255, 255, 255, 0.03)');
  glareGrad.addColorStop(1, 'rgba(255, 255, 255, 0.12)');
  ctx.fillStyle = glareGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.94, 0, Math.PI * 2);
  ctx.fill();

  return canvas.toDataURL('image/png');
}
