"use client";

// Sound utility for download completion and other interactions
export class SoundManager {
  private static instance: SoundManager;
  private audioContext: AudioContext | null = null;
  private isEnabled = true;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initializeAudioContext();
    }
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Audio context not supported:', error);
    }
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  public isSoundEnabled(): boolean {
    return this.isEnabled;
  }

  // Play a cute success sound for download completion
  public playDownloadSuccess() {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Create a pleasant ascending melody
      const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
      const duration = 0.15;

      frequencies.forEach((freq, index) => {
        const osc = this.audioContext!.createOscillator();
        const gain = this.audioContext!.createGain();

        osc.connect(gain);
        gain.connect(this.audioContext!.destination);

        osc.frequency.setValueAtTime(freq, this.audioContext!.currentTime);
        osc.type = 'sine';

        gain.gain.setValueAtTime(0, this.audioContext!.currentTime);
        gain.gain.linearRampToValueAtTime(0.1, this.audioContext!.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext!.currentTime + duration);

        osc.start(this.audioContext!.currentTime + index * duration);
        osc.stop(this.audioContext!.currentTime + (index + 1) * duration);
      });
    } catch (error) {
      console.warn('Error playing success sound:', error);
    }
  }

  // Play a subtle click sound for button interactions
  public playClick() {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.1);
    } catch (error) {
      console.warn('Error playing click sound:', error);
    }
  }

  // Play a gentle notification sound
  public playNotification() {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
      oscillator.frequency.setValueAtTime(554.37, this.audioContext.currentTime + 0.1);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.08, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn('Error playing notification sound:', error);
    }
  }
}

// Export singleton instance
export const soundManager = SoundManager.getInstance();

// Hook for using sounds in React components
export function useSounds() {
  const playDownloadSuccess = () => soundManager.playDownloadSuccess();
  const playClick = () => soundManager.playClick();
  const playNotification = () => soundManager.playNotification();
  const setSoundEnabled = (enabled: boolean) => soundManager.setEnabled(enabled);
  const isSoundEnabled = () => soundManager.isSoundEnabled();

  return {
    playDownloadSuccess,
    playClick,
    playNotification,
    setSoundEnabled,
    isSoundEnabled
  };
}
