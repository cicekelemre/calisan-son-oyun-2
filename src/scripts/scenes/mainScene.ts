import Phaser from "phaser";
import { AudioManager } from "../audioManager";
import * as Entities from '../statics/entities';
import { toggleFullScreen } from "../helpers";
import { Timer } from "../game_objects/timer";
import { FinishDialog } from "../partials/finishDialog";
import { CorrectAnswerCounter } from "../game_objects/correctAnswerCounter";
import Configs from "../statics/configs";

export default class MainScene extends Phaser.Scene {
    private _audioManager!: AudioManager;
    private _timer!: Timer;
    private _finishDialog!: FinishDialog;
    private _correctAnswerCounter!: CorrectAnswerCounter;
    private _background!: Phaser.GameObjects.Image;
    private _fullScreenButton!: Phaser.GameObjects.Image;
    private _soundButton!: Phaser.GameObjects.Image;
    // private _playAgainButton!: Phaser.GameObjects.Image;
    
    private _gameData: Entities.GameData;
    
    // Anagram oyunu değişkenleri
    private _wordList: Entities.AnagramConfig[] = [];
    private _currentWordIndex: number = 0;
    private _currentWord: string = '';
    private _scrambledLetters: string[] = [];
    private _letterTiles: Phaser.GameObjects.Container[] = [];
    private _dropZones: Phaser.GameObjects.Rectangle[] = [];
    private _hintText!: Phaser.GameObjects.Text;
    private _pageText!: Phaser.GameObjects.Text;
    
    // UI sabitler
    private readonly _tileWidth: number = 60;
    private readonly _tileHeight: number = 60;
    private readonly _padding: number = 10;
    
    constructor(gameData: Entities.GameData) {
        super({ key: 'MainScene' });
        this._gameData = gameData;
        
        // Anagram verilerini işle
        this._processAnagramData();
    }
    
    private _processAnagramData(): void {
        // GameData içindeki anagram verilerini ayır
        this._wordList = this._gameData.list
            .filter(item => 'correctWord' in item)
            .map(item => item as Entities.AnagramConfig);
    }

    public create(): void {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this._background = this.add.image(innerWidth / 2, innerHeight / 2, 'background').setDisplaySize(innerWidth, innerHeight);
        
        this._audioManager = new AudioManager(this);
        this._timer = new Timer(this);
        this._audioManager.backgroundMusic.play();
        
        this._correctAnswerCounter = new CorrectAnswerCounter(this);
        
        this._addEvents();
        this._createFullScreenButton();
        this._createSoundButton();
        this._createPlayAgainButton();
        
        // Anagram UI ve bileşenlerini oluştur
        this._setupAnagramUI();
        
        // İlk kelimeyi yükle
        this._loadWord(this._currentWordIndex);
        
        this.onScreenChange();
    }
    
    private _addEvents(): void {
        this.events.on('FinishGame', this._finishGame, this);
    }
    
    private _setupAnagramUI(): void {
        // Sayfa numarası
        this._pageText = this.add.text(
            innerWidth / 2, 
            innerHeight - 50, 
            `${this._currentWordIndex + 1}/${this._wordList.length}`, 
            { fontFamily: 'Arial', fontSize: '24px', color: Configs.questionsTextColor }
        ).setOrigin(0.5);
        
        // İpucu metni
        this._hintText = this.add.text(
            innerWidth / 2, 
            80, 
            '', 
            { fontFamily: 'Arial', fontSize: '24px', color: Configs.questionsTextColor, align: 'center' }
        ).setOrigin(0.5);
        
        // Önceki kelime butonu
        this.add.text(
            innerWidth / 2 - 50, 
            innerHeight - 50, 
            '<', 
            { fontFamily: 'Arial', fontSize: '32px', color: Configs.questionsTextColor }
        ).setOrigin(0.5)
         .setInteractive({ cursor: 'pointer' })
         .on('pointerdown', () => {
             this._audioManager.click.play();
             this._previousWord();
         });
        
        // Sonraki kelime butonu
        this.add.text(
            innerWidth / 2 + 50, 
            innerHeight - 50, 
            '>', 
            { fontFamily: 'Arial', fontSize: '32px', color: Configs.questionsTextColor }
        ).setOrigin(0.5)
         .setInteractive({ cursor: 'pointer' })
         .on('pointerdown', () => {
             this._audioManager.click.play();
             this._nextWord();
         });
    }
    
