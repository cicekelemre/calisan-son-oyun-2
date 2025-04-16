export class ConfigService {
    private static instance: ConfigService;
    private gameDataUrl: string;
    private settingsUrl: string;

    private constructor() {
        // Use local files
        this.gameDataUrl = 'questions.json';
        this.settingsUrl = 'settings.json';
    }

    public static getInstance(): ConfigService {
        if (!ConfigService.instance) {
            ConfigService.instance = new ConfigService();
        }
        return ConfigService.instance;
    }

    public async loadSettings(): Promise<any> {
        try {
            const response = await fetch(this.settingsUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Settings loading error:', error);
            // Default settings
            return {
                settings: {
                    font: 'Arial',
                    timeLimit: 0, // No time limit for wheel of fortune
                    pointsPerCorrectAnswer: 0, // No points for wheel of fortune
                    buttonScale: 0.35,
                    wheelTextSize: '12px',
                    wheelTextAlign: 'radial',
                    resultTextSize: '24px'
                }
            };
        }
    }

    public async loadWheelData(): Promise<any> {
        try {
            const response = await fetch(this.gameDataUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Wheel data loading error:', error);
            // Default wheel data
            return {
                wheel: {
                    wedges: [
                        {
                            content: "Spin again!",
                            color: "#1e88e5",
                            textColor: "#ffffff"
                        },
                        {
                            content: "Tell us about yourself",
                            color: "#d32f2f",
                            textColor: "#ffffff"
                        }
                    ]
                },
                settings: {
                    spinDuration: {
                        min: 3000,
                        max: 5000
                    },
                    rotations: {
                        min: 2,
                        max: 4
                    }
                }
            };
        }
    }
    
    public async loadQuestions(): Promise<any> {
        return this.loadWheelData();
    }
}
