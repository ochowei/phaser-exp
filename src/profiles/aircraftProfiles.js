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
