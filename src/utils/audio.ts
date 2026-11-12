/**
 * Procedural Horological Mechanical Audio Engine using Web Audio API
 * Generates realistic Swiss watch escapement ticks and winding sounds with zero external files.
 */

class HorologyAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true; // start muted by default for luxury etiquette

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleMute(): boolean {
    this.initContext();
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.playTick(true);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.initContext();
    this.isMuted = muted;
  }

  /**
   * High-precision mechanical escapement tick (Swiss Lever Escapement)
   */
  public playTick(accent: boolean = false) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      // High frequency metallic impulse
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(accent ? 4400 : 3800, t);
      filter.Q.setValueAtTime(12, t);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(accent ? 2800 : 2400, t);
      osc.frequency.exponentialRampToValueAtTime(800, t + 0.025);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.035);
    } catch {
      // Audio not permitted or interrupted
    }
  }

  /**
   * Luxury Crown winding ratchet sound
   */
  public playWindingClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1400, t);
      osc.frequency.exponentialRampToValueAtTime(320, t + 0.04);

      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.05);
    } catch {
      // Ignore
    }
  }
}

export const horologyAudio = new HorologyAudioEngine();
