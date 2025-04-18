import * as Entities from './entities';

export default class Configs{
    static readonly spacesUrl = './assets';
    static gameConfig: Phaser.Types.Core.GameConfig = {
        title: 'Wheel of Fortune',
        version: "1.0.0",

        type: Phaser.AUTO,
        transparent: false,
        backgroundColor: '#000000',
        disableContextMenu: true,

        scale: {
            parent: 'app',
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 1920,
            height: 1080,
            min: {
                width: 320,
                height: 200
            },
            max: {
                width: 3840,
                height: 2160,
            }

        },

        physics: {
            default: 'arcade'
        },
        dom: {
            createContainer: true
        },

        loader: {
            path: '',
            baseURL: '',
            crossOrigin: 'anonymous'
        }

        //,
        //fps: {
        //    target: 60,
        //    forceSetTimeOut: true,
        //    deltaHistory: 10,
        //    panicMax: 120,
        //    smoothStep: false
        //}
    };

    static fontFamily: string = 'Arial';
    static shuffleQuestions: boolean = false;
    static questionsTextColor: 'white' | 'black' = 'white';
    static answersTextColor: 'white' | 'black' = 'black';
    static uiComponentsColor: 'white' | 'black' = 'white';
    
    // New properties
    static buttonScale: number = 0.35;
    static wheelTextSize: string = '12px';
    static wheelTextAlign: string = 'radial';
    static resultTextSize: string = '24px';

    static webScale: number = Math.min(innerWidth / 1920, innerHeight / 1080);
    static mobileScale: number = Math.min((innerWidth / 1200), innerHeight / 800) ;

    static submitButton: Entities.SubmitButtonConfig = {
        width: 250,
        height: 60,
        texture: 'submitButton'
    }

    static fullScreenButton: Entities.FullScreenButtonConfig = {
        width: 44,
        height: 44,
        origin: {x: 1, y: 1},
        texture: 'fullscreen'
    }

    static soundButton: Entities.SoundButtonConfig = {
        width: 46,
        height: 46,
        origin: {x: 1, y: 1},
        texture: {
            enabled: 'sound-enabled',
            disabled: 'sound-disabled'
        }
    }

    static layoutSwitchButton: Entities.FullScreenButtonConfig = {
        width: 50,
        height: 50,
        origin: {x: 0.5, y: 0.5},
        texture: 'layout-switch'
    }

    static playAgainButton: Entities.PlayAgainButtonConfig = {
        width: 50,
        height: 50,
        origin: {x: 0, y: 1},
        texture: 'restart'
    }


    static paginator: Entities.PaginatorConfig = {
        button: {
            width: 24,
            height: 24,
            texture: 'next'
        },
        textStyle: {fontFamily: 'Arial', fontSize: 20}
    }

    static correctAnswerCounter: Entities.CorrectAnswerCounterConfig = {
        icon: {
            texture: 'checkmark',
            width: 30,
            height: 32
        },
        textIntialValue: '0',
        textStyle: {fontFamily: 'Arial', fontSize: 40, color: '#FFFFFF'}

    }

    static timer: Entities.TimerConfig = {
        textStyle: {fontFamily: 'Arial', fontSize: 40},
        origin: {x: 0, y: 0},
        initialTime: 0,
        isCountDown: false
    }

    static onScreenChange(): void{
        Configs.mobileScale = Math.min((innerWidth / 1920), innerHeight / 1080) * 1.5;
        Configs.webScale =  Math.min(innerWidth / 1920, innerHeight / 1080);
    }
}
