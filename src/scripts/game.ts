import Phaser from "phaser";
import MainScene from "./scenes/mainScene";
import PreloadScene from "./scenes/preloadScene";
import Configs from "./statics/configs";
import StartScene from "./scenes/startScene";
import { ConfigService } from './services/ConfigService';

export default class Game {
    private _config!: Phaser.Types.Core.GameConfig;
    private _preloadScene!: PreloadScene;
    private _startScene!: StartScene;
    private _mainScene!: MainScene;
    private _gameObject!: Phaser.Game;
    private configService: ConfigService;

    constructor() {
        this.configService = ConfigService.getInstance();
        this.initialize();
    }

    private async initialize() {
        try {
            // first load settings then load questions
            const [settings, gameData] = await Promise.all([
                this.configService.loadSettings(),
                this.configService.loadQuestions() // Use loadQuestions instead of loadGameData
            ]);

            // start game
            this.startGame(settings, gameData);
        } catch (error) {
            console.error('Oyun başlatılırken hata:', error);
        }
    }

    private startGame(settings: any, gameData: any) {
        this._config = Configs.gameConfig;

        this._setConfigFromJSON(settings);
        this._preloadScene = new PreloadScene();
        this._startScene = new StartScene();
        this._mainScene = new MainScene(gameData);

        this._config.scene = [this._preloadScene, this._startScene, this._mainScene];
        this._gameObject = new Phaser.Game(this._config);

        this._addListeners();
    }

    private _setConfigFromJSON(settings: any): void {
        // Settings'in doğru yapısını kontrol et ve kullan
        const settingsData = settings.settings || settings;

        // default values
        const defaults = {
            font: 'Arial',
            timeLimit: 60,
            shuffleQuestions: true,
            UIComponentsColor: 'white',
            answersTextColor: 'white',
            questionsTextColor: 'white'
        };

        console.log("Settings:", settings);
        console.log("Time Limit from settings:", settingsData.timeLimit);

        // merge config values with default values
        Configs.fontFamily = settingsData.font || defaults.font;
        Configs.timer.initialTime = settingsData.timeLimit || defaults.timeLimit;
        Configs.timer.isCountDown = true;  // Her zaman geri sayım olarak ayarla
        Configs.shuffleQuestions = settingsData.shuffleQuestions ?? defaults.shuffleQuestions;

        // UI color settings
        const uiColor = settingsData.UIComponentsColor || defaults.UIComponentsColor;
        if (uiColor === 'white' || uiColor === 'black') {
            Configs.uiComponentsColor = uiColor;
            Configs.paginator.textStyle.color = uiColor;
            Configs.correctAnswerCounter.textStyle.color = uiColor;
            Configs.timer.textStyle.color = uiColor;
        }

        const answersColor = settingsData.answersTextColor || defaults.answersTextColor;
        if (answersColor === 'white' || answersColor === 'black') {
            Configs.answersTextColor = answersColor;
        }

        const questionsColor = settingsData.questionsTextColor || defaults.questionsTextColor;
        if (questionsColor === 'white' || questionsColor === 'black') {
            Configs.questionsTextColor = questionsColor;
        }
    }

    private _addListeners(): void {
        window.addEventListener('resize', () => {
            if(this._gameObject.scene.isActive('StartScene')){
                this._startScene.onScreenChange();
            } else if(this._gameObject.scene.isActive('MainScene')) {
                // Sadece window.resize event'i tetikle, tüm sahneler buna yanıt verecek
                window.dispatchEvent(new Event('resize'));
            }
        });
    }
}
