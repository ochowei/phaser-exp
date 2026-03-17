/**
 * 戰機外觀 Profile 定義
 *
 * 每個 profile 描述一架戰機的外觀繪製指令、紋理尺寸，以及尾焰粒子設定。
 * 未來可在此檔案新增更多 profile，並透過 key 選擇使用。
 */

const aircraftProfiles = {
    S63HP: {
        name: 'S-63 Hornet Plus',
        description: '藍色科幻蜂型戰機，配備橙色尾焰推進器',
        textureKey: 'playerTexture',
        textureSize: { width: 32, height: 32 },

        /**
         * 繪製戰機紋理
         * @param {Phaser.GameObjects.Graphics} graphics - Phaser graphics 物件
         */
        draw(graphics) {
            // 深色機身外殼
            graphics.fillStyle(0x0f172a, 1);
            graphics.fillTriangle(4, 16, 28, 4, 28, 28);

            // 藍色核心機體
            graphics.fillStyle(0x2563eb, 1);
            graphics.fillTriangle(8, 16, 24, 8, 24, 24);

            // 淺藍色機翼（上翼 + 下翼）
            graphics.fillStyle(0x38bdf8, 1);
            graphics.fillTriangle(7, 16, 20, 2, 22, 10);
            graphics.fillTriangle(7, 16, 20, 30, 22, 22);

            // 淺色駕駛艙 / 感測器
            graphics.fillStyle(0xe0f2fe, 1);
            graphics.fillEllipse(20, 16, 7, 10);

            // 橙色排氣口
            graphics.fillStyle(0xf59e0b, 1);
            graphics.fillRect(2, 12, 4, 8);
        },

        /** 尾焰粒子設定 */
        trail: {
            speed: { min: 30, max: 120 },
            angle: { min: 150, max: 210 },
            scale: { start: 0.35, end: 0 },
            alpha: { start: 0.8, end: 0 },
            tint: [0xfff59d, 0xffc107, 0xff6f00],
            lifespan: 240,
            quantity: 1,
            frequency: 35,
            blendMode: 'ADD',
        },

        /** 尾焰跟隨偏移 */
        trailOffset: { x: -14, y: 0 },
    },

    /** 普通敵機 — 紅色系，玩家戰機的水平鏡像 */
    EN_RED: {
        name: 'R-71 Crimson',
        description: '紅色敵方戰機，面朝左飛行',
        textureKey: 'enemy_normal',
        textureSize: { width: 32, height: 32 },

        draw(graphics) {
            // 深色機身外殼（面朝左）
            graphics.fillStyle(0x1a0000, 1);
            graphics.fillTriangle(28, 16, 4, 4, 4, 28);

            // 紅色核心機體
            graphics.fillStyle(0xdc2626, 1);
            graphics.fillTriangle(24, 16, 8, 8, 8, 24);

            // 暗紅色機翼（上翼 + 下翼）
            graphics.fillStyle(0xef4444, 1);
            graphics.fillTriangle(25, 16, 12, 2, 10, 10);
            graphics.fillTriangle(25, 16, 12, 30, 10, 22);

            // 淺紅駕駛艙 / 感測器
            graphics.fillStyle(0xfca5a5, 1);
            graphics.fillEllipse(12, 16, 7, 10);

            // 橙色排氣口
            graphics.fillStyle(0xf59e0b, 1);
            graphics.fillRect(26, 12, 4, 8);
        },

        trail: {
            speed: { min: 30, max: 120 },
            angle: { min: -30, max: 30 },
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.7, end: 0 },
            tint: [0xff6666, 0xff3333, 0xcc0000],
            lifespan: 200,
            quantity: 1,
            frequency: 45,
            blendMode: 'ADD',
        },

        trailOffset: { x: 14, y: 0 },
    },

    /** 特殊敵機 — 紫色系，機翼更寬更具威脅感 */
    EN_PURPLE: {
        name: 'X-99 Phantom',
        description: '紫色精英戰機，寬翼掠翼設計',
        textureKey: 'enemy_special',
        textureSize: { width: 32, height: 32 },

        draw(graphics) {
            // 深紫機身外殼（更寬的掠翼輪廓）
            graphics.fillStyle(0x1a002e, 1);
            graphics.fillTriangle(28, 16, 2, 2, 2, 30);

            // 紫色核心機體
            graphics.fillStyle(0x9333ea, 1);
            graphics.fillTriangle(24, 16, 6, 7, 6, 25);

            // 洋紅色機翼（展幅更大）
            graphics.fillStyle(0xc026d3, 1);
            graphics.fillTriangle(26, 16, 10, 0, 8, 10);
            graphics.fillTriangle(26, 16, 10, 32, 8, 22);

            // 淺紫駕駛艙 / 感測器
            graphics.fillStyle(0xf0abfc, 1);
            graphics.fillEllipse(12, 16, 6, 8);

            // 粉紅排氣口（略大）
            graphics.fillStyle(0xf472b6, 1);
            graphics.fillRect(26, 11, 5, 10);
        },

        trail: {
            speed: { min: 30, max: 120 },
            angle: { min: -30, max: 30 },
            scale: { start: 0.35, end: 0 },
            alpha: { start: 0.8, end: 0 },
            tint: [0xf0abfc, 0xc026d3, 0x7e22ce],
            lifespan: 240,
            quantity: 1,
            frequency: 35,
            blendMode: 'ADD',
        },

        trailOffset: { x: 14, y: 0 },
    },
};

/** 預設使用的 profile key */
export const DEFAULT_AIRCRAFT = 'S63HP';

/**
 * 根據 key 取得戰機 profile
 * @param {string} key - profile key（例如 'S63HP'）
 * @returns {object} 戰機 profile 物件
 */
export function getAircraftProfile(key) {
    return aircraftProfiles[key] || aircraftProfiles[DEFAULT_AIRCRAFT];
}

export default aircraftProfiles;
