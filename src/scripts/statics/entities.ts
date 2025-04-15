export interface GameData {
    list: (QuestionConfig | AnagramConfig)[]
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

// Anagram specific config
export interface AnagramConfig {
    id?: string;
    type?: string;
    scrambledWord: string;
    correctWord: string;
    hint?: string;
    difficulty?: string;
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