// Music manager for background music playback

class MusicManager {
    constructor() {
        this.music = null;
        this.initialized = false;
        this.enabled = true;
        this.volume = 0.3;
    }

    init(scene) {
        if (this.initialized) return;

        try {
            this.music = scene.sound.add('bgMusic', { // Ensure scene loader uses 'bgmusic.mp3'
                loop: true,
                volume: this.volume
            });

            this.initialized = true;

            // Try to play immediately
            this.play();
        } catch (e) {
            console.log('Music init error:', e);
        }
    }

    play() {
        if (!this.initialized || !this.music) return;

        if (this.enabled && !this.music.isPlaying) {
            try {
                this.music.play();
            } catch (e) {
                console.log('Music play error:', e);
            }
        }
    }

    pause() {
        if (this.music && this.music.isPlaying) {
            this.music.pause();
        }
    }

    resume() {
        if (this.music && this.enabled) {
            this.music.resume();
        }
    }

    stop() {
        if (this.music) {
            this.music.stop();
        }
    }

    setVolume(volume) {
        this.volume = volume;
        if (this.music) {
            this.music.setVolume(volume);
        }
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        if (enabled) {
            this.play();
        } else {
            this.pause();
        }
    }

    toggle() {
        this.setEnabled(!this.enabled);
        return this.enabled;
    }

    isPlaying() {
        return this.music && this.music.isPlaying;
    }
}

// Singleton instance
const musicManager = new MusicManager();

export default musicManager;