    private _loadWord(index: number): void {
        // Önceki kelimeyi temizle
        this._clearCurrentWord();
        
        if (index < 0 || index >= this._wordList.length) return;
        
        // Yeni kelimeyi yükle
        this._currentWord = this._wordList[index].correctWord;
        this._hintText.setText(this._wordList[index].hint || '');
        this._pageText.setText(`${index + 1}/${this._wordList.length}`);
        
        // Harfleri karıştır
        this._scrambledLetters = this._scrambleWord(this._currentWord);
        
        // Bırakma bölgelerini oluştur
        this._createDropZones();
        
        // Harf kutularını oluştur
        this._createLetterTiles();
        
        // Sürükleme olaylarını ayarla
        this._setupDragEvents();
    }
    
    private _scrambleWord(word: string): string[] {
        // Kelimeyi harflere ayır
        const letters = word.split('');
        
        // Harfleri karıştır
        Phaser.Utils.Array.Shuffle(letters);
        
        return letters;
    }
    
    private _createLetterTiles(): void {
        // Ekran genişliğine göre harf kutularını yerleştir
        const totalWidth = this._scrambledLetters.length * (this._tileWidth + this._padding) - this._padding;
        const startX = (innerWidth - totalWidth) / 2;
        const startY = 450; // Bırakma bölgelerinin altına yerleştir
        
        this._scrambledLetters.forEach((letter, index) => {
            // Harf kutusu arka planı
            const background = this.add.rectangle(0, 0, this._tileWidth, this._tileHeight, 0x555555);
            
            // Harf metni
            const text = this.add.text(0, 0, letter, { 
                fontFamily: 'Arial', 
                fontSize: '32px', 
                color: '#ffffff' 
            }).setOrigin(0.5);
            
            // Sürüklenebilir container oluştur
            const tile = this.add.container(
                startX + index * (this._tileWidth + this._padding) + this._tileWidth/2,
                startY,
                [background, text]
            );
            
            // Sürüklenebilir yap
            tile.setSize(this._tileWidth, this._tileHeight);
            tile.setInteractive({ draggable: true });
            
            // Veri ekle
            tile.setData('letter', letter);
            tile.setData('originalX', tile.x);
            tile.setData('originalY', tile.y);
            tile.setData('placed', false);
            tile.setData('dropZoneIndex', -1);
            
            this._letterTiles.push(tile);
        });
    }
    
    private _createDropZones(): void {
        // Ekran genişliğine göre bırakma bölgelerini yerleştir
        const totalWidth = this._currentWord.length * (this._tileWidth + this._padding) - this._padding;
        const startX = (innerWidth - totalWidth) / 2;
        const startY = 300;
        
        for (let i = 0; i < this._currentWord.length; i++) {
            // Bırakma bölgesi arka planı (boş kutu)
            const zone = this.add.rectangle(
                startX + i * (this._tileWidth + this._padding) + this._tileWidth/2,
                startY,
                this._tileWidth,
                this._tileHeight,
                0xffffff,
                0.3
            ).setStrokeStyle(2, 0x000000);
            
            // Bırakma bölgesi olarak ayarla
            zone.setInteractive();
            if (zone.input) {
                zone.input.dropZone = true;
            }
            
            // Veri ekle
            zone.setData('index', i);
            zone.setData('occupied', false);
            zone.setData('letter', null);
            
            this._dropZones.push(zone);
        }
    }
    
