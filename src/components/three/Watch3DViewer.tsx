import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Model3DConfig } from '../../types/watch';
import { createProceduralWatch, Watch3DAssembly } from './proceduralWatch';
import { horologyAudio } from '../../utils/audio';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Layers,
  Eye,
  Camera,
  Maximize2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Compass
} from 'lucide-react';

interface Watch3DViewerProps {
  initialConfig: Model3DConfig;
  watchName?: string;
  brandName?: string;
  autoRotateDefault?: boolean;
  className?: string;
  onExplodeChange?: (ratio: number) => void;
  showAllControls?: boolean;
}

// Pre-allocated math helpers outside render loop to prevent garbage collection
const _targetCamPos = new THREE.Vector3(0, 0, 7.5);
const _targetLookAt = new THREE.Vector3(0, 0, 0);

export const Watch3DViewer: React.FC<Watch3DViewerProps> = ({
  initialConfig,
  watchName = 'LUXORA Masterpiece',
  brandName = 'GENÈVE',
  autoRotateDefault = true,
  className = 'w-full h-full min-h-[500px]',
  showAllControls = true,
  onExplodeChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const assemblyRef = useRef<Watch3DAssembly | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // UI Interactive States
  const [explodedRatio, setExplodedRatio] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(autoRotateDefault);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const [activePreset, setActivePreset] = useState<'front' | 'angled' | 'crown' | 'caseback' | 'macro'>('angled');
  const [isControlsCollapsed, setIsControlsCollapsed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'view' | 'materials' | 'explode'>('view');

  // Customizer state
  const [currentFinish, setCurrentFinish] = useState<Model3DConfig['metalFinish']>(initialConfig.metalFinish);
  const [currentDialColor, setCurrentDialColor] = useState<string>(initialConfig.dialColor);
  const [currentStrapType, setCurrentStrapType] = useState<Model3DConfig['strapType']>(initialConfig.strapType);

  // Sync state refs for animation loop
  const targetExplodeRef = useRef<number>(0);
  const isTransitioningCamRef = useRef<boolean>(false);

  useEffect(() => {
    targetExplodeRef.current = explodedRatio;
  }, [explodedRatio]);

  useEffect(() => {
    // Detect software WebGL safely
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    const container = containerRef.current;
    if (!container) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Scene
    const scene = new THREE.Scene();

    // Studio Reflection Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      38,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(2.8, 1.8, 6.5);
    cameraRef.current = camera;

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.autoRotate = autoRotateDefault;
    controls.autoRotateSpeed = 1.2;
    controls.minDistance = 2.8;
    controls.maxDistance = 14;
    controls.maxPolarAngle = Math.PI * 0.95;
    controls.minPolarAngle = 0.05;
    controlsRef.current = controls;

    // Interrupt scripted camera transitions if user interacts with controls
    controls.addEventListener('start', () => {
      isTransitioningCamRef.current = false;
    });

    // 3-Point Luxury Studio Lighting Rig
    // 1. Key Warm Light
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 3.2);
    keyLight.position.set(5, 7, 6);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.shadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    // 2. Cool Fill Light
    const fillLight = new THREE.HemisphereLight(0xe0f2fe, 0x1e1b4b, 1.4);
    scene.add(fillLight);

    // 3. Rim / Specular Backlight for edge bevel highlights
    const rimLight = new THREE.DirectionalLight(0xd4af37, 2.5);
    rimLight.position.set(-6, -4, -5);
    scene.add(rimLight);

    // Additional glint highlight
    const glintLight = new THREE.PointLight(0xffffff, 1.8, 15);
    glintLight.position.set(0, 4, 3);
    scene.add(glintLight);

    // Build the procedural 3D watch
    const assembly = createProceduralWatch(
      {
        ...initialConfig,
        metalFinish: currentFinish,
        dialColor: currentDialColor,
        strapType: currentStrapType,
      },
      isSoftwareGl
    );
    scene.add(assembly.rootGroup);
    assemblyRef.current = assembly;

    // Animation & Tick Loop
    const clock = new THREE.Clock();
    let frameId = 0;
    let currentExpVal = 0;
    let lastAudioTick = 0;

    const tick = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Update watch internal mechanics (hands, tourbillon, rotor)
      assembly.updateTime(elapsed, delta);

      // Procedural audio tick every second if unmuted
      if (Math.floor(elapsed) !== lastAudioTick) {
        lastAudioTick = Math.floor(elapsed);
        horologyAudio.playTick(lastAudioTick % 2 === 0);
      }

      // Smooth exploded view damping
      currentExpVal = THREE.MathUtils.damp(currentExpVal, targetExplodeRef.current, 6, delta);
      assembly.setExplodedRatio(currentExpVal);

      // Camera preset smooth transition
      if (isTransitioningCamRef.current) {
        camera.position.x = THREE.MathUtils.damp(camera.position.x, _targetCamPos.x, 5, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, _targetCamPos.y, 5, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, _targetCamPos.z, 5, delta);
        controls.target.x = THREE.MathUtils.damp(controls.target.x, _targetLookAt.x, 5, delta);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, _targetLookAt.y, 5, delta);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, _targetLookAt.z, 5, delta);

        if (camera.position.distanceTo(_targetCamPos) < 0.05) {
          isTransitioningCamRef.current = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      assembly.dispose();
      renderer.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Sync autoRotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Sync material changes to assembly
  useEffect(() => {
    if (assemblyRef.current) {
      assemblyRef.current.updateMaterials({
        metalFinish: currentFinish,
        dialColor: currentDialColor,
        strapType: currentStrapType,
      });
    }
  }, [currentFinish, currentDialColor, currentStrapType]);

  // Camera Presets
  const applyCameraPreset = (preset: 'front' | 'angled' | 'crown' | 'caseback' | 'macro') => {
    setActivePreset(preset);
    isTransitioningCamRef.current = true;
    _targetLookAt.set(0, 0, 0);

    switch (preset) {
      case 'front':
        _targetCamPos.set(0, 0, 6.2);
        break;
      case 'angled':
        _targetCamPos.set(2.8, 2.0, 6.2);
        break;
      case 'crown':
        _targetCamPos.set(6.4, 0.4, 0.8);
        break;
      case 'caseback':
        _targetCamPos.set(0, 0, -6.4);
        break;
      case 'macro':
        _targetCamPos.set(0.6, 0.6, 3.4);
        break;
    }
  };

  const toggleSound = () => {
    const isNowMuted = horologyAudio.toggleMute();
    setIsAudioMuted(isNowMuted);
  };

  const handleCaptureSnapshot = () => {
    const canvas = containerRef.current?.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${watchName.replace(/\s+/g, '_')}_3D_LUXORA.png`;
    a.click();
  };

  return (
    <div className={`relative overflow-hidden select-none bg-radial from-[#13121d] via-[#09090e] to-[#040406] ${className}`}>
      {/* 3D WebGL Canvas Mount (Isolated outside overlays) */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left: Minimal Spec Badge */}
      <div className="absolute top-5 left-5 z-10 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
          <span className="text-[11px] tracking-[0.25em] text-[#d4af37] font-semibold uppercase">
            3D Haute Horlogerie
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-luxury font-bold text-neutral-100 tracking-wider mt-0.5">
          {watchName}
        </h2>
        <p className="text-xs text-neutral-400 font-sans tracking-widest uppercase">
          {brandName} • 360° Real-Time Interactive
        </p>
      </div>

      {/* Top Right Quick Actions: Sound, Auto-rotate, Snapshot */}
      <div className="absolute top-5 right-5 z-10 flex items-center gap-2">
        <button
          onClick={toggleSound}
          title={isAudioMuted ? 'Unmute Mechanical Ticking' : 'Mute Ticking'}
          className={`p-2.5 rounded-full border transition-all backdrop-blur-md ${
            !isAudioMuted
              ? 'bg-[#d4af37]/20 border-[#d4af37] text-amber-300 shadow-[0_0_15px_rgba(212,175,55,0.3)]'
              : 'bg-black/50 border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
          }`}
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={() => setAutoRotate(!autoRotate)}
          title="Toggle Auto Rotation"
          className={`p-2.5 rounded-full border transition-all backdrop-blur-md ${
            autoRotate
              ? 'bg-[#d4af37]/20 border-[#d4af37] text-amber-300'
              : 'bg-black/50 border-white/10 text-neutral-400 hover:text-white'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={handleCaptureSnapshot}
          title="Capture Studio 4K Snapshot"
          className="p-2.5 rounded-full bg-black/50 border border-white/10 text-neutral-400 hover:text-amber-300 hover:border-[#d4af37]/50 transition-all backdrop-blur-md"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>

      {/* Unified Ergonomic Bottom Control Dock (Collapsible Zero Viewport Occlusion) */}
      {showAllControls && (
        <div
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-[820px] transition-transform duration-300 ${
            isControlsCollapsed ? 'translate-y-[calc(100%-38px)]' : 'translate-y-0'
          }`}
        >
          {/* Collapse / Expand Tab */}
          <div className="flex justify-center -mb-px">
            <button
              onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
              className="px-4 py-1 rounded-t-lg bg-black/80 border-t border-x border-[#d4af37]/30 text-[11px] uppercase tracking-widest text-amber-300/80 hover:text-amber-200 flex items-center gap-1.5 backdrop-blur-md shadow-lg"
            >
              {isControlsCollapsed ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" /> Show Showroom Controls
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" /> Cinema Mode
                </>
              )}
            </button>
          </div>

          {/* Main Glassmorphic Dock Container */}
          <div className="bg-[#0b0b10]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-3 md:p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
            {/* Dock Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-3">
              <div className="flex items-center gap-1.5 md:gap-2">
                <button
                  onClick={() => setActiveTab('view')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium tracking-wider uppercase transition-colors flex items-center gap-1.5 ${
                    activeTab === 'view'
                      ? 'bg-[#d4af37]/20 text-amber-300 border border-[#d4af37]/40'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" /> Camera Views
                </button>

                <button
                  onClick={() => setActiveTab('explode')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium tracking-wider uppercase transition-colors flex items-center gap-1.5 ${
                    activeTab === 'explode'
                      ? 'bg-[#d4af37]/20 text-amber-300 border border-[#d4af37]/40'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" /> Exploded Anatomy
                </button>

                <button
                  onClick={() => setActiveTab('materials')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium tracking-wider uppercase transition-colors flex items-center gap-1.5 ${
                    activeTab === 'materials'
                      ? 'bg-[#d4af37]/20 text-amber-300 border border-[#d4af37]/40'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" /> Customizer
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-[11px] text-neutral-400">
                <Compass className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Drag to rotate • Pinch / Scroll to zoom</span>
              </div>
            </div>

            {/* TAB CONTENT: Camera Views */}
            {activeTab === 'view' && (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { id: 'angled', label: '3/4 Dynamic' },
                    { id: 'front', label: 'Dial Frontal' },
                    { id: 'crown', label: 'Crown Profile' },
                    { id: 'caseback', label: 'Exhibition Rotor' },
                    { id: 'macro', label: 'Macro Escapement' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => applyCameraPreset(p.id as typeof activePreset)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all ${
                        activePreset === p.id
                          ? 'bg-[#d4af37] text-neutral-950 font-semibold shadow-[0_0_15px_rgba(212,175,55,0.35)]'
                          : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => applyCameraPreset('angled')}
                  className="px-2.5 py-1.5 text-xs text-neutral-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>
            )}

            {/* TAB CONTENT: Exploded Anatomy Slider */}
            {activeTab === 'explode' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-300 font-medium flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#d4af37]" />
                    Exploded Mechanical Disassembly
                  </span>
                  <span className="text-amber-300 font-mono font-semibold">
                    {Math.round(explodedRatio * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-neutral-500 uppercase tracking-wider">Assembled</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={explodedRatio}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setExplodedRatio(val);
                      if (onExplodeChange) onExplodeChange(val);
                    }}
                    className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
                  />
                  <span className="text-[11px] text-neutral-500 uppercase tracking-wider">Exploded</span>
                </div>
                <div className="flex justify-between text-[10px] text-neutral-500 pt-1">
                  <span>Sapphire Crystal</span>
                  <span>Bezel & Screws</span>
                  <span>Hands & Dial</span>
                  <span>Escapement</span>
                  <span>Caseback & 22K Rotor</span>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Materials Customizer */}
            {activeTab === 'materials' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Finish Picker */}
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-neutral-400 mb-1.5">
                    Precious Metal Finish
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[
                      { id: 'yellow-gold', label: '18K Yellow Gold', color: '#deb841' },
                      { id: 'rose-gold', label: '18K Rose Gold', color: '#dea093' },
                      { id: 'steel', label: '904L Oystersteel', color: '#d4d8de' },
                      { id: 'black-dlc', label: 'DLC Stealth Black', color: '#27272a' },
                      { id: 'platinum', label: 'Platinum 950', color: '#e8ecf2' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setCurrentFinish(f.id as typeof currentFinish)}
                        title={f.label}
                        className={`w-6 h-6 rounded-full border transition-all ${
                          currentFinish === f.id
                            ? 'border-amber-400 scale-110 shadow-[0_0_10px_rgba(212,175,55,0.5)]'
                            : 'border-white/20 hover:scale-105'
                        }`}
                        style={{ backgroundColor: f.color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Dial Color Picker */}
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-neutral-400 mb-1.5">
                    Sunray Dial Tint
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[
                      { name: 'Emerald', hex: '#064e3b' },
                      { name: 'Royal Navy', hex: '#0c1a3a' },
                      { name: 'Onyx Noir', hex: '#0a0a0f' },
                      { name: 'Champagne', hex: '#8f7422' },
                      { name: 'Ice Blue', hex: '#1e293b' },
                      { name: 'Burgundy', hex: '#4c0519' },
                    ].map((d) => (
                      <button
                        key={d.name}
                        onClick={() => setCurrentDialColor(d.hex)}
                        title={d.name}
                        className={`w-6 h-6 rounded-full border transition-all ${
                          currentDialColor === d.hex
                            ? 'border-amber-400 scale-110 shadow-[0_0_10px_rgba(212,175,55,0.5)]'
                            : 'border-white/20 hover:scale-105'
                        }`}
                        style={{ backgroundColor: d.hex }}
                      />
                    ))}
                  </div>
                </div>

                {/* Strap Type */}
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-neutral-400 mb-1.5">
                    Strap Architecture
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[
                      { id: 'metal-bracelet', label: 'Bracelet' },
                      { id: 'leather-stitch', label: 'Alligator' },
                      { id: 'rubber-sport', label: 'Sport FKM' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setCurrentStrapType(s.id as typeof currentStrapType)}
                        className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                          currentStrapType === s.id
                            ? 'bg-[#d4af37]/30 text-amber-300 border border-[#d4af37]/60'
                            : 'bg-white/5 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
