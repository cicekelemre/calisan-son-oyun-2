import Configs from '../statics/configs';

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    public preload(): void {
        // Wheel of Fortune assets
        this.load.image('background', 'assets/images/theme1/background.webp');
        this.load.image('pointer', 'assets/images/wheel/pointer.png');
        this.load.image('spin-button', 'assets/images/wheel/spin-button.png');
        
        // UI components
        this.load.image('fullscreen-white', 'assets/images/fullscreen-white.png');
        this.load.image('sound-enabled', 'assets/images/sound-enabled.webp');
        this.load.image('sound-disabled', 'assets/images/sound-disabled.webp');
        this.load.image('restart', 'assets/images/playagain.png');
        this.load.image('start', 'assets/images/start.png');

        // Sound files
        this.load.audio('backgroundMusic', 'assets/sounds/background.mp3');
        this.load.audio('clickSound', 'assets/sounds/click.mp3');
        this.load.audio('spinSound', 'assets/sounds/wheel-spin.mp3');
        this.load.audio('resultSound', 'assets/sounds/wheel-result.mp3');

        // Load wheel data
        this.load.json('wheel-data', 'wheel_data.json');
        
        this.load.html('finishDialog', 'partials/finishDialog.html');

        this.load.on('complete', this.complete, this);
    }

    public complete(): void {
        document.getElementById('loader')?.remove();
        this.scene.start('StartScene');
        window.dispatchEvent(new Event('resize'));
    }
}
