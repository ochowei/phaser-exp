/**
 * 關卡模式設定資料
 *
 * 每個關卡包含：
 * - id: 關卡編號
 * - nameKey: i18n 翻譯 key
 * - waves: 波次陣列，每波有敵人組合與休息時間
 * - boss: Boss 設定（profile key、射擊延遲、攻擊模式）
 */
export const stages = [
    {
        id: 1,
        nameKey: 'stage1Name',
        waves: [
            {
                enemies: [
                    { profileKey: 'EN_RED', count: 5, interval: 1000 },
                ],
                restAfter: 2000,
            },
            {
                enemies: [
                    { profileKey: 'EN_RED', count: 4, interval: 800 },
                    { profileKey: 'EN_PURPLE', count: 1, interval: 1200 },
                ],
                restAfter: 2000,
            },
            {
                enemies: [
                    { profileKey: 'EN_RED', count: 6, interval: 700 },
                    { profileKey: 'EN_PURPLE', count: 2, interval: 1000 },
                ],
                restAfter: 0,
            },
        ],
        boss: {
            profileKey: 'EN_BOSS_STAGE1',
            fireDelay: 1800,
            attackPattern: 'aimed',
        },
    },
    {
        id: 2,
        nameKey: 'stage2Name',
        waves: [
            {
                enemies: [
                    { profileKey: 'EN_RED', count: 6, interval: 800 },
                    { profileKey: 'EN_PURPLE', count: 2, interval: 1000 },
                ],
                restAfter: 2000,
            },
            {
                enemies: [
                    { profileKey: 'EN_PURPLE', count: 4, interval: 900 },
                ],
                restAfter: 2000,
            },
            {
                enemies: [
                    { profileKey: 'EN_RED', count: 8, interval: 600 },
                    { profileKey: 'EN_PURPLE', count: 3, interval: 800 },
                ],
                restAfter: 2000,
            },
            {
                enemies: [
                    { profileKey: 'EN_PURPLE', count: 5, interval: 700 },
                    { profileKey: 'EN_RED', count: 4, interval: 600 },
                ],
                restAfter: 0,
            },
        ],
        boss: {
            profileKey: 'EN_BOSS_STAGE2',
            fireDelay: 2000,
            attackPattern: 'scatter',
        },
    },
    {
        id: 3,
        nameKey: 'stage3Name',
        waves: [
            {
                enemies: [
                    { profileKey: 'EN_RED', count: 8, interval: 600 },
                    { profileKey: 'EN_PURPLE', count: 3, interval: 800 },
                ],
                restAfter: 2000,
            },
            {
                enemies: [
                    { profileKey: 'EN_PURPLE', count: 6, interval: 700 },
                ],
                restAfter: 2000,
            },
            {
                enemies: [
                    { profileKey: 'EN_RED', count: 10, interval: 500 },
                    { profileKey: 'EN_PURPLE', count: 4, interval: 700 },
                ],
                restAfter: 2000,
            },
            {
                enemies: [
                    { profileKey: 'EN_PURPLE', count: 5, interval: 600 },
                    { profileKey: 'EN_RED', count: 6, interval: 500 },
                ],
                restAfter: 2000,
            },
            {
                enemies: [
                    { profileKey: 'EN_PURPLE', count: 8, interval: 500 },
                ],
                restAfter: 0,
            },
        ],
        boss: {
            profileKey: 'EN_BOSS_STAGE3',
            fireDelay: 1500,
            attackPattern: 'tracking',
        },
    },
];

/**
 * 根據 id 取得關卡設定
 * @param {number} id - 關卡編號（1-based）
 * @returns {object|undefined}
 */
export function getStageById(id) {
    return stages.find(s => s.id === id);
}
