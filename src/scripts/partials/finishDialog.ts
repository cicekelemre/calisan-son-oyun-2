import Configs from "../statics/configs";

export class FinishDialog extends Phaser.GameObjects.DOMElement{
    private _playAgainButton!: HTMLElement | null;
    private _timeElement!: HTMLElement | null;
    private _answersElement!: HTMLElement | null;
    private _statusTitleElement!: HTMLElement | null;

    private _playAgainCallback: () => void;
    
    // Constructor for wheel of fortune game
    constructor(scene: Phaser.Scene, playAgainCallBack: () => void) {
        super(scene, 0, 0);
        scene.add.existing(this);
        
        this._playAgainCallback = playAgainCallBack;

        this.createFromCache('finishDialog');
        this._initElements();
        this._setupForWheelOfFortune();
        this._addEvent();
    }

    private _initElements(): void{
        this._playAgainButton = this.node.querySelector('button');
        this._timeElement = this.node.querySelector('#timeElement');
        this._answersElement = this.node.querySelector('#answersElement');
        this._statusTitleElement = this.node.querySelector('#statusTitle');
    }

    private _setupForWheelOfFortune(): void {
        // Update the dialog UI for wheel of fortune
        if (this._statusTitleElement) {
            this._statusTitleElement.innerHTML = "Game Over";
        }
        
        // Hide time and correct answers sections or modify as needed
        if (this._timeElement?.parentElement) {
            this._timeElement.parentElement.style.display = 'none';
        }
        
        if (this._answersElement?.parentElement) {
            this._answersElement.parentElement.style.display = 'none';
        }
    }

    private _addEvent(): void{
        this._playAgainButton?.addEventListener('click', () => {
            this._playAgainCallback();
            this.destroy();
        });
    }
}