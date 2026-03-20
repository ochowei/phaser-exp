/**
 * 敵人圖鑑資料
 *
 * 補充 aircraftProfiles 中沒有的顯示用資訊（分數、類型、i18n key）。
 * Boss 名稱沿用既有的 bossSTAGE*Name key 以避免重複。
 */

export const enemyEntries = [
    {
        profileKey: 'EN_RED',
        nameKey: 'enemyRedName',
        descKey: 'enemyRedDesc',
        score: 10,
        type: 'normal',
    },
    {
        profileKey: 'EN_PURPLE',
        nameKey: 'enemyPurpleName',
        descKey: 'enemyPurpleDesc',
        score: 20,
        type: 'special',
    },
    {
        profileKey: 'EN_BOSS_GREEN',
        nameKey: 'enemyBossGreenName',
        descKey: 'enemyBossGreenDesc',
        score: 100,
        type: 'miniBoss',
    },
    {
        profileKey: 'EN_BOSS_STAGE1',
        nameKey: 'bossSTAGE1Name',
        descKey: 'enemyBossStage1Desc',
        score: 200,
        type: 'boss',
    },
    {
        profileKey: 'EN_BOSS_STAGE2',
        nameKey: 'bossSTAGE2Name',
        descKey: 'enemyBossStage2Desc',
        score: 200,
        type: 'boss',
    },
    {
        profileKey: 'EN_BOSS_STAGE3',
        nameKey: 'bossSTAGE3Name',
        descKey: 'enemyBossStage3Desc',
        score: 200,
        type: 'boss',
    },
];
