export class ConfigService {
    private static instance: ConfigService;
    private gameDataUrl: string;
    private settingsUrl: string;

    private constructor() {
        // Yerel dosyaları kullan
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
            console.error('Settings yüklenirken hata:', error);
            // Varsayılan ayarlar
            return {
                settings: {
                    font: 'Arial',
                    timeLimit: 120,
                    pointsPerCorrectAnswer: 10
                }
            };
        }
    }

    public async loadQuestions(): Promise<any> {
        try {
            const response = await fetch(this.gameDataUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            // questions.json formatını anagram-data.json formatına dönüştür
            return {
                list: data.anagrams.map((item: any) => ({
                    correctWord: item.word,
                    hint: item.hint
                }))
            };
        } catch (error) {
            console.error('Oyun verileri yüklenirken hata:', error);
            // Varsayılan anagramlar
            return {
                list: [
                    {
                        correctWord: "APPLE",
                        hint: "A fruit that keeps the doctor away"
                    },
                    {
                        correctWord: "BANANA",
                        hint: "Yellow curved fruit"
                    }
                ]
            };
        }
    }
}
