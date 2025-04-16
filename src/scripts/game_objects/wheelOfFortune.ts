import * as Entities from '../statics/entities';

export class WheelOfFortune {
    private scene: Phaser.Scene;
    private wheelGraphics: Phaser.GameObjects.Graphics;
    private pointer: Phaser.GameObjects.Image;
    private wheelContainer: Phaser.GameObjects.Container;
    private wedgeTexts: Phaser.GameObjects.Text[] = [];
    private config: Entities.WheelConfig;
    private isSpinning: boolean = false;
    private spinConfig: Entities.SpinConfig;
    private resultCallback: (index: number, content: string) => void;
    private currentAngle: number = 0;
    private wedgeAngle: number;

    constructor(
        scene: Phaser.Scene, 
        config: Entities.WheelConfig, 
        spinConfig: Entities.SpinConfig,
        resultCallback: (index: number, content: string) => void
    ) {
        this.scene = scene;
        this.config = config;
        this.spinConfig = spinConfig;
        this.resultCallback = resultCallback;
        this.wedgeAngle = (2 * Math.PI) / this.config.wedges.length;

        // Create the container for the wheel to make rotation easier
        this.wheelContainer = this.scene.add.container(this.config.centerX, this.config.centerY);
        
        // Create the wheel graphics
        this.wheelGraphics = this.scene.add.graphics();
        this.wheelContainer.add(this.wheelGraphics);
        
        // Draw the wheel
        this.drawWheel();
        
        // Add the pointer (indicator)
        if (this.config.pointerPosition) {
            this.pointer = this.scene.add.image(
                this.config.pointerPosition.x, 
                this.config.pointerPosition.y, 
                'pointer'
            ).setScale(0.3);
        } else {
            // Default pointer at the left side of the wheel
            this.pointer = this.scene.add.image(
                this.config.centerX - this.config.radius - 10, 
                this.config.centerY, 
                'pointer'
            ).setScale(0.3);
        }
    }

    private drawWheel(): void {
        this.wheelGraphics.clear();
        
        // Draw the outer circle with thicker border
        this.wheelGraphics.lineStyle(4, 0xFFFFFF, 1);
        this.wheelGraphics.strokeCircle(0, 0, this.config.radius);
        
        // Draw the wedges
        this.config.wedges.forEach((wedge, index) => {
            const startAngle = index * this.wedgeAngle;
            const endAngle = (index + 1) * this.wedgeAngle;
            
            // Draw wedge with slightly darker color for better contrast
            const color = this.hexToDecimal(wedge.color);
            this.wheelGraphics.fillStyle(color, 1);
            this.wheelGraphics.beginPath();
            this.wheelGraphics.moveTo(0, 0);
            this.wheelGraphics.arc(0, 0, this.config.radius, startAngle, endAngle, false);
            this.wheelGraphics.closePath();
            this.wheelGraphics.fillPath();
            
            // Draw separating lines thicker
            this.wheelGraphics.lineStyle(3, 0xFFFFFF, 1);
            this.wheelGraphics.beginPath();
            this.wheelGraphics.moveTo(0, 0);
            this.wheelGraphics.lineTo(
                Math.cos(startAngle) * this.config.radius,
                Math.sin(startAngle) * this.config.radius
            );
            this.wheelGraphics.closePath();
            this.wheelGraphics.strokePath();
            
            // Add text
            const textAlign = this.config.wheelTextAlign || 'center';
            if (textAlign === 'radial') {
                this.addRadialText(wedge, index, startAngle, endAngle);
            } else {
                this.addCenteredText(wedge, index, startAngle, endAngle);
            }
        });
        
        // Add a center circle
        this.wheelGraphics.fillStyle(0x333333, 1);
        this.wheelGraphics.fillCircle(0, 0, this.config.radius * 0.15);
        
        // Add white border to center circle
        this.wheelGraphics.lineStyle(3, 0xFFFFFF, 1);
        this.wheelGraphics.strokeCircle(0, 0, this.config.radius * 0.15);
    }
    
