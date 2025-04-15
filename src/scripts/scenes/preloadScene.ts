import Configs from '../statics/configs';

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    public preload(): void {
        // Temel assetleri yükle
        this.load.image('background', 'assets/images/theme3/background.webp');
        this.load.image('letter-box', 'assets/images/theme3/letter-box-1.png');
        this.load.image('targetarea', 'assets/images/theme3/targetarea.png');
        this.load.image('correct', 'assets/images/theme3/correct.png');
        this.load.image('incorrect', 'assets/images/theme3/incorrect.png');
        this.load.image('checkmark', 'assets/images/checkmark.png');
        
        // Ses dosyaları
        this.load.audio('backgroundMusic', 'assets/sounds/background.mp3');
        this.load.audio('clickSound', 'assets/sounds/click.mp3');
        this.load.audio('successSound', 'assets/sounds/success.mp3');
        this.load.audio('failSound', 'assets/sounds/fail.mp3');
        this.load.audio('dropSound', 'assets/sounds/drop.mp3');
        this.load.audio('pickupSound', 'assets/sounds/pickup.mp3');
        
        // UI bileşenleri için görüntüler
        this.load.image('fullscreen-white', 'assets/images/fullscreen-white.png');
        this.load.image('sound-enabled', 'assets/images/sound-enabled.webp');
        this.load.image('sound-disabled', 'assets/images/sound-disabled.webp');
        this.load.image('restart', 'assets/images/playagain.png');
        this.load.image('start', 'assets/images/start.png');

        this.load.html('finishDialog', 'partials/finishDialog.html');

        this.load.on('complete', this.complete, this);
    }

    public complete(): void {
        document.getElementById('loader')?.remove();
        this.scene.start('StartScene');
        window.dispatchEvent(new Event('resize'));
    }
}
