import Phaser from "phaser";
import { AudioManager } from "../audioManager";
import * as Entities from '../statics/entities';
import { toggleFullScreen } from "../helpers";
import { Timer } from "../game_objects/timer";
import { FinishDialog } from "../partials/finishDialog";
import { WheelOfFortune } from "../game_objects/wheelOfFortune";
import Configs from "../statics/configs";

export default class MainScene extends Phaser.Scene {
    private _audioManager!: AudioManager;
    private _timer!: Timer;
    private _finishDialog!: FinishDialog;
    private _background!: Phaser.GameObjects.Image;
    private _fullScreenButton!: Phaser.GameObjects.Image;
    private _soundButton!: Phaser.GameObjects.Image;
    
    // Wheel of Fortune specific variables
    private _wheel!: WheelOfFortune;
    private _spinButton!: Phaser.GameObjects.Image;
    private _resultText!: Phaser.GameObjects.Text;
    private _wheelData: any;
    private _spinConfig!: Entities.SpinConfig;
    
    constructor(gameData: any) {
        super({ key: 'MainScene' });
        this._wheelData = gameData;
    }
    
    public create(): void {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this._background = this.add.image(innerWidth / 2, innerHeight / 2, 'background').setDisplaySize(innerWidth, innerHeight);
        
        this._audioManager = new AudioManager(this);
        this._audioManager.backgroundMusic.play();
        
        // Initialize configuration
        this._spinConfig = {
            minSpinDuration: this._wheelData.settings.spinDuration.min,
            maxSpinDuration: this._wheelData.settings.spinDuration.max,
            minRotations: this._wheelData.settings.rotations.min,
            maxRotations: this._wheelData.settings.rotations.max,
            easingFunction: 'cubic.out'
        };
        
        // Create UI
        this._createUI();
        
        // Create wheel
        this._createWheel();
        
        // Add events
        this._addEvents();
        
        this.onScreenChange();
    }
    
    private _createUI(): void {
        // Create the spin button container
        const buttonY = innerHeight - 80;
        const buttonContainer = this.add.container(innerWidth / 2, buttonY);
        
        // Create the spin button
        this._spinButton = this.add.image(0, 0, 'spin-button')
            .setInteractive({ cursor: 'pointer' })
            .on('pointerdown', () => {
                this._audioManager.click.play();
                this._spinWheel();
            });
        
        // Scale the spin button smaller than other buttons
        this._spinButton.setScale(Configs.buttonScale * 0.5);
        
        // Add "DÖNDÜR" text
        const spinText = this.add.text(0, this._spinButton.height * Configs.buttonScale * 0.5 + 5, 'DÖNDÜR', {
            fontFamily: Configs.fontFamily,
            fontSize: '20px',
            color: '#FFFFFF',
            align: 'center'
        }).setOrigin(0.5);
        
        // Add both to container
        buttonContainer.add([this._spinButton, spinText]);
        
        // Create the result text
        this._resultText = this.add.text(innerWidth / 2, 100, '', {
            fontFamily: Configs.fontFamily,
            fontSize: Configs.resultTextSize,
            color: '#FFFFFF',
            align: 'center',
            wordWrap: { width: innerWidth * 0.8 }
        }).setOrigin(0.5);
        
        // UI buttons
        this._createFullScreenButton();
        this._createSoundButton();
    }
    
    private _createWheel(): void {
        // Create wheel configuration
        const wheelConfig: Entities.WheelConfig = {
            centerX: innerWidth / 2,
            centerY: innerHeight / 2,
            radius: Math.min(innerWidth, innerHeight) * 0.35,
            wedges: this._wheelData.wheel.wedges,
            wheelTextSize: Configs.wheelTextSize,
            wheelTextAlign: Configs.wheelTextAlign,
            pointerPosition: {
                x: innerWidth / 2 - Math.min(innerWidth, innerHeight) * 0.35 - 30,
                y: innerHeight / 2
            }
        };
        
        // Create the wheel
        this._wheel = new WheelOfFortune(this, wheelConfig, this._spinConfig, this._onWheelResult.bind(this));
    }
    
    private _spinWheel(): void {
        if (this._wheel.canSpin()) {
            // Clear previous result
            this._resultText.setText('');
            
            // Spin the wheel
            this._wheel.spin();
            
            // Disable the spin button during spinning
            this._spinButton.setTint(0x888888);
            this._spinButton.disableInteractive();
        }
    }
    
    private _onWheelResult(index: number, content: string): void {
        // Display the result
        this._resultText.setText(content);
        
        // Re-enable the spin button
        this._spinButton.clearTint();
        this._spinButton.setInteractive({ cursor: 'pointer' });
    }
    
    private _addEvents(): void {
        // Add resize event listener
        window.addEventListener('resize', this.onScreenChange.bind(this));
    }
    
    private _finishGame(): void {
        // This could show a summary or high score
        this._finishDialog = new FinishDialog(this, this._resetGame);
    }
    
    private _resetGame = (): void => {
        // Reset the game state
        this._resultText.setText('');
        
        // Re-enable the spin button if it was disabled
        this._spinButton.clearTint();
        this._spinButton.setInteractive({ cursor: 'pointer' });
        
        // We could reset any other state here
    }
    
    public _createFullScreenButton(): void {
        this._fullScreenButton = this.add
            .image(innerWidth - 20, 20, 'fullscreen-white')
            .setInteractive({ cursor: 'pointer' })
            .on('pointerdown', () => {
                toggleFullScreen();
            })
            .setOrigin(1, 0)
            .setScale(Configs.buttonScale);
    }
    
    private _createSoundButton(): void {
        this._soundButton = this.add
            .image(innerWidth - 80, 20, this._audioManager.enabled ? 'sound-enabled' : 'sound-disabled')
            .setInteractive({ cursor: 'pointer' })
            .on('pointerdown', () => {
                this._audioManager.toggleSound();
                this._soundButton.setTexture(this._audioManager.enabled ? 'sound-enabled' : 'sound-disabled');
            })
            .setOrigin(1, 0)
            .setScale(Configs.buttonScale);
    }
    
    public onScreenChange(): void {
        // Resize and reposition background
        this._background.setDisplaySize(innerWidth, innerHeight);
        this._background.setPosition(innerWidth / 2, innerHeight / 2);
        
        // Reposition UI elements
        if (this._fullScreenButton) {
            this._fullScreenButton.setPosition(innerWidth - 20, 20);
        }
        
        if (this._soundButton) {
            this._soundButton.setPosition(innerWidth - 80, 20);
        }
        
        if (this._spinButton) {
            const buttonContainer = this._spinButton.parentContainer;
            if (buttonContainer) {
                buttonContainer.setPosition(innerWidth / 2, innerHeight - 80);
            }
        }
        
        if (this._resultText) {
            this._resultText.setPosition(innerWidth / 2, 100);
            this._resultText.setWordWrapWidth(innerWidth * 0.8);
        }
        
        // If the wheel exists, destroy and recreate it to match new dimensions
        if (this._wheel) {
            this._wheel.destroy();
            this._createWheel();
        }
    }
    
    public destroy(): void {
        // Clean up resources
        if (this._wheel) {
            this._wheel.destroy();
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this.onScreenChange.bind(this));
    }
}