    private _setupDragEvents(): void {
        // Önceki dinleyicileri temizle
        this.input.off('dragstart');
        this.input.off('drag');
        this.input.off('dragend');
        this.input.off('drop');
        
        // Yeni dinleyicileri ekle
        this.input.on('dragstart', this._onDragStart, this);
        this.input.on('drag', this._onDrag, this);
        this.input.on('dragend', this._onDragEnd, this);
        this.input.on('drop', this._onDrop, this);
    }
    
    private _onDragStart(_: Phaser.Input.Pointer, gameObject: any): void {
        this.children.bringToTop(gameObject);
        
        // Eğer harf zaten bir bölgeye yerleştirilmişse, o bölgeyi boşalt
        if (gameObject.getData('placed')) {
            const dropZoneIndex = gameObject.getData('dropZoneIndex');
            if (dropZoneIndex >= 0 && dropZoneIndex < this._dropZones.length) {
                this._dropZones[dropZoneIndex].setData('occupied', false);
                this._dropZones[dropZoneIndex].setData('letter', null);
            }
            gameObject.setData('placed', false);
            gameObject.setData('dropZoneIndex', -1);
        }
    }
    
    private _onDrag(_: Phaser.Input.Pointer, gameObject: any, dragX: number, dragY: number): void {
        gameObject.x = dragX;
        gameObject.y = dragY;
    }
    
    private _onDragEnd(_: Phaser.Input.Pointer, gameObject: any): void {
        // Eğer harf bir bölgeye yerleştirilmediyse, orijinal konumuna geri dön
        if (!gameObject.getData('placed')) {
            gameObject.x = gameObject.getData('originalX');
            gameObject.y = gameObject.getData('originalY');
        }
        
        // Kelime tamamlandı mı kontrol et
        this._checkWordCompletion();
    }
    
    private _onDrop(_: Phaser.Input.Pointer, gameObject: any, dropZone: any): void {
        // Eğer bölge doluysa, harfi bırakma
        if (dropZone.getData('occupied')) {
            gameObject.x = gameObject.getData('originalX');
            gameObject.y = gameObject.getData('originalY');
            return;
        }
        
        // Harfi bırakma bölgesine yerleştir
        gameObject.x = dropZone.x;
        gameObject.y = dropZone.y;
        
        // Verileri güncelle
        gameObject.setData('placed', true);
        gameObject.setData('dropZoneIndex', dropZone.getData('index'));
        
        dropZone.setData('occupied', true);
        dropZone.setData('letter', gameObject.getData('letter'));
        
        this._audioManager.click.play();
    }
    
    private _checkWordCompletion(): void {
        // Tüm bölgeler dolu mu kontrol et
        const allZonesOccupied = this._dropZones.every(zone => zone.getData('occupied'));
        if (!allZonesOccupied) return;
        
        // Yerleştirilen harflerden kelimeyi oluştur
        const formedWord = this._dropZones
            .sort((a, b) => a.getData('index') - b.getData('index'))
            .map(zone => zone.getData('letter'))
            .join('');
        
        // Doğru kelime mi kontrol et
        if (formedWord === this._currentWord) {
            // Doğru cevabı saya ekle
            this._correctAnswerCounter.increase();
            
            // Doğru ses efekti
            this._audioManager.correct?.play() || this._audioManager.click.play();
            
            // Sonraki kelimeye geç
            this.time.delayedCall(1000, () => {
                this._nextWord();
            });
        } else {
            // Yanlış cevap
            this._audioManager.wrong?.play() || this._audioManager.click.play();
            
            // Harfleri salla
            this._shakeLetters();
        }
    }
    
    private _shakeLetters(): void {
        this._letterTiles.forEach(tile => {
            if (tile.getData('placed')) {
                this.tweens.add({
                    targets: tile,
                    x: tile.x + 10,
                    duration: 50,
                    yoyo: true,
                    repeat: 5
                });
            }
        });
    }
    
