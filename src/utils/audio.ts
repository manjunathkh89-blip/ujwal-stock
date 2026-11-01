/**
 * Procedural Cyber-Dragon Roar Sound Synthesizer
 * Uses the Web Audio API to synthesize a guttural, cinematic dragon roar
 * with low-end rumble, resonant throat hiss, and harmonic distortion.
 * Completely self-contained with ZERO external file dependencies (no 404s).
 */

class DragonAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

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

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public playRoar() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const duration = 2.4;

      // Master output node with limiter/compressor
      const compressor = this.ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-18, now);
      compressor.knee.setValueAtTime(12, now);
      compressor.ratio.setValueAtTime(8, now);
      compressor.attack.setValueAtTime(0.003, now);
      compressor.release.setValueAtTime(0.25, now);
      compressor.connect(this.ctx.destination);

      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.7, now);
      masterGain.connect(compressor);

      // --- 1. Sub-Bass Chest Rumble (Low Sine) ---
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sawtooth';
      subOsc.frequency.setValueAtTime(75, now);
      subOsc.frequency.exponentialRampToValueAtTime(140, now + 0.35); // roar buildup
      subOsc.frequency.exponentialRampToValueAtTime(38, now + duration); // sub dive

      // Low pass to isolate rumble
      const subFilter = this.ctx.createBiquadFilter();
      subFilter.type = 'lowpass';
      subFilter.frequency.setValueAtTime(180, now);

      subGain.gain.setValueAtTime(0.001, now);
      subGain.gain.linearRampToValueAtTime(0.9, now + 0.25);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      subOsc.connect(subFilter);
      subFilter.connect(subGain);
      subGain.connect(masterGain);
      subOsc.start(now);
      subOsc.stop(now + duration);

      // --- 2. Guttural Growl (FM Modulated Sawtooth with Distortion) ---
      const growlOsc = this.ctx.createOscillator();
      const growlGain = this.ctx.createGain();
      growlOsc.type = 'sawtooth';
      growlOsc.frequency.setValueAtTime(110, now);
      growlOsc.frequency.linearRampToValueAtTime(220, now + 0.3);
      growlOsc.frequency.exponentialRampToValueAtTime(55, now + duration);

      // Tremolo/vibrato LFO for draconic flutter
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(18, now); // 18Hz guttural flutter
      lfoGain.gain.setValueAtTime(35, now);
      lfo.connect(growlOsc.frequency);
      lfo.start(now);
      lfo.stop(now + duration);

      // Waveshaper for tube-like cyber distortion
      const distortion = this.ctx.createWaveShaper();
      const nSamples = 256;
      const curve = new Float32Array(nSamples);
      for (let i = 0; i < nSamples; i++) {
        const x = (i * 2) / nSamples - 1;
        curve[i] = (Math.PI + 3) * x / (Math.PI + 3 * Math.abs(x));
      }
      distortion.curve = curve;
      distortion.oversample = '2x';

      growlGain.gain.setValueAtTime(0.001, now);
      growlGain.gain.linearRampToValueAtTime(0.8, now + 0.28);
      growlGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      growlOsc.connect(distortion);
      distortion.connect(growlGain);
      growlGain.connect(masterGain);
      growlOsc.start(now);
      growlOsc.stop(now + duration);

      // --- 3. Breath / Jet Hiss Noise ---
      const bufferSize = this.ctx.sampleRate * duration;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.Q.setValueAtTime(3.5, now);
      noiseFilter.frequency.setValueAtTime(350, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(1800, now + 0.35); // hiss peak
      noiseFilter.frequency.exponentialRampToValueAtTime(400, now + duration);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.65, now + 0.3);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);
      noise.start(now);
      noise.stop(now + duration);

    } catch (e) {
      console.warn('Audio synthesis fallback / blocked:', e);
    }
  }

  public playWhoosh() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.4);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // ignore
    }
  }
}

export const dragonAudio = new DragonAudioEngine();
