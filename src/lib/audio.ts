class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMusicPlaying = false;
  private currentTrack: 'travel' | 'boss' | null = null;
  private schedulerTimer: ReturnType<typeof setTimeout> | null = null;
  private melodyStep = 0;
  private bassStep = 0;
  private nextNoteTime = 0;
  private bassTime = 0;
  private melodyGain: GainNode | null = null;
  private bassGain: GainNode | null = null;
  private droneGain: GainNode | null = null;

  private readonly TRAVEL_MELODY = [
    293.66,329.63,349.23,392.00,440.00,493.88,523.25,587.33,
    392.00,349.23,329.63,293.66,261.63,293.66,349.23,392.00,
    440.00,392.00,349.23,392.00,440.00,493.88,440.00,392.00,
    349.23,329.63,293.66,261.63,293.66,329.63,349.23,293.66,
  ];
  private readonly TRAVEL_MELODY_DUR = [
    0.25,0.25,0.25,0.5,0.25,0.25,0.25,0.5,
    0.25,0.25,0.5,0.25,0.25,0.25,0.25,0.5,
    0.25,0.25,0.25,0.25,0.25,0.5,0.25,0.25,
    0.25,0.25,0.5,0.25,0.25,0.25,0.5,0.75,
  ];
  private readonly TRAVEL_BASS = [
    146.83,0,174.61,0,146.83,0,196.00,0,
    130.81,0,146.83,0,174.61,0,146.83,0,
  ];
  private readonly TRAVEL_BASS_DUR = [
    0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,
    0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,
  ];
  private readonly BOSS_MELODY = [
    164.81,174.61,196.00,220.00,233.08,261.63,293.66,329.63,
    293.66,261.63,233.08,220.00,196.00,174.61,164.81,155.56,
    164.81,196.00,233.08,261.63,233.08,196.00,174.61,164.81,
    155.56,164.81,174.61,196.00,174.61,164.81,155.56,146.83,
  ];
  private readonly BOSS_MELODY_DUR = [
    0.2,0.2,0.2,0.4,0.2,0.2,0.2,0.4,
    0.2,0.2,0.4,0.2,0.2,0.2,0.4,0.4,
    0.2,0.2,0.2,0.4,0.2,0.2,0.2,0.4,
    0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.6,
  ];
  private readonly BOSS_BASS = [
    82.41,0,87.31,0,82.41,0,73.42,0,
    77.78,0,82.41,0,87.31,0,82.41,0,
  ];
  private readonly BOSS_BASS_DUR = [
    0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,
    0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,
  ];

  private getCtx(): AudioContext {
    if (!this.ctx) this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    return this.ctx;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number, delay = 0) {
    try {
      const ctx = this.getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      gain.gain.setValueAtTime(volume, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration);
    } catch(e) {}
  }

  private scheduleNote(freq: number, duration: number, startTime: number, gainNode: GainNode, type: OscillatorType = 'triangle', vol = 0.18) {
    if (!this.ctx || freq === 0) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(vol * 0.4, startTime + 0.06);
      gain.gain.exponentialRampToValueAtTime(vol * 0.15, startTime + duration * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.connect(gain); gain.connect(gainNode);
      osc.start(startTime); osc.stop(startTime + duration + 0.05);
    } catch(e) {}
  }

  private scheduleBass(freq: number, duration: number, startTime: number, gainNode: GainNode) {
    if (!this.ctx || freq === 0) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.22, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.08, startTime + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.connect(gain); gain.connect(gainNode);
      osc.start(startTime); osc.stop(startTime + duration + 0.05);
    } catch(e) {}
  }

  private scheduler() {
    if (!this.ctx || !this.isMusicPlaying) return;
    const isBoss = this.currentTrack === 'boss';
    const melody = isBoss ? this.BOSS_MELODY : this.TRAVEL_MELODY;
    const melodyDur = isBoss ? this.BOSS_MELODY_DUR : this.TRAVEL_MELODY_DUR;
    const bass = isBoss ? this.BOSS_BASS : this.TRAVEL_BASS;
    const bassDur = isBoss ? this.BOSS_BASS_DUR : this.TRAVEL_BASS_DUR;
    const lookAhead = 0.2;

    while (this.nextNoteTime < this.ctx.currentTime + lookAhead) {
      if (this.melodyGain) {
        const freq = melody[this.melodyStep % melody.length];
        const dur = melodyDur[this.melodyStep % melodyDur.length];
        this.scheduleNote(freq, dur, this.nextNoteTime, this.melodyGain, isBoss ? 'sawtooth' : 'triangle', isBoss ? 0.12 : 0.15);
        this.scheduleNote(freq * (isBoss ? 1.189 : 1.498), dur, this.nextNoteTime, this.melodyGain, isBoss ? 'sawtooth' : 'triangle', isBoss ? 0.05 : 0.07);
        this.nextNoteTime += dur;
        this.melodyStep = (this.melodyStep + 1) % melody.length;
      }
    }

    while (this.bassTime < this.ctx.currentTime + lookAhead) {
      if (this.bassGain) {
        const bi = this.bassStep % bass.length;
        const freq = bass[bi]; const dur = bassDur[bi];
        if (freq > 0) this.scheduleBass(freq, dur, this.bassTime, this.bassGain);
        this.bassTime += dur;
        this.bassStep = (this.bassStep + 1) % bass.length;
      }
    }
    this.schedulerTimer = setTimeout(() => this.scheduler(), 100);
  }

  startMusic(isBoss: boolean = false) {
    const track = isBoss ? 'boss' : 'travel';
    if (this.isMusicPlaying && this.currentTrack === track) return;
    this.stopMusic();
    try {
      const ctx = this.getCtx();
      if (ctx.state === 'suspended') ctx.resume();
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, ctx.currentTime);
      this.masterGain.connect(ctx.destination);
      this.melodyGain = ctx.createGain();
      this.melodyGain.gain.setValueAtTime(1, ctx.currentTime);
      this.melodyGain.connect(this.masterGain);
      this.bassGain = ctx.createGain();
      this.bassGain.gain.setValueAtTime(0.9, ctx.currentTime);
      this.bassGain.connect(this.masterGain);
      this.droneGain = ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.03, ctx.currentTime);
      this.droneGain.connect(this.masterGain);
      const droneOsc = ctx.createOscillator();
      droneOsc.type = 'sawtooth';
      droneOsc.frequency.setValueAtTime(isBoss ? 82.41 : 146.83, ctx.currentTime);
      droneOsc.connect(this.droneGain);
      droneOsc.start(ctx.currentTime);
      (this.droneGain as any)._droneOsc = droneOsc;
      this.isMusicPlaying = true;
      this.currentTrack = track;
      this.melodyStep = 0; this.bassStep = 0;
      this.nextNoteTime = ctx.currentTime + 0.05;
      this.bassTime = ctx.currentTime + 0.05;
      this.scheduler();
    } catch(e) {}
  }

  stopMusic() {
    if (this.schedulerTimer) { clearTimeout(this.schedulerTimer); this.schedulerTimer = null; }
    try {
      if (this.droneGain) { const d = (this.droneGain as any)._droneOsc; if (d) { try { d.stop(); } catch(e) {} } }
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
        this.masterGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      }
    } catch(e) {}
    this.masterGain = null; this.melodyGain = null; this.bassGain = null; this.droneGain = null;
    this.isMusicPlaying = false; this.currentTrack = null;
  }

  updateMusic(isBoss: boolean) {
    const track = isBoss ? 'boss' : 'travel';
    if (this.currentTrack !== track) this.startMusic(isBoss);
  }

  playClick() { this.playTone(600, 'sine', 0.05, 0.05); }
  playArrow() { this.playTone(900, 'sawtooth', 0.04, 0.07); this.playTone(500, 'sawtooth', 0.08, 0.05, 0.04); }
  playSword() { this.playTone(280, 'sawtooth', 0.12, 0.18); this.playTone(180, 'square', 0.18, 0.1, 0.08); this.playTone(350, 'sine', 0.06, 0.12, 0.02); }
  playHit() { this.playTone(140, 'square', 0.1, 0.2); this.playTone(90, 'sawtooth', 0.14, 0.14, 0.04); }
  playCoin() { this.playTone(1046, 'sine', 0.08, 0.12); this.playTone(1318, 'sine', 0.08, 0.1, 0.08); this.playTone(1567, 'sine', 0.1, 0.08, 0.16); }
  playUpgrade() { [392,523,659,784,1047].forEach((f,i) => this.playTone(f, 'triangle', 0.18, 0.15, i * 0.1)); }
  playShopOpen() { [523,659,784,659,784,1047].forEach((f,i) => this.playTone(f, 'triangle', 0.15, 0.12, i * 0.1)); }
  playBossWarning() { this.playTone(87, 'sawtooth', 0.6, 0.28); this.playTone(65, 'sawtooth', 0.6, 0.18, 0.1); this.playTone(110, 'square', 0.4, 0.12, 0.3); }
  playCarriageBreak() { for(let i=0;i<8;i++) this.playTone(220-i*20,'sawtooth',0.15,0.2,i*0.06); this.playTone(80,'square',0.4,0.3,0.1); }
}

export const audioService = new AudioService();
