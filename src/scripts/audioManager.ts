export class AudioManager{
    private _scene: Phaser.Scene;
    public backgroundMusic!: Phaser.Sound.BaseSound;
    public click!: Phaser.Sound.BaseSound;
    public drop!: Phaser.Sound.BaseSound;
    public fail!: Phaser.Sound.BaseSound;
    public pickup!: Phaser.Sound.BaseSound;
    public success!: Phaser.Sound.BaseSound;
    public correct!: Phaser.Sound.BaseSound;
    public wrong!: Phaser.Sound.BaseSound;
    public gameRestart!: Phaser.Sound.BaseSound;
    public spinSound!: Phaser.Sound.BaseSound;
    public resultSound!: Phaser.Sound.BaseSound;
    
    public enabled: boolean = true;

    constructor(scene: Phaser.Scene){
        this._scene = scene;

        this._scene.game.events.on(Phaser.Core.Events.HIDDEN, () => {
            this._scene.sound.pauseAll();
        });
        this._scene.game.events.on(Phaser.Core.Events.VISIBLE, () => {
            this._scene.sound.resumeAll();
        });

        this._initSounds();
    }

    private _initSounds(): void{
        this.backgroundMusic = this._scene.sound.add('backgroundMusic', {loop: true, volume: 0.7 });
        this.click = this._scene.sound.add('clickSound', { volume: 1 });
        
        // Add optional sounds if they exist
        if (this._scene.sound.get('dropSound')) {
            this.drop = this._scene.sound.add('dropSound', { volume: 1 });
        } else {
            this.drop = this.click;
        }
        
        if (this._scene.sound.get('failSound')) {
            this.fail = this._scene.sound.add('failSound', { volume: 1 });
        } else {
            this.fail = this.click;
        }
        
        if (this._scene.sound.get('pickupSound')) {
            this.pickup = this._scene.sound.add('pickupSound', { volume: 1 });
        } else {
            this.pickup = this.click;
        }
        
        if (this._scene.sound.get('successSound')) {
            this.success = this._scene.sound.add('successSound', { volume: 1 });
            this.correct = this._scene.sound.add('successSound', { volume: 1 });
        } else {
            this.success = this.click;
            this.correct = this.click;
        }
        
        if (this._scene.sound.get('failSound')) {
            this.wrong = this._scene.sound.add('failSound', { volume: 1 });
        } else {
            this.wrong = this.click;
        }
        
        // For wheel of fortune specific sounds
        if (this._scene.sound.get('spinSound')) {
            this.spinSound = this._scene.sound.add('spinSound', { volume: 1 });
        } else {
            this.spinSound = this.click;
        }
        
        if (this._scene.sound.get('resultSound')) {
            this.resultSound = this._scene.sound.add('resultSound', { volume: 1 });
        } else {
            this.resultSound = this.success || this.click;
        }
        
        this.gameRestart = this.click;
    }
    
    public toggleSound(): void {
        this.enabled = !this.enabled;
        this._scene.sound.setMute(!this.enabled);
    }
}