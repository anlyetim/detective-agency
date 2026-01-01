import Phaser from 'phaser';
import musicManager from '../../systems/musicManager.js';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Create noir background with gradient
        const graphics = this.add.graphics();

        // Dark crimson gradient background
        graphics.fillGradientStyle(0x1a0a0f, 0x1a0a0f, 0x2a0a14, 0x2a0a14, 1);
        graphics.fillRect(0, 0, width, height);

        // Add subtle vignette effect
        this.createVignette(width, height);

        // Add atmospheric particles (subtle dust/fog)
        this.createAtmosphere();

        // Initialize music manager
        musicManager.init(this);

        // Enable music on first user interaction
        this.input.once('pointerdown', () => {
            musicManager.play();
        });

        // Handle resize
        this.scale.on('resize', this.resize, this);

        // Create subtle animated glow for noir effect
        this.createNoirGlow();
    }

    createVignette(width, height) {
        const vignette = this.add.graphics();

        // Create radial gradient vignette
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.max(width, height) * 0.7;

        for (let i = 0; i < 20; i++) {
            const alpha = i / 20 * 0.4;
            const currentRadius = radius + (i * 30);
            vignette.lineStyle(30, 0x000000, alpha);
            vignette.strokeCircle(centerX, centerY, currentRadius);
        }
    }

    createAtmosphere() {
        // Create subtle floating particles for atmosphere
        const particleCount = 30;

        for (let i = 0; i < particleCount; i++) {
            const x = Phaser.Math.Between(0, this.cameras.main.width);
            const y = Phaser.Math.Between(0, this.cameras.main.height);

            const particle = this.add.graphics();
            particle.fillStyle(0xffffff, 0.05);
            particle.fillCircle(0, 0, 2);
            particle.setPosition(x, y);

            // Animate particle floating
            this.tweens.add({
                targets: particle,
                y: y - 100,
                alpha: 0,
                duration: Phaser.Math.Between(5000, 10000),
                ease: 'Sine.easeInOut',
                repeat: -1,
                yoyo: false,
                onRepeat: () => {
                    particle.setPosition(
                        Phaser.Math.Between(0, this.cameras.main.width),
                        this.cameras.main.height + 50
                    );
                    particle.alpha = 0.05;
                }
            });
        }
    }

    createNoirGlow() {
        // Create subtle pulsing crimson glow overlay
        const glow = this.add.graphics();
        glow.setDepth(-1);

        const updateGlow = () => {
            glow.clear();
            const time = this.time.now / 3000;
            const alpha = 0.05 + Math.sin(time) * 0.03;
            glow.fillStyle(0x8b0000, alpha);
            glow.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        };

        this.time.addEvent({
            delay: 50,
            callback: updateGlow,
            loop: true
        });
    }

    resize(gameSize) {
        const width = gameSize.width;
        const height = gameSize.height;

        this.cameras.resize(width, height);
    }

    update() {
        // Main game loop - handled mostly by React UI
    }
}
