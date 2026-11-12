import * as THREE from 'three';
import { Model3DConfig } from '../../types/watch';

export interface Watch3DAssembly {
  rootGroup: THREE.Group;
  parts: {
    crystal: THREE.Mesh;
    bezel: THREE.Mesh | THREE.Group;
    dialMesh: THREE.Mesh;
    caseBody: THREE.Mesh | THREE.Group;
    movement: THREE.Group;
    caseback: THREE.Group;
    straps: THREE.Group;
    hourHand: THREE.Mesh;
    minuteHand: THREE.Mesh;
    secondHand: THREE.Mesh;
    subHands: THREE.Mesh[];
    tourbillon: THREE.Group | null;
    rotor: THREE.Group;
  };
  materials: {
    metal: THREE.MeshStandardMaterial;
    dial: THREE.MeshStandardMaterial;
    crystal: THREE.MeshPhysicalMaterial | THREE.MeshStandardMaterial;
    strap: THREE.MeshStandardMaterial;
    accent: THREE.MeshStandardMaterial;
    goldAccent: THREE.MeshStandardMaterial;
  };
  updateTime: (elapsed: number, delta: number) => void;
  setExplodedRatio: (ratio: number) => void;
  updateMaterials: (config: {
    metalFinish: Model3DConfig['metalFinish'];
    dialColor: string;
    strapType: Model3DConfig['strapType'];
  }) => void;
  dispose: () => void;
}