    private addRadialText(wedge: Entities.WheelWedge, index: number, startAngle: number, endAngle: number): void {
        // Calculate position
        const middleAngle = (startAngle + endAngle) / 2;
        
        // Calculate text positions along radius
        const textRadius = this.config.radius * 0.75; // Dış kenara daha yakın
        const innerRadius = this.config.radius * 0.3; // İç kısımdan biraz daha uzak
        
        // Create text config
        const textConfig = {
            fontFamily: 'Arial',
            fontSize: this.config.wheelTextSize || '16px',
            color: wedge.textColor || '#FFFFFF',
            align: 'center',
            fontStyle: 'bold' // Yazıyı kalın yap
        };
        
        // Create text game object
        const text = this.scene.add.text(0, 0, wedge.content, textConfig);
        
        // Yazının uzunluğuna göre font boyutunu ayarla
        const maxTextWidth = (textRadius - innerRadius) * 0.9; // Dilim genişliğinin %90'ı kadar alan
        if (text.width > maxTextWidth) {
            const scale = maxTextWidth / text.width;
            const newSize = parseInt(this.config.wheelTextSize || '16px') * scale;
            text.setFontSize(`${Math.max(12, newSize)}px`); // Minimum 12px
        }
        
        // Set rotation so text reads outward from center
        let textAngle = middleAngle + Math.PI / 2;
        if (textAngle > Math.PI / 2 && textAngle < Math.PI * 1.5) {
            textAngle += Math.PI;
        }
        text.setRotation(textAngle);
        
        // Position the text along the radius
        // Wordwall'daki gibi daha dışa yakın konumlandır
        const textX = (innerRadius + (textRadius - innerRadius) * 0.7) * Math.cos(middleAngle);
        const textY = (innerRadius + (textRadius - innerRadius) * 0.7) * Math.sin(middleAngle);
        text.setPosition(textX, textY);
        
        // Add stroke to make text more readable
        text.setStroke('#000000', 2);
        
        // Add to tracking arrays
        this.wedgeTexts.push(text);
        this.wheelContainer.add(text);
    }
    
    private addCenteredText(wedge: Entities.WheelWedge, index: number, startAngle: number, endAngle: number): void {
        // Calculate middle angle and position
        const middleAngle = (startAngle + endAngle) / 2;
        const textDistance = this.config.radius * 0.75;
        const textX = Math.cos(middleAngle) * textDistance;
        const textY = Math.sin(middleAngle) * textDistance;
        
        // Create a text for the wedge content
        const textConfig = {
            fontFamily: 'Arial',
            fontSize: this.config.wheelTextSize || '14px',
            color: wedge.textColor || '#FFFFFF',
            align: 'center',
            wordWrap: { width: this.config.radius * 0.5 }
        };
        
        // Create text and set position
        const text = this.scene.add.text(textX, textY, wedge.content, textConfig);
        text.setOrigin(0.5);
        
        // Rotate text to be readable
        let textAngle = middleAngle + Math.PI / 2;
        if (textAngle > Math.PI / 2 && textAngle < Math.PI * 1.5) {
            textAngle += Math.PI;
        }
        text.setRotation(textAngle);
        
        // Add to tracking arrays
        this.wedgeTexts.push(text);
        this.wheelContainer.add(text);
    }

    public spin(): void {
        if (this.isSpinning) return;
        
        this.isSpinning = true;
        
        // Calculate random spin parameters
        const duration = Phaser.Math.Between(
            this.spinConfig.minSpinDuration, 
            this.spinConfig.maxSpinDuration
        );
        const rotations = Phaser.Math.Between(
            this.spinConfig.minRotations, 
            this.spinConfig.maxRotations
        );
        
        // Random stop angle within a wedge
        const targetIndex = Phaser.Math.Between(0, this.config.wedges.length - 1);
        const randomWedgeOffset = Phaser.Math.FloatBetween(0, this.wedgeAngle);
        const stopAngle = 2 * Math.PI * rotations + 
                          targetIndex * this.wedgeAngle + 
                          randomWedgeOffset;
        
        // Create the spin animation
        this.scene.tweens.add({
            targets: this.wheelContainer,
            angle: Phaser.Math.RadToDeg(stopAngle),
            duration: duration,
            ease: this.spinConfig.easingFunction,
            onComplete: () => {
                this.isSpinning = false;
                this.currentAngle = stopAngle % (2 * Math.PI);
                this.handleSpinResult();
            }
        });
        
        // Play spin sound if available
        if (this.scene.sound && this.scene.sound.get('spinSound')) {
            this.scene.sound.play('spinSound');
        }
    }

    private handleSpinResult(): void {
        // Calculate which wedge the pointer is pointing to
        // We need to adjust for the wheel rotation
        const normalizedAngle = (2 * Math.PI - (this.currentAngle % (2 * Math.PI))) % (2 * Math.PI);
        const wedgeIndex = Math.floor(normalizedAngle / this.wedgeAngle) % this.config.wedges.length;
        
        // Get the content of the wedge
        const wedgeContent = this.config.wedges[wedgeIndex].content;
        
        // Call the result callback with the index and content
        this.resultCallback(wedgeIndex, wedgeContent);
        
        // Play result sound if available
        if (this.scene.sound && this.scene.sound.get('resultSound')) {
            this.scene.sound.play('resultSound');
        }
    }

    private hexToDecimal(hex: string): number {
        return parseInt(hex.replace('#', ''), 16);
    }

    public canSpin(): boolean {
        return !this.isSpinning;
    }
    
    public destroy(): void {
        this.wheelGraphics.destroy();
        this.wedgeTexts.forEach(text => text.destroy());
        this.wheelContainer.destroy();
        this.pointer.destroy();
    }
} 