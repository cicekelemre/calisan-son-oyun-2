export interface GameData {
    list: (QuestionConfig | WheelOfFortuneConfig)[]
}

// Base interface for all game item configurations
export interface GameItemConfig {
    id: string;
    type: string;
}

// Complete sentence specific config
export interface QuestionConfig {
    value: string;
    answers: string[];
    correctAnswer: string;
    layout: string;
}

// Wheel of Fortune specific config
export interface WheelOfFortuneConfig {
    id?: string;
    type?: string;
    content: string;
    category?: string;
}

// Wheel of Fortune specific wedge item
export interface WheelWedge {
    content: string;
    color: string;
    textColor?: string;
    value?: number;
}

export interface AnswerConfig{
    size: {
        width: number,
        height: number
    };
    value: string;
    position: {
        x: number,
        y: number
    },
    texture: string;
}

// This config is used to define the wheel of fortune
export interface WheelConfig {
    centerX: number;
    centerY: number;
    radius: number;
    wedges: WheelWedge[];
    wheelTextSize?: string;
    wheelTextAlign?: string;
    pointerPosition?: {
        x: number;
        y: number;
    }
}

// This config defines how the wheel spins
export interface SpinConfig {
    minSpinDuration: number;
    maxSpinDuration: number;
    minRotations: number;
    maxRotations: number;
    easingFunction: string;
}

export interface SubmitButtonConfig {
    width: number;
    height: number;
    texture: string;
}

export interface FullScreenButtonConfig {
    width: number;
    height: number;
    origin: {x: number, y: number};
    texture: string;
}
export interface SoundButtonConfig {
    width: number;
    height: number;
    origin: {x: number, y: number};
    texture: {
        enabled: string;
        disabled: string;
    };
}

export interface LayoutSwitchButtonConfig {
    width: number;
    height: number;
    origin: {x: number, y: number};
    texture: string;
}

export interface  PlayAgainButtonConfig {
    width: number;
    height: number;
    origin: {x: number, y: number};
    texture: string;
}

export interface PaginatorConfig {
    button: {
        width: number;
        height: number;
        texture: string;
    },
    textStyle: Phaser.Types.GameObjects.Text.TextStyle;
}

export interface CorrectAnswerCounterConfig {
    icon: {
        texture: string,
        width: number,
        height: number
    };
    textIntialValue: string;
    textStyle: Phaser.Types.GameObjects.Text.TextStyle;

}

export interface TimerConfig {
    textStyle: Phaser.Types.GameObjects.Text.TextStyle;
    origin: {x: number, y: number};
    initialTime: number,
    isCountDown: boolean
}