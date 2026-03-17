const translations = {
    en: {
        // StartScene
        pressStart: 'Press Start to Begin',
        startGame: 'Start Game',
        options: 'Options',

        // OptionScene
        optionsTitle: 'OPTIONS',
        bgmVolume: 'BGM Volume',
        muted: 'Muted',
        muteOn: '🔇 Unmute',
        muteOff: '🔊 Mute',
        back: 'Back',
        language: 'Language',
        langEn: 'English',
        langZh: '中文',

        // ModeSelectScene
        selectMode: 'SELECT MODE',
        endlessMode: 'Endless Mode',
        stageMode: 'Stage Mode',
        backArrow: '← Back',
        underConstruction: 'Under Construction',
        close: 'Close',

        // MainScene
        score: 'Score',
        highScore: 'High Score',
        tripleShotActive: 'TRIPLE SHOT ACTIVE!',
        paused: 'PAUSED',
        pauseHint: 'Press P / ESC or top-right button to resume',
        mainMenu: 'Main Menu',
        gameOver: 'GAME OVER',
        restart: 'Restart',
        miniBossWarning: 'MINI-BOSS INCOMING!',
    },
    zh: {
        // StartScene
        pressStart: '按下開始以遊玩',
        startGame: '開始遊戲',
        options: '設定',

        // OptionScene
        optionsTitle: '設定',
        bgmVolume: '背景音樂音量',
        muted: '已靜音',
        muteOn: '🔇 取消靜音',
        muteOff: '🔊 靜音',
        back: '返回',
        language: '語言',
        langEn: 'English',
        langZh: '中文',

        // ModeSelectScene
        selectMode: '選擇模式',
        endlessMode: '無盡模式',
        stageMode: '關卡模式',
        backArrow: '← 返回',
        underConstruction: '施工中',
        close: '關閉',

        // MainScene
        score: '分數',
        highScore: '最高分',
        tripleShotActive: '三連射啟動！',
        paused: '暫停',
        pauseHint: '按 P / ESC 或右上角按鈕繼續',
        mainMenu: '主選單',
        gameOver: '遊戲結束',
        restart: '重新開始',
        miniBossWarning: '迷你Boss來襲！',
    }
};

let currentLang = localStorage.getItem('gameLang') || 'en';

export function t(key) {
    return translations[currentLang]?.[key] || translations['en'][key] || key;
}

export function getLang() {
    return currentLang;
}

export function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('gameLang', lang);
}
