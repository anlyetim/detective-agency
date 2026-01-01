import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Create loading bar
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x4a1a1f, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            fontFamily: 'monospace',
            fontSize: '20px',
            fill: '#ffffff'
        });
        loadingText.setOrigin(0.5, 0.5);

        const percentText = this.add.text(width / 2, height / 2, '0%', {
            fontFamily: 'monospace',
            fontSize: '18px',
            fill: '#ffffff'
        });
        percentText.setOrigin(0.5, 0.5);

        // Update loading bar
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0x8b0000, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
            percentText.setText(parseInt(value * 100) + '%');
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });

        // Load background music
        this.load.audio('bgMusic', 'assets/music/bgmusic.mp3');

        // Load UI icons
        this.load.image('icon_hat', 'assets/pics/icon_hat.png');
        this.load.image('icon_file', 'assets/pics/icon_file.png');
        this.load.image('icon_item', 'assets/pics/icon_item.png');
        this.load.image('icon_settings', 'assets/pics/icons_settings.png');

        // Load stat icons from the icons sheets
        this.load.image('icons', 'assets/pics/icons.jpg');
        this.load.image('icons2', 'assets/pics/icons2.jpg');

        // Load detective sprites
        for (let i = 1; i <= 7; i++) {
            this.load.image(`Detective${i}`, `assets/pics/Detective${i}.png`);
        }

        // Load case sprites
        for (let i = 1; i <= 10; i++) {
            this.load.image(`Case${i}`, `assets/pics/Case${i}.png`);
            this.load.image(`EpicCase${i}`, `assets/pics/EpicCase${i}.png`);
        }

        // Load additional UI elements
        for (let i = 1; i <= 5; i++) {
            this.load.image(`Untitled${i === 1 ? '' : i}`, `assets/pics/Untitled${i === 1 ? '' : i}.png`);
        }
    }

    create() {
        // Start main scene
        this.scene.start('MainScene');
    }
}
