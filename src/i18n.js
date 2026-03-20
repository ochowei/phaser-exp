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

        // ModeSelectScreen
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

        // StageSelectScene
        stageSelect: 'SELECT STAGE',
        stage1Name: 'Asteroid Belt',
        stage2Name: 'Nebula Frontier',
        stage3Name: 'Dark Core',
        stageLocked: 'Locked',
        stageCompleted: 'Completed',

        // StageScene
        waveLabel: 'Wave',
        bossLabel: 'BOSS',
        restLabel: 'REST',
        bossWarning: 'WARNING — BOSS INCOMING!',
        stageClear: 'STAGE CLEAR!',
        nextStage: 'Next Stage',
        retry: 'Retry',
        allClear: 'ALL STAGES CLEAR!',

        // Boss 名稱
        bossSTAGE1Name: 'Crimson Commander',
        bossSTAGE2Name: 'Violet Overlord',
        bossSTAGE3Name: 'Emerald Tyrant',

        // BestiaryScreen
        bestiary: 'Bestiary',
        bestiaryTitle: 'ENEMY BESTIARY',
        enemyRedName: 'R-71 Crimson',
        enemyRedDesc: 'Standard fighter. Appears in swarms.',
        enemyPurpleName: 'X-99 Phantom',
        enemyPurpleDesc: 'Elite fighter with reinforced hull. Drops powerups.',
        enemyBossGreenName: 'G-50 Leviathan',
        enemyBossGreenDesc: 'Mini-boss with heavy armor. Spawns every 30s.',
        enemyBossStage1Desc: 'Stage 1 boss. Fires aimed shots.',
        enemyBossStage2Desc: 'Stage 2 boss. Scatter attack pattern.',
        enemyBossStage3Desc: 'Stage 3 boss. Launches tracking missiles.',
        enemyTypeNormal: 'Normal',
        enemyTypeSpecial: 'Special',
        enemyTypeMiniBoss: 'Mini-Boss',
        enemyTypeBoss: 'Boss',
        enemyHp: 'HP',
        enemyScore: 'Score',
        enemyAttack: 'Attack',
        attackAimed: 'Aimed',
        attackScatter: 'Scatter',
        attackTracking: 'Tracking',
        attackNone: 'None',
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

        // ModeSelectScreen
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

        // StageSelectScene
        stageSelect: '選擇關卡',
        stage1Name: '小行星帶',
        stage2Name: '星雲前線',
        stage3Name: '黑暗核心',
        stageLocked: '鎖定',
        stageCompleted: '已完成',

        // StageScene
        waveLabel: '波次',
        bossLabel: 'BOSS',
        restLabel: '休息',
        bossWarning: '警告 — Boss 來襲！',
        stageClear: '關卡通過！',
        nextStage: '下一關',
        retry: '重試',
        allClear: '全關卡通關！',

        // Boss 名稱
        bossSTAGE1Name: '赤紅指揮官',
        bossSTAGE2Name: '紫夜霸主',
        bossSTAGE3Name: '翠綠暴君',

        // BestiaryScreen
        bestiary: '敵人圖鑑',
        bestiaryTitle: '敵人圖鑑',
        enemyRedName: 'R-71 赤紅',
        enemyRedDesc: '標準戰機，成群出現。',
        enemyPurpleName: 'X-99 幻影',
        enemyPurpleDesc: '精英戰機，配備強化裝甲，擊破後掉落道具。',
        enemyBossGreenName: 'G-50 巨靈',
        enemyBossGreenDesc: '迷你Boss，配備重裝甲，每30秒出現。',
        enemyBossStage1Desc: '第1關Boss，發射瞄準射擊。',
        enemyBossStage2Desc: '第2關Boss，扇形散射攻擊。',
        enemyBossStage3Desc: '第3關Boss，發射追蹤彈。',
        enemyTypeNormal: '普通',
        enemyTypeSpecial: '特殊',
        enemyTypeMiniBoss: '迷你Boss',
        enemyTypeBoss: 'Boss',
        enemyHp: '生命值',
        enemyScore: '分數',
        enemyAttack: '攻擊方式',
        attackAimed: '瞄準',
        attackScatter: '散射',
        attackTracking: '追蹤',
        attackNone: '無',
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