    private _nextWord(): void {
        if (this._currentWordIndex < this._wordList.length - 1) {
            this._currentWordIndex++;
            this._loadWord(this._currentWordIndex);
        } else {
            // Tüm kelimeler tamamlandı
            this._finishGame();
        }
    }
    
    private _previousWord(): void {
        if (this._currentWordIndex > 0) {
            this._currentWordIndex--;
            this._loadWord(this._currentWordIndex);
        }
    }
    
    private _clearCurrentWord(): void {
        // Harf kutularını temizle
        this._letterTiles.forEach(tile => {
            tile.destroy();
        });
        this._letterTiles = [];
        
        // Bırakma bölgelerini temizle
        this._dropZones.forEach(zone => {
            zone.destroy();
        });
        this._dropZones = [];
        
        // Olay dinleyicilerini temizle
        this.input.off('dragstart');
        this.input.off('drag');
        this.input.off('dragend');
        this.input.off('drop');
    }
    
    private _finishGame(): void {
        this._timer.pause();
        this._finishDialog = new FinishDialog(
            this, 
            this._correctAnswerCounter.text, 
            this._wordList.length, 
            this._timer.value, 
            this._resetGame
        );
    }
    
    private _resetGame = (): void => {
        this._correctAnswerCounter.reset();
        this._finishDialog?.destroy();
        this._timer.reset();
        
        // Oyunu sıfırla
        this._currentWordIndex = 0;
        this._clearCurrentWord();
        this._loadWord(this._currentWordIndex);
    }
    
    public _createFullScreenButton(): void {
        if(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(<any>window).MSStream) return; //iOS DOES NOT SUPPORT FULLSCREEN

        this._fullScreenButton = this.add
        .image(innerWidth - 10, innerHeight - 10, Configs.fullScreenButton.texture + '-' + Configs.uiComponentsColor)
        .setDisplaySize(Configs.fullScreenButton.width, Configs.fullScreenButton.height)
        .setOrigin(Configs.fullScreenButton.origin.x, Configs.fullScreenButton.origin.y)
        .setInteractive({cursor: 'pointer'})
        .on('pointerdown', () => {
            toggleFullScreen();
        });
    }

    private _createSoundButton(): void {
        this._soundButton = this.add
        .image((this._fullScreenButton?.getBounds().left ?? innerWidth) - 20, innerHeight - 10, Configs.soundButton.texture.enabled)
        .setDisplaySize(10, 10)
        .setOrigin(Configs.soundButton.origin.x, Configs.soundButton.origin.y)
        .setInteractive({cursor: 'pointer'})
        .on('pointerdown', () => {
            this.sound.setMute(!this.sound.mute);
            this._soundButton.setTexture(Configs.soundButton.texture[this.sound.mute ? 'disabled' : 'enabled']);
        });
    }

    private _createPlayAgainButton(): void {
        // @ts-ignore - Bu özellik yaratılıyor ancak doğrudan okunmuyor
        this._playAgainButton = this.add
        .image(10, innerHeight - 10, Configs.playAgainButton.texture)
        .setDisplaySize(Configs.playAgainButton.width, Configs.playAgainButton.height)
        .setOrigin(Configs.playAgainButton.origin.x, Configs.playAgainButton.origin.y)
        .setInteractive({cursor: 'pointer'})
        .on('pointerdown', () => {
            this._audioManager.gameRestart.play();
            this._resetGame(); 
        });
    }
    
    public onScreenChange(): void {
        if (innerHeight > innerWidth) {
            // Dikey mod
            document.documentElement.style.setProperty('--vh', `${innerHeight * 0.01}px`);
        } else {
            // Yatay mod
            document.documentElement.style.setProperty('--vh', `${innerHeight * 0.01}px`);
        }
        
        // UI bileşenlerini güncelle
        this._background.setDisplaySize(innerWidth, innerHeight);
        
        // Aktif kelimeyi yeniden yükle
        this._clearCurrentWord();
        this._loadWord(this._currentWordIndex);
    }
}