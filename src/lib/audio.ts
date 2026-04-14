class AudioService {
  private ctx: AudioContext | null = null;
  private musicInterval: any = null;
  private musicBeat = 0;
  private isBossMusic = false;

  private getCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.ctx;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number, fade: boolean = true) {
    const ctx = this.getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    if (fade) {
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  playArrow() {
    const ctx = this.getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  playSword() {
    const ctx = this.getCtx();
    // Metallic ring
    this.playTone(1200, 'sine', 0.1, 0.05);
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }

  playHit() {
    const ctx = this.getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  playCoin() {
    // 3-note chime
    this.playTone(900, 'sine', 0.1, 0.1);
    setTimeout(() => this.playTone(1100, 'sine', 0.1, 0.1), 50);
    setTimeout(() => this.playTone(1400, 'sine', 0.2, 0.1), 100);
  }

  playUpgrade() {
    this.playTone(400, 'sine', 0.1, 0.1);
    setTimeout(() => this.playTone(600, 'sine', 0.1, 0.1), 100);
    setTimeout(() => this.playTone(800, 'sine', 0.3, 0.1), 200);
  }

  playShopOpen() {
    this.playTone(300, 'triangle', 0.2, 0.1);
    setTimeout(() => this.playTone(400, 'triangle', 0.2, 0.1), 150);
    setTimeout(() => this.playTone(500, 'triangle', 0.4, 0.1), 300);
  }

  playWarHorn() {
    const ctx = this.getCtx();
    const duration = 1.5;
    [110, 111, 109].forEach((f, i) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + duration);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration + 0.5);
      }, i * 20);
    });
  }

  playCarriageBreak() {
    const ctx = this.getCtx();
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(100 + Math.random() * 200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }, i * 50);
    }
  }

  startMusic(isBoss: boolean = false) {
    if (this.musicInterval) return;
    this.isBossMusic = isBoss;
    this.musicBeat = 0;
    
    const ctx = this.getCtx();
    
    // Medieval Scale: D Dorian (D, E, F, G, A, B, C)
    const travelNotes = [146.83, 164.81, 174.61, 196.00, 220.00, 246.94, 261.63]; // D3-C4
    // Boss Scale: E Phrygian (E, F, G, A, B, C, D)
    const bossNotes = [164.81, 174.61, 196.00, 220.00, 246.94, 261.63, 293.66]; // E3-D4

    this.musicInterval = setInterval(() => {
      const time = ctx.currentTime;
      const notes = this.isBossMusic ? bossNotes : travelNotes;
      
      // Walking Bass / Hurdy-Gurdy Drone
      if (this.musicBeat % 4 === 0) {
        this.playTone(notes[0] / 2, 'sawtooth', 0.8, 0.03, true); // Drone/Root
      }
      
      // Lute-pluck Melody
      if (this.musicBeat % 2 === 0 || Math.random() > 0.7) {
        const noteIdx = [0, 2, 4, 0, 3, 5, 0, 1][this.musicBeat % 8];
        const freq = notes[noteIdx] * (Math.random() > 0.9 ? 2 : 1);
        this.playTone(freq, 'triangle', 0.2, 0.04, true);
      }

      // Boss Tension
      if (this.isBossMusic && this.musicBeat % 4 === 2) {
        this.playTone(notes[1], 'square', 0.4, 0.02, true);
      }

      this.musicBeat = (this.musicBeat + 1) % 16;
    }, 200); // 150 BPM
  }

  stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  updateMusic(isBoss: boolean) {
    if (this.isBossMusic !== isBoss) {
      this.stopMusic();
      this.startMusic(isBoss);
    }
  }

  playFanfare() {
    const ctx = this.getCtx();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((f, i) => {
      setTimeout(() => {
        this.playTone(f, 'sawtooth', 0.4, 0.1, true);
        this.playTone(f * 1.01, 'square', 0.4, 0.05, true);
      }, i * 150);
    });
    setTimeout(() => {
      this.playTone(notes[3], 'sawtooth', 1.0, 0.1, true);
      this.playTone(notes[3] * 1.01, 'square', 1.0, 0.05, true);
    }, 600);
  }

  playCelebration() {
    const ctx = this.getCtx();
    const notes = [392.00, 440.00, 493.88, 523.25, 587.33]; // G4, A4, B4, C5, D5
    notes.forEach((f, i) => {
      setTimeout(() => {
        this.playTone(f, 'triangle', 0.2, 0.1, true);
      }, i * 100);
    });
  }

  playOminous() {
    const ctx = this.getCtx();
    const notes = [110.00, 116.54, 110.00, 103.83]; // A2, Bb2, A2, Ab2
    notes.forEach((f, i) => {
      setTimeout(() => {
        this.playTone(f, 'square', 0.6, 0.15, true);
      }, i * 500);
    });
  }

  playSad() {
    const ctx = this.getCtx();
    const notes = [196.00, 185.00, 174.61, 146.83]; // G3, Gb3, F3, D3
    notes.forEach((f, i) => {
      setTimeout(() => {
        this.playTone(f, 'sine', 0.8, 0.1, true);
      }, i * 600);
    });
  }

  private menuInterval: any = null;
  startMenuMusic() {
    if (this.menuInterval) return;
    const ctx = this.getCtx();
    const notes = [293.66, 329.63, 349.23, 392.00, 440.00]; // D4, E4, F4, G4, A4
    let beat = 0;
    this.menuInterval = setInterval(() => {
      if (beat % 2 === 0) {
        const f = notes[Math.floor(Math.random() * notes.length)];
        // Flute-like sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        // Vibrato
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 5;
        lfoGain.gain.value = 5;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();
        
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
      beat++;
    }, 200);
  }

  stopMenuMusic() {
    if (this.menuInterval) {
      clearInterval(this.menuInterval);
      this.menuInterval = null;
    }
  }

  playClick() {
    this.playTone(600, 'sine', 0.05, 0.05);
  }
}

export const audioService = new AudioService();