export function createProceduralWatch(
  config: Model3DConfig,
  isSoftwareGl: boolean
): Watch3DAssembly {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'LuxuryWatchRoot';

  // Disposables registry
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];

  const registerGeometry = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const registerMaterial = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };
  const registerTexture = <T extends THREE.Texture>(t: T): T => {
    textures.push(t);
    return t;
  };

  // Color & Finish definitions
  const getMetalProps = (finish: Model3DConfig['metalFinish']) => {
    switch (finish) {
      case 'yellow-gold':
        return { color: 0xdeb841, metalness: 0.95, roughness: 0.16 };
      case 'rose-gold':
        return { color: 0xdea093, metalness: 0.95, roughness: 0.18 };
      case 'black-dlc':
        return { color: 0x222226, metalness: 0.85, roughness: 0.22 };
      case 'platinum':
        return { color: 0xe8ecf2, metalness: 0.98, roughness: 0.12 };
      case 'steel':
      default:
        return { color: 0xd4d8de, metalness: 0.92, roughness: 0.15 };
    }
  };

  const initialMetal = getMetalProps(config.metalFinish);

  // Core Materials
  const metalMaterial = registerMaterial(
    new THREE.MeshStandardMaterial({
      color: initialMetal.color,
      metalness: initialMetal.metalness,
      roughness: initialMetal.roughness,
      envMapIntensity: 1.4,
    })
  );

  const goldAccentMaterial = registerMaterial(
    new THREE.MeshStandardMaterial({
      color: 0xdfb738,
      metalness: 0.95,
      roughness: 0.15,
      envMapIntensity: 1.5,
    })
  );

  const accentMaterial = registerMaterial(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.accentColor || '#ef4444'),
      roughness: 0.3,
      metalness: 0.2,
    })
  );

  // Procedural Dial Canvas Texture
  const dialCanvas = document.createElement('canvas');
  dialCanvas.width = 1024;
  dialCanvas.height = 1024;
  const dCtx = dialCanvas.getContext('2d')!;

  const renderDialTexture = (colorHex: string) => {
    const cx = 512;
    const cy = 512;
    const r = 480;

    // Background gradient
    const grad = dCtx.createRadialGradient(cx, cy, 20, cx, cy, r);
    grad.addColorStop(0, colorHex);
    grad.addColorStop(0.7, colorHex);
    grad.addColorStop(1, '#020204');
    dCtx.fillStyle = grad;
    dCtx.fillRect(0, 0, 1024, 1024);

    // Sunray guilloche lines
    dCtx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    dCtx.lineWidth = 1;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 180) {
      dCtx.beginPath();
      dCtx.moveTo(cx, cy);
      dCtx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      dCtx.stroke();
    }

    // Outer Chapter Ring / Minute Track
    dCtx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
    dCtx.lineWidth = 2;
    dCtx.beginPath();
    dCtx.arc(cx, cy, r * 0.92, 0, Math.PI * 2);
    dCtx.stroke();

    for (let i = 0; i < 60; i++) {
      const a = (i * Math.PI * 2) / 60 - Math.PI / 2;
      const is5Min = i % 5 === 0;
      const len = is5Min ? 24 : 12;
      const r1 = r * 0.92;
      const r2 = r1 - len;
      dCtx.strokeStyle = is5Min ? '#fef08a' : 'rgba(255, 255, 255, 0.4)';
      dCtx.lineWidth = is5Min ? 3.5 : 1.5;
      dCtx.beginPath();
      dCtx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
      dCtx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
      dCtx.stroke();
    }

    // Subdial Circles if Chronograph
    if (config.hasChronographSubdials) {
      const subdials = [
        { x: cx - 210, y: cy },
        { x: cx + 210, y: cy },
        { x: cx, y: cy + 190 }
      ];
      subdials.forEach(sub => {
        dCtx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        dCtx.beginPath();
        dCtx.arc(sub.x, sub.y, 110, 0, Math.PI * 2);
        dCtx.fill();
        dCtx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
        dCtx.lineWidth = 2;
        dCtx.stroke();

        // Subdial ticks
        for (let j = 0; j < 12; j++) {
          const sa = (j * Math.PI * 2) / 12;
          dCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          dCtx.lineWidth = 1;
          dCtx.beginPath();
          dCtx.moveTo(sub.x + Math.cos(sa) * 105, sub.y + Math.sin(sa) * 105);
          dCtx.lineTo(sub.x + Math.cos(sa) * 94, sub.y + Math.sin(sa) * 94);
          dCtx.stroke();
        }
      });
    }

    // Brand Typography
    dCtx.textAlign = 'center';
    dCtx.fillStyle = '#fef08a';
    dCtx.font = "bold 44px 'Cinzel', Georgia, serif";
    dCtx.fillText('LUXORA', cx, cy - 210);

    dCtx.font = "600 20px 'Plus Jakarta Sans', sans-serif";
    dCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    dCtx.fillText('GENÈVE', cx, cy - 165);

    dCtx.font = "500 16px 'Plus Jakarta Sans', sans-serif";
    dCtx.fillStyle = 'rgba(212, 175, 55, 0.9)';
    dCtx.fillText('SUPERLATIVE CHRONOMETER', cx, cy - 135);
    dCtx.fillText('OFFICIALLY CERTIFIED', cx, cy - 110);

    dCtx.font = "600 16px 'Plus Jakarta Sans', sans-serif";
    dCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    dCtx.fillText('SWISS MADE', cx, cy + 420);
  };

  renderDialTexture(config.dialColor);
  const dialTexture = registerTexture(new THREE.CanvasTexture(dialCanvas));
  dialTexture.colorSpace = THREE.SRGBColorSpace;

  const dialMaterial = registerMaterial(
    new THREE.MeshStandardMaterial({
      map: dialTexture,
      roughness: 0.35,
      metalness: 0.3,
      envMapIntensity: 0.9,
    })
  );

  // Sapphire Crystal Material
  let crystalMaterial: THREE.MeshPhysicalMaterial | THREE.MeshStandardMaterial;
  if (!isSoftwareGl) {
    crystalMaterial = registerMaterial(
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.96,
        opacity: 1,
        transparent: true,
        roughness: 0.05,
        ior: 1.77, // Real Sapphire Crystal IOR
        thickness: 0.25,
        attenuationColor: new THREE.Color(0xa5f3fc),
        attenuationDistance: 2.0,
        depthWrite: false,
      })
    );
  } else {
    crystalMaterial = registerMaterial(
      new THREE.MeshStandardMaterial({
        color: 0xecfeff,
        transparent: true,
        opacity: 0.3,
        roughness: 0.1,
        metalness: 0.1,
        depthWrite: false,
      })
    );
  }

  // Strap Material
  const getStrapColor = (strapType: Model3DConfig['strapType'], finish: Model3DConfig['metalFinish']) => {
    if (strapType === 'metal-bracelet') {
      return getMetalProps(finish).color;
    }
    if (strapType === 'rubber-sport') return 0x18181b;
    return 0x271a15; // rich dark cognac / chocolate leather
  };

  const strapMaterial = registerMaterial(
    new THREE.MeshStandardMaterial({
      color: getStrapColor(config.strapType, config.metalFinish),
      metalness: config.strapType === 'metal-bracelet' ? initialMetal.metalness : 0.1,
      roughness: config.strapType === 'metal-bracelet' ? initialMetal.roughness : (config.strapType === 'rubber-sport' ? 0.7 : 0.45),
      envMapIntensity: 1.2,
    })
  );

  // ==========================================
  // 1. EXPLODED SUB-GROUPS
  // ==========================================
  const crystalGroup = new THREE.Group();
  crystalGroup.name = 'CrystalGroup';

  const bezelGroup = new THREE.Group();
  bezelGroup.name = 'BezelGroup';

  const handsGroup = new THREE.Group();
  handsGroup.name = 'HandsGroup';

  const dialGroup = new THREE.Group();
  dialGroup.name = 'DialGroup';

  const caseGroup = new THREE.Group();
  caseGroup.name = 'CaseGroup';

  const movementGroup = new THREE.Group();
  movementGroup.name = 'MovementGroup';

  const casebackGroup = new THREE.Group();
  casebackGroup.name = 'CasebackGroup';

  const strapsGroup = new THREE.Group();
  strapsGroup.name = 'StrapsGroup';

  rootGroup.add(crystalGroup);
  rootGroup.add(bezelGroup);
  rootGroup.add(handsGroup);
  rootGroup.add(dialGroup);
  rootGroup.add(caseGroup);
  rootGroup.add(movementGroup);
  rootGroup.add(casebackGroup);
  rootGroup.add(strapsGroup);

  // ==========================================
  // 2. WATCH CASE BODY & LUGS
  // ==========================================
  const caseRadius = 2.0;
  const caseThickness = 0.55;

  let caseBodyMesh: THREE.Mesh;
  if (config.caseStyle === 'royal-oak') {
    // Octagonal AP Royal Oak style case
    const caseGeo = registerGeometry(new THREE.CylinderGeometry(caseRadius * 1.05, caseRadius * 1.08, caseThickness, 8));
    caseBodyMesh = new THREE.Mesh(caseGeo, metalMaterial);
  } else if (config.caseStyle === 'tonneau') {
    // Tonneau Richard Mille style curved case
    const shape = new THREE.Shape();
    shape.moveTo(-1.6, -2.1);
    shape.quadraticCurveTo(-2.1, 0, -1.6, 2.1);
    shape.quadraticCurveTo(0, 2.3, 1.6, 2.1);
    shape.quadraticCurveTo(2.1, 0, 1.6, -2.1);
    shape.quadraticCurveTo(0, -2.3, -1.6, -2.1);
    const extrudeSettings = { depth: caseThickness, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
    const tonneauGeo = registerGeometry(new THREE.ExtrudeGeometry(shape, extrudeSettings));
    tonneauGeo.center();
    caseBodyMesh = new THREE.Mesh(tonneauGeo, metalMaterial);
  } else {
    // Classic Round Rolex/Patek case
    const caseGeo = registerGeometry(new THREE.CylinderGeometry(caseRadius * 1.02, caseRadius * 1.05, caseThickness, 64));
    caseBodyMesh = new THREE.Mesh(caseGeo, metalMaterial);
  }
  caseBodyMesh.rotation.x = Math.PI / 2;
  caseBodyMesh.castShadow = !isSoftwareGl;
  caseBodyMesh.receiveShadow = !isSoftwareGl;
  caseGroup.add(caseBodyMesh);

  // 4 Sculpted Lugs extending top and bottom
  const lugShape = new THREE.Shape();
  lugShape.moveTo(-0.25, 0);
  lugShape.lineTo(0.25, 0);
  lugShape.lineTo(0.18, 0.95);
  lugShape.quadraticCurveTo(0, 1.15, -0.18, 0.95);
  lugShape.closePath();
  const lugGeo = registerGeometry(new THREE.ExtrudeGeometry(lugShape, { depth: 0.38, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 2 }));
  lugGeo.center();

  const lugPositions = [
    { x: -1.25, y: 1.85, rotZ: 0.08 },
    { x: 1.25, y: 1.85, rotZ: -0.08 },
    { x: -1.25, y: -1.85, rotZ: Math.PI - 0.08 },
    { x: 1.25, y: -1.85, rotZ: Math.PI + 0.08 }
  ];
  lugPositions.forEach(pos => {
    const lugMesh = new THREE.Mesh(lugGeo, metalMaterial);
    lugMesh.position.set(pos.x, pos.y, 0);
    lugMesh.rotation.z = pos.rotZ;
    lugMesh.castShadow = !isSoftwareGl;
    caseGroup.add(lugMesh);
  });

  // Crown at 3 o'clock with embossed logo dome
  const crownGroup = new THREE.Group();
  crownGroup.position.set(caseRadius * 1.08, 0, 0);
  const crownStemGeo = registerGeometry(new THREE.CylinderGeometry(0.28, 0.28, 0.35, 32));
  const crownStem = new THREE.Mesh(crownStemGeo, metalMaterial);
  crownStem.rotation.z = Math.PI / 2;
  crownGroup.add(crownStem);

  const crownCapGeo = registerGeometry(new THREE.SphereGeometry(0.28, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2));
  const crownCap = new THREE.Mesh(crownCapGeo, goldAccentMaterial);
  crownCap.rotation.z = -Math.PI / 2;
  crownCap.position.x = 0.22;
  crownGroup.add(crownCap);
  caseGroup.add(crownGroup);

  // Chronograph pushers at 2 and 4 o'clock
  if (config.hasChronographSubdials) {
    const pusherGeo = registerGeometry(new THREE.CylinderGeometry(0.18, 0.2, 0.28, 24));
    const pusher1 = new THREE.Mesh(pusherGeo, metalMaterial);
    pusher1.position.set(caseRadius * 0.95, 1.15, 0);
    pusher1.rotation.z = -Math.PI / 4;
    caseGroup.add(pusher1);

    const pusher2 = new THREE.Mesh(pusherGeo, metalMaterial);
    pusher2.position.set(caseRadius * 0.95, -1.15, 0);
    pusher2.rotation.z = -Math.PI * 0.75;
    caseGroup.add(pusher2);
  }

  // ==========================================
  // 3. BEZEL (Fluted, Octagonal Screwed, or Smooth)
  // ==========================================
  let bezelMesh: THREE.Mesh | THREE.Group;
  if (config.caseStyle === 'royal-oak' || config.bezelType === 'screwed-octagonal') {
    const octGroup = new THREE.Group();
    const octGeo = registerGeometry(new THREE.CylinderGeometry(caseRadius * 0.98, caseRadius * 1.02, 0.16, 8));
    const mainOct = new THREE.Mesh(octGeo, metalMaterial);
    mainOct.rotation.x = Math.PI / 2;
    octGroup.add(mainOct);

    // 8 Bezel Screws
    const screwGeo = registerGeometry(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 6));
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI * 2) / 8 - Math.PI / 8;
      const sx = Math.cos(a) * (caseRadius * 0.88);
      const sy = Math.sin(a) * (caseRadius * 0.88);
      const screw = new THREE.Mesh(screwGeo, goldAccentMaterial);
      screw.position.set(sx, sy, 0.1);
      screw.rotation.x = Math.PI / 2;
      octGroup.add(screw);
    }
    bezelMesh = octGroup;
  } else if (config.bezelType === 'fluted') {
    // Fluted Rolex style coin-edge bezel
    const flutedGroup = new THREE.Group();
    const baseBezelGeo = registerGeometry(new THREE.TorusGeometry(caseRadius * 0.94, 0.14, 16, 64));
    const baseRing = new THREE.Mesh(baseBezelGeo, metalMaterial);
    flutedGroup.add(baseRing);

    // Fluted teeth
    const toothGeo = registerGeometry(new THREE.ConeGeometry(0.04, 0.12, 4));
    for (let i = 0; i < 60; i++) {
      const a = (i * Math.PI * 2) / 60;
      const tooth = new THREE.Mesh(toothGeo, goldAccentMaterial);
      tooth.position.set(Math.cos(a) * (caseRadius * 0.94), Math.sin(a) * (caseRadius * 0.94), 0.06);
      tooth.rotation.z = a - Math.PI / 2;
      tooth.rotation.x = Math.PI / 2;
      flutedGroup.add(tooth);
    }
    bezelMesh = flutedGroup;
  } else {
    // Smooth high-polish bezel
    const smoothGeo = registerGeometry(new THREE.TorusGeometry(caseRadius * 0.94, 0.12, 24, 64));
    bezelMesh = new THREE.Mesh(smoothGeo, metalMaterial);
  }
  bezelMesh.position.z = caseThickness / 2 + 0.08;
  bezelGroup.add(bezelMesh);

  // ==========================================
  // 4. DIAL PLATE & HOUR INDICES
  // ==========================================
  const dialRadius = caseRadius * 0.86;
  const dialGeo = registerGeometry(new THREE.CylinderGeometry(dialRadius, dialRadius, 0.05, 64));
  const dialMesh = new THREE.Mesh(dialGeo, dialMaterial);
  dialMesh.rotation.x = Math.PI / 2;
  dialMesh.position.z = caseThickness / 2 + 0.02;
  dialGroup.add(dialMesh);

  // 12 3D Hour Markers on Dial
  const indexGeo = registerGeometry(new THREE.BoxGeometry(0.08, 0.28, 0.05));
  const lumeMaterial = registerMaterial(
    new THREE.MeshStandardMaterial({
      color: 0x86efac,
      roughness: 0.2,
      emissive: 0x86efac,
      emissiveIntensity: 0.35,
    })
  );

  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI * 2) / 12 - Math.PI / 2;
    const isMajor = i % 3 === 0;
    const rIdx = dialRadius * 0.82;
    const marker = new THREE.Mesh(indexGeo, isMajor ? goldAccentMaterial : metalMaterial);
    marker.position.set(Math.cos(a) * rIdx, Math.sin(a) * rIdx, caseThickness / 2 + 0.06);
    marker.rotation.z = a + Math.PI / 2;
    dialGroup.add(marker);

    // Inner luminous strip
    const lumeGeo = registerGeometry(new THREE.BoxGeometry(0.035, 0.18, 0.06));
    const lumeMesh = new THREE.Mesh(lumeGeo, lumeMaterial);
    lumeMesh.position.set(Math.cos(a) * rIdx, Math.sin(a) * rIdx, caseThickness / 2 + 0.075);
    lumeMesh.rotation.z = a + Math.PI / 2;
    dialGroup.add(lumeMesh);
  }

  // ==========================================
  // 5. TOURBILLON CAGE & RUBY ESCAPEMENT
  // ==========================================
  let tourbillonGroup: THREE.Group | null = null;
  if (config.hasTourbillon) {
    tourbillonGroup = new THREE.Group();
    tourbillonGroup.position.set(0, -dialRadius * 0.45, caseThickness / 2 + 0.04);

    // Aperture bevel
    const tourRingGeo = registerGeometry(new THREE.TorusGeometry(0.48, 0.04, 16, 32));
    const tourRing = new THREE.Mesh(tourRingGeo, goldAccentMaterial);
    tourbillonGroup.add(tourRing);

    // Gold balance wheel with 3 spokes
    const balanceGeo = registerGeometry(new THREE.TorusGeometry(0.38, 0.03, 12, 32));
    const balanceWheel = new THREE.Mesh(balanceGeo, goldAccentMaterial);
    tourbillonGroup.add(balanceWheel);

    for (let s = 0; s < 3; s++) {
      const sa = (s * Math.PI * 2) / 3;
      const spokeGeo = registerGeometry(new THREE.CylinderGeometry(0.015, 0.015, 0.38, 8));
      const spoke = new THREE.Mesh(spokeGeo, goldAccentMaterial);
      spoke.position.set(Math.cos(sa) * 0.19, Math.sin(sa) * 0.19, 0);
      spoke.rotation.z = sa + Math.PI / 2;
      tourbillonGroup.add(spoke);
    }

    // Synthetic Ruby Jewel
    const rubyMaterial = registerMaterial(
      new THREE.MeshStandardMaterial({
        color: 0xdc2626,
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.9,
      })
    );
    const rubyGeo = registerGeometry(new THREE.SphereGeometry(0.07, 12, 12));
    const ruby = new THREE.Mesh(rubyGeo, rubyMaterial);
    tourbillonGroup.add(ruby);

    dialGroup.add(tourbillonGroup);
  }

  // ==========================================
  // 6. MOVING 3D HANDS (Hour, Minute, Sweeping Second)
  // ==========================================
  const handBaseZ = caseThickness / 2 + 0.09;

  // Hour Hand (Faceted dauphine)
  const hourHandShape = new THREE.Shape();
  hourHandShape.moveTo(-0.06, -0.15);
  hourHandShape.lineTo(0.06, -0.15);
  hourHandShape.lineTo(0.04, 0.85);
  hourHandShape.lineTo(0, 1.05);
  hourHandShape.lineTo(-0.04, 0.85);
  hourHandShape.closePath();
  const hourHandGeo = registerGeometry(new THREE.ExtrudeGeometry(hourHandShape, { depth: 0.03, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015 }));
  hourHandGeo.center();
  const hourHand = new THREE.Mesh(hourHandGeo, goldAccentMaterial);
  hourHand.position.set(0, 0.45, handBaseZ);
  handsGroup.add(hourHand);

  // Minute Hand (Longer, slender)
  const minuteHandShape = new THREE.Shape();
  minuteHandShape.moveTo(-0.045, -0.2);
  minuteHandShape.lineTo(0.045, -0.2);
  minuteHandShape.lineTo(0.03, 1.25);
  minuteHandShape.lineTo(0, 1.48);
  minuteHandShape.lineTo(-0.03, 1.25);
  minuteHandShape.closePath();
  const minHandGeo = registerGeometry(new THREE.ExtrudeGeometry(minuteHandShape, { depth: 0.025, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01 }));
  minHandGeo.center();
  const minuteHand = new THREE.Mesh(minHandGeo, metalMaterial);
  minuteHand.position.set(0, 0.65, handBaseZ + 0.035);
  handsGroup.add(minuteHand);

  // Second Needle Hand (Vivid sweeping needle with teardrop counterpoise)
  const secHandShape = new THREE.Shape();
  secHandShape.moveTo(-0.018, -0.38);
  secHandShape.lineTo(0.018, -0.38);
  secHandShape.lineTo(0.012, 1.55);
  secHandShape.lineTo(0, 1.68);
  secHandShape.lineTo(-0.012, 1.55);
  secHandShape.closePath();
  const secHandGeo = registerGeometry(new THREE.ExtrudeGeometry(secHandShape, { depth: 0.02, bevelEnabled: false }));
  secHandGeo.center();
  const secondHand = new THREE.Mesh(secHandGeo, accentMaterial);
  secondHand.position.set(0, 0.65, handBaseZ + 0.07);
  handsGroup.add(secondHand);

  // Center Pinion Cap
  const capGeo = registerGeometry(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 24));
  const cap = new THREE.Mesh(capGeo, goldAccentMaterial);
  cap.rotation.x = Math.PI / 2;
  cap.position.set(0, 0, handBaseZ + 0.08);
  handsGroup.add(cap);

  // Tiny subdial hands if chronograph
  const subHands: THREE.Mesh[] = [];
  if (config.hasChronographSubdials) {
    const subPositions = [
      { x: -dialRadius * 0.42, y: 0 },
      { x: dialRadius * 0.42, y: 0 },
      { x: 0, y: dialRadius * 0.38 }
    ];
    subPositions.forEach(sp => {
      const subHandGeo = registerGeometry(new THREE.BoxGeometry(0.025, 0.28, 0.02));
      const sHand = new THREE.Mesh(subHandGeo, accentMaterial);
      sHand.position.set(sp.x, sp.y + 0.08, handBaseZ);
      handsGroup.add(sHand);
      subHands.push(sHand);
    });
  }

  // ==========================================
  // 7. SAPPHIRE CRYSTAL DOME
  // ==========================================
  const crystalGeo = registerGeometry(new THREE.CylinderGeometry(dialRadius * 1.01, dialRadius * 1.01, 0.08, 64));
  const crystalMesh = new THREE.Mesh(crystalGeo, crystalMaterial);
  crystalMesh.rotation.x = Math.PI / 2;
  crystalMesh.position.z = caseThickness / 2 + 0.22;
  crystalGroup.add(crystalMesh);

  // ==========================================
  // 8. EXHIBITION CASEBACK & 22K ROTOR
  // ==========================================
  const backRimGeo = registerGeometry(new THREE.CylinderGeometry(caseRadius * 0.98, caseRadius * 0.98, 0.08, 48));
  const backRim = new THREE.Mesh(backRimGeo, metalMaterial);
  backRim.rotation.x = Math.PI / 2;
  backRim.position.z = -caseThickness / 2 - 0.04;
  casebackGroup.add(backRim);

  const backGlassGeo = registerGeometry(new THREE.CircleGeometry(caseRadius * 0.75, 48));
  const backGlass = new THREE.Mesh(backGlassGeo, crystalMaterial);
  backGlass.position.z = -caseThickness / 2 - 0.085;
  casebackGroup.add(backGlass);

  // 22K Oscillating Rotor
  const rotorGroup = new THREE.Group();
  rotorGroup.position.set(0, 0, -caseThickness / 2 - 0.06);

  const rotorShape = new THREE.Shape();
  rotorShape.moveTo(0, 0);
  rotorShape.arc(0, 0, caseRadius * 0.68, 0, Math.PI, false);
  rotorShape.closePath();
  const rotorGeo = registerGeometry(new THREE.ExtrudeGeometry(rotorShape, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01 }));
  rotorGeo.center();
  const rotorMesh = new THREE.Mesh(rotorGeo, goldAccentMaterial);
  rotorGroup.add(rotorMesh);
  movementGroup.add(rotorGroup);

  // ==========================================
  // 9. STRAP / BRACELET ASSEMBLY
  // ==========================================
  const buildStraps = (type: Model3DConfig['strapType']) => {
    // Clear existing strap meshes
    while (strapsGroup.children.length > 0) {
      strapsGroup.remove(strapsGroup.children[0]);
    }

    const strapWidth = 1.45;
    const numLinks = 9;

    if (type === 'metal-bracelet') {
      // Articulated luxury 3-link Oyster style bracelet
      const createLink = (w: number, l: number, d: number) => {
        const linkGeo = registerGeometry(new THREE.BoxGeometry(w, l, d));
        return new THREE.Mesh(linkGeo, strapMaterial);
      };

      // Top strap curve
      for (let i = 0; i < numLinks; i++) {
        const t = i / (numLinks - 1);
        const y = 1.9 + i * 0.38;
        const z = -Math.sin(t * Math.PI * 0.65) * 1.6;
        const rotX = t * 1.15;

        // Center link
        const centerLink = createLink(strapWidth * 0.45, 0.35, 0.16);
        centerLink.position.set(0, y, z);
        centerLink.rotation.x = rotX;
        centerLink.castShadow = !isSoftwareGl;
        strapsGroup.add(centerLink);

        // Side links
        const leftLink = createLink(strapWidth * 0.26, 0.35, 0.14);
        leftLink.position.set(-strapWidth * 0.36, y, z);
        leftLink.rotation.x = rotX;
        strapsGroup.add(leftLink);

        const rightLink = createLink(strapWidth * 0.26, 0.35, 0.14);
        rightLink.position.set(strapWidth * 0.36, y, z);
        rightLink.rotation.x = rotX;
        strapsGroup.add(rightLink);
      }

      // Bottom strap curve
      for (let i = 0; i < numLinks; i++) {
        const t = i / (numLinks - 1);
        const y = -(1.9 + i * 0.38);
        const z = -Math.sin(t * Math.PI * 0.65) * 1.6;
        const rotX = -t * 1.15;

        const centerLink = createLink(strapWidth * 0.45, 0.35, 0.16);
        centerLink.position.set(0, y, z);
        centerLink.rotation.x = rotX;
        strapsGroup.add(centerLink);

        const leftLink = createLink(strapWidth * 0.26, 0.35, 0.14);
        leftLink.position.set(-strapWidth * 0.36, y, z);
        leftLink.rotation.x = rotX;
        strapsGroup.add(leftLink);

        const rightLink = createLink(strapWidth * 0.26, 0.35, 0.14);
        rightLink.position.set(strapWidth * 0.36, y, z);
        rightLink.rotation.x = rotX;
        strapsGroup.add(rightLink);
      }
    } else {
      // Leather or Rubber Curved Strap
      const curvePointsTop: THREE.Vector3[] = [];
      const curvePointsBot: THREE.Vector3[] = [];
      for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        curvePointsTop.push(new THREE.Vector3(0, 1.8 + t * 3.4, -Math.sin(t * Math.PI * 0.6) * 1.8));
        curvePointsBot.push(new THREE.Vector3(0, -(1.8 + t * 3.4), -Math.sin(t * Math.PI * 0.6) * 1.8));
      }
      const topCurve = new THREE.CatmullRomCurve3(curvePointsTop);
      const botCurve = new THREE.CatmullRomCurve3(curvePointsBot);

      // Strap rectangular cross-section
      const sShape = new THREE.Shape();
      sShape.moveTo(-strapWidth / 2, -0.09);
      sShape.lineTo(strapWidth / 2, -0.09);
      sShape.lineTo(strapWidth / 2, 0.09);
      sShape.lineTo(-strapWidth / 2, 0.09);
      sShape.closePath();

      const topGeo = registerGeometry(new THREE.ExtrudeGeometry(sShape, { steps: 24, extrudePath: topCurve }));
      const topMesh = new THREE.Mesh(topGeo, strapMaterial);
      strapsGroup.add(topMesh);

      const botGeo = registerGeometry(new THREE.ExtrudeGeometry(sShape, { steps: 24, extrudePath: botCurve }));
      const botMesh = new THREE.Mesh(botGeo, strapMaterial);
      strapsGroup.add(botMesh);

      // Deployment clasp / buckle at bottom
      const claspGeo = registerGeometry(new THREE.BoxGeometry(strapWidth * 1.05, 0.3, 0.22));
      const claspMesh = new THREE.Mesh(claspGeo, metalMaterial);
      claspMesh.position.set(0, -4.8, -1.6);
      strapsGroup.add(claspMesh);
    }
  };

  buildStraps(config.strapType);

  // Soft Contact Shadow Plane underneath the watch
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 256;
  shadowCanvas.height = 256;
  const sCtx = shadowCanvas.getContext('2d')!;
  const sGrad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
  sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
  sGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
  sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  sCtx.fillStyle = sGrad;
  sCtx.fillRect(0, 0, 256, 256);

  const shadowTexture = registerTexture(new THREE.CanvasTexture(shadowCanvas));
  const shadowPlaneGeo = registerGeometry(new THREE.PlaneGeometry(8, 8));
  const shadowPlaneMat = registerMaterial(
    new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
      opacity: 0.85,
    })
  );
  const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
  shadowPlane.position.z = -2.4;
  rootGroup.add(shadowPlane);

  // Time & Animation loop variables
  let currentExploded = 0;

  return {
    rootGroup,
    parts: {
      crystal: crystalMesh,
      bezel: bezelMesh,
      dialMesh,
      caseBody: caseBodyMesh,
      movement: movementGroup,
      caseback: casebackGroup,
      straps: strapsGroup,
      hourHand,
      minuteHand,
      secondHand,
      subHands,
      tourbillon: tourbillonGroup,
      rotor: rotorGroup,
    },
    materials: {
      metal: metalMaterial,
      dial: dialMaterial,
      crystal: crystalMaterial,
      strap: strapMaterial,
      accent: accentMaterial,
      goldAccent: goldAccentMaterial,
    },
    updateTime: (elapsed: number, delta: number) => {
      // Realistic smooth clock hands motion
      // 10:10:35 base + elapsed
      const now = new Date();
      const seconds = now.getSeconds() + now.getMilliseconds() / 1000 + elapsed;
      const minutes = now.getMinutes() + seconds / 60;
      const hours = (now.getHours() % 12) + minutes / 60;

      // Rotate hands around Z-axis (watch face is in XY plane)
      secondHand.rotation.z = -((seconds % 60) * Math.PI * 2) / 60;
      minuteHand.rotation.z = -((minutes % 60) * Math.PI * 2) / 60;
      hourHand.rotation.z = -((hours % 12) * Math.PI * 2) / 12;

      // Subdial hands rotate at different speeds
      if (subHands.length >= 3) {
        subHands[0].rotation.z = -(seconds * Math.PI * 2) / 10;
        subHands[1].rotation.z = -(minutes * Math.PI * 2) / 30;
        subHands[2].rotation.z = -(hours * Math.PI * 2) / 12;
      }

      // Tourbillon escapement oscillation
      if (tourbillonGroup) {
        tourbillonGroup.rotation.z = Math.sin(elapsed * 18) * 0.45;
      }

      // 22K Gold Rotor gentle inertia sway
      rotorGroup.rotation.z = Math.sin(elapsed * 1.5) * 0.9;
    },
    setExplodedRatio: (targetRatio: number) => {
      currentExploded = targetRatio;
      const r = currentExploded;

      // Smoothly offset components along normal explosion vectors
      crystalGroup.position.z = r * 3.2;
      bezelGroup.position.z = r * 2.2;
      handsGroup.position.z = r * 1.35;
      dialGroup.position.z = r * 0.65;
      caseGroup.position.z = 0;
      movementGroup.position.z = -r * 1.1;
      casebackGroup.position.z = -r * 2.5;

      // Straps split outward gently
      strapsGroup.position.y = r * 0.8;
      strapsGroup.position.z = -r * 1.5;
    },
    updateMaterials: (newConfig) => {
      // Update metal
      const mp = getMetalProps(newConfig.metalFinish);
      metalMaterial.color.setHex(mp.color);
      metalMaterial.metalness = mp.metalness;
      metalMaterial.roughness = mp.roughness;

      // Update dial
      renderDialTexture(newConfig.dialColor);
      dialTexture.needsUpdate = true;

      // Update strap
      if (newConfig.strapType === 'metal-bracelet') {
        strapMaterial.color.setHex(mp.color);
        strapMaterial.metalness = mp.metalness;
        strapMaterial.roughness = mp.roughness;
      } else if (newConfig.strapType === 'rubber-sport') {
        strapMaterial.color.setHex(0x18181b);
        strapMaterial.metalness = 0.05;
        strapMaterial.roughness = 0.7;
      } else {
        strapMaterial.color.setHex(0x271a15);
        strapMaterial.metalness = 0.1;
        strapMaterial.roughness = 0.45;
      }
    },
    dispose: () => {
      geometries.forEach(g => g.dispose());
      materials.forEach(m => m.dispose());
      textures.forEach(t => t.dispose());
    }
  };
}
