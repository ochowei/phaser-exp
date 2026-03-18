/**
 * 戰機外觀 Profile 定義
 *
 * 每個 profile 描述一架戰機的外觀繪製指令、紋理尺寸，以及尾焰粒子設定。
 * 未來可在此檔案新增更多 profile，並透過 key 選擇使用。
 *
 * 直向捲軸版本：玩家朝上、敵人朝下
 */

const aircraftProfiles = {
    S63HP: {
        name: 'S-63 Hornet Plus',
        description: '藍色科幻蜂型戰機，配備橙色尾焰推進器（面朝上）',
        textureKey: 'playerTexture',
        textureSize: { width: 32, height: 32 },

        /**
         * 繪製戰機紋理（面朝上）
         * 原座標面朝右，旋轉 90° 逆時針：(x,y) → (y, 32-x)
         * @param {Phaser.GameObjects.Graphics} graphics - Phaser graphics 物件
         */
        draw(graphics) {
            // 深色機身外殼（面朝上）
            graphics.fillStyle(0x0f172a, 1);
            graphics.fillTriangle(16, 28, 4, 4, 28, 4);

            // 藍色核心機體
            graphics.fillStyle(0x2563eb, 1);
            graphics.fillTriangle(16, 24, 8, 8, 24, 8);

            // 淺藍色機翼（左翼 + 右翼）
            graphics.fillStyle(0x38bdf8, 1);
            graphics.fillTriangle(16, 25, 2, 12, 10, 10);
            graphics.fillTriangle(16, 25, 30, 12, 22, 10);

            // 淺色駕駛艙 / 感測器
            graphics.fillStyle(0xe0f2fe, 1);
            graphics.fillEllipse(16, 12, 10, 7);

            // 橙色排氣口（底部）
            graphics.fillStyle(0xf59e0b, 1);
            graphics.fillRect(12, 28, 8, 4);
        },

        /** 尾焰粒子設定（向下噴射） */
        trail: {
            speed: { min: 30, max: 120 },
            angle: { min: 60, max: 120 },
            scale: { start: 0.35, end: 0 },
            alpha: { start: 0.8, end: 0 },
            tint: [0xfff59d, 0xffc107, 0xff6f00],
            lifespan: 240,
            quantity: 1,
            frequency: 35,
            blendMode: 'ADD',
        },

        /** 尾焰跟隨偏移（底部） */
        trailOffset: { x: 0, y: 14 },
    },

    /** 普通敵機 — 紅色系，面朝下飛行 */
    EN_RED: {
        name: 'R-71 Crimson',
        description: '紅色敵方戰機，面朝下飛行',
        textureKey: 'enemy_normal',
        textureSize: { width: 32, height: 32 },
        hp: 1,

        draw(graphics) {
            // 深色機身外殼（面朝下）
            graphics.fillStyle(0x1a0000, 1);
            graphics.fillTriangle(16, 4, 4, 28, 28, 28);

            // 紅色核心機體
            graphics.fillStyle(0xdc2626, 1);
            graphics.fillTriangle(16, 8, 8, 24, 24, 24);

            // 暗紅色機翼（左翼 + 右翼）
            graphics.fillStyle(0xef4444, 1);
            graphics.fillTriangle(16, 7, 2, 20, 10, 12);
            graphics.fillTriangle(16, 7, 30, 20, 22, 12);

            // 淺紅駕駛艙 / 感測器
            graphics.fillStyle(0xfca5a5, 1);
            graphics.fillEllipse(16, 20, 10, 7);

            // 橙色排氣口（頂部）
            graphics.fillStyle(0xf59e0b, 1);
            graphics.fillRect(12, 0, 8, 4);
        },

        trail: {
            speed: { min: 30, max: 120 },
            angle: { min: 240, max: 300 },
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.7, end: 0 },
            tint: [0xff6666, 0xff3333, 0xcc0000],
            lifespan: 200,
            quantity: 1,
            frequency: 45,
            blendMode: 'ADD',
        },

        trailOffset: { x: 0, y: -14 },
    },

    /** 特殊敵機 — 紫色系，機翼更寬更具威脅感，面朝下 */
    EN_PURPLE: {
        name: 'X-99 Phantom',
        description: '紫色精英戰機，寬翼掠翼設計（面朝下）',
        textureKey: 'enemy_special',
        textureSize: { width: 32, height: 32 },
        hp: 3,

        draw(graphics) {
            // 深紫機身外殼（面朝下，更寬的掠翼輪廓）
            graphics.fillStyle(0x1a002e, 1);
            graphics.fillTriangle(16, 4, 2, 28, 30, 28);

            // 紫色核心機體
            graphics.fillStyle(0x9333ea, 1);
            graphics.fillTriangle(16, 8, 7, 24, 25, 24);

            // 洋紅色機翼（展幅更大）
            graphics.fillStyle(0xc026d3, 1);
            graphics.fillTriangle(16, 6, 0, 22, 10, 10);
            graphics.fillTriangle(16, 6, 32, 22, 22, 10);

            // 淺紫駕駛艙 / 感測器
            graphics.fillStyle(0xf0abfc, 1);
            graphics.fillEllipse(16, 20, 8, 6);

            // 粉紅排氣口（頂部，略大）
            graphics.fillStyle(0xf472b6, 1);
            graphics.fillRect(11, 0, 10, 5);
        },

        trail: {
            speed: { min: 30, max: 120 },
            angle: { min: 240, max: 300 },
            scale: { start: 0.35, end: 0 },
            alpha: { start: 0.8, end: 0 },
            tint: [0xf0abfc, 0xc026d3, 0x7e22ce],
            lifespan: 240,
            quantity: 1,
            frequency: 35,
            blendMode: 'ADD',
        },

        trailOffset: { x: 0, y: -14 },
    },

    /** 迷你Boss — 綠色系，體型較大，配備重裝甲，面朝下 */
    EN_BOSS_GREEN: {
        name: 'G-50 Leviathan',
        description: '綠色迷你Boss戰機，體型較大，配備重裝甲（面朝下）',
        textureKey: 'enemy_boss',
        textureSize: { width: 48, height: 48 },
        hp: 10,

        draw(graphics) {
            // 深色重裝甲外殼（面朝下，更大輪廓）
            graphics.fillStyle(0x003300, 1);
            graphics.fillTriangle(24, 6, 4, 42, 44, 42);

            // 綠色核心機體
            graphics.fillStyle(0x22c55e, 1);
            graphics.fillTriangle(24, 12, 10, 36, 38, 36);

            // 淺綠色機翼（左翼 + 右翼，展幅更大）
            graphics.fillStyle(0x4ade80, 1);
            graphics.fillTriangle(24, 10, 2, 34, 14, 14);
            graphics.fillTriangle(24, 10, 46, 34, 34, 14);

            // 淺色駕駛艙
            graphics.fillStyle(0xbbf7d0, 1);
            graphics.fillEllipse(24, 30, 14, 9);

            // 金色排氣口（頂部，較大）
            graphics.fillStyle(0xfbbf24, 1);
            graphics.fillRect(17, 2, 14, 6);
        },

        trail: {
            speed: { min: 40, max: 150 },
            angle: { min: 240, max: 300 },
            scale: { start: 0.45, end: 0 },
            alpha: { start: 0.8, end: 0 },
            tint: [0x4ade80, 0x22c55e, 0x166534],
            lifespan: 280,
            quantity: 2,
            frequency: 35,
            blendMode: 'ADD',
        },

        trailOffset: { x: 0, y: -20 },
    },

    /** 第1關Boss — 深紅色系，瞄準射擊，面朝下 */
    EN_BOSS_STAGE1: {
        name: 'Crimson Commander',
        description: '深紅色Boss戰機，精準瞄準射擊（面朝下）',
        textureKey: 'enemy_boss_stage1',
        textureSize: { width: 48, height: 48 },
        hp: 20,
        attackPattern: 'aimed',

        draw(graphics) {
            // 深紅重裝甲外殼（面朝下）
            graphics.fillStyle(0x4a0000, 1);
            graphics.fillTriangle(24, 6, 4, 42, 44, 42);

            // 赤紅核心機體
            graphics.fillStyle(0xdc2626, 1);
            graphics.fillTriangle(24, 12, 10, 36, 38, 36);

            // 亮紅機翼
            graphics.fillStyle(0xef4444, 1);
            graphics.fillTriangle(24, 10, 2, 34, 14, 14);
            graphics.fillTriangle(24, 10, 46, 34, 34, 14);

            // 淺紅駕駛艙
            graphics.fillStyle(0xfca5a5, 1);
            graphics.fillEllipse(24, 30, 14, 9);

            // 橙紅排氣口（頂部）
            graphics.fillStyle(0xff4500, 1);
            graphics.fillRect(17, 2, 14, 6);
        },

        trail: {
            speed: { min: 40, max: 150 },
            angle: { min: 240, max: 300 },
            scale: { start: 0.45, end: 0 },
            alpha: { start: 0.8, end: 0 },
            tint: [0xff6666, 0xdc2626, 0x8b0000],
            lifespan: 280,
            quantity: 2,
            frequency: 35,
            blendMode: 'ADD',
        },

        trailOffset: { x: 0, y: -20 },
    },

    /** 第2關Boss — 深紫色系，扇形散射，面朝下 */
    EN_BOSS_STAGE2: {
        name: 'Violet Overlord',
        description: '紫色Boss戰機，扇形散射攻擊（面朝下）',
        textureKey: 'enemy_boss_stage2',
        textureSize: { width: 48, height: 48 },
        hp: 30,
        attackPattern: 'scatter',

        draw(graphics) {
            // 深紫重裝甲外殼（面朝下）
            graphics.fillStyle(0x2d0054, 1);
            graphics.fillTriangle(24, 6, 4, 42, 44, 42);

            // 紫色核心機體
            graphics.fillStyle(0x7c3aed, 1);
            graphics.fillTriangle(24, 12, 10, 36, 38, 36);

            // 亮紫機翼
            graphics.fillStyle(0xa855f7, 1);
            graphics.fillTriangle(24, 10, 2, 34, 14, 14);
            graphics.fillTriangle(24, 10, 46, 34, 34, 14);

            // 淺紫駕駛艙
            graphics.fillStyle(0xe0b0ff, 1);
            graphics.fillEllipse(24, 30, 14, 9);

            // 紫色排氣口（頂部）
            graphics.fillStyle(0xc084fc, 1);
            graphics.fillRect(17, 2, 14, 6);
        },

        trail: {
            speed: { min: 40, max: 150 },
            angle: { min: 240, max: 300 },
            scale: { start: 0.45, end: 0 },
            alpha: { start: 0.8, end: 0 },
            tint: [0xe0b0ff, 0x7c3aed, 0x2d0054],
            lifespan: 280,
            quantity: 2,
            frequency: 35,
            blendMode: 'ADD',
        },

        trailOffset: { x: 0, y: -20 },
    },

    /** 第3關Boss — 墨綠/金色系，追蹤彈，面朝下 */
    EN_BOSS_STAGE3: {
        name: 'Emerald Tyrant',
        description: '墨綠色Boss戰機，發射追蹤子彈（面朝下）',
        textureKey: 'enemy_boss_stage3',
        textureSize: { width: 48, height: 48 },
        hp: 40,
        attackPattern: 'tracking',

        draw(graphics) {
            // 墨綠重裝甲外殼（面朝下）
            graphics.fillStyle(0x003d00, 1);
            graphics.fillTriangle(24, 6, 4, 42, 44, 42);

            // 翠綠核心機體
            graphics.fillStyle(0x16a34a, 1);
            graphics.fillTriangle(24, 12, 10, 36, 38, 36);

            // 亮綠機翼
            graphics.fillStyle(0x4ade80, 1);
            graphics.fillTriangle(24, 10, 2, 34, 14, 14);
            graphics.fillTriangle(24, 10, 46, 34, 34, 14);

            // 淺綠駕駛艙
            graphics.fillStyle(0xbbf7d0, 1);
            graphics.fillEllipse(24, 30, 14, 9);

            // 金色排氣口（頂部，加大 + 金色裝飾線）
            graphics.fillStyle(0xfbbf24, 1);
            graphics.fillRect(15, 1, 18, 7);
            // 金色裝飾條（水平）
            graphics.fillStyle(0xfbbf24, 1);
            graphics.fillRect(22, 8, 4, 30);
        },

        trail: {
            speed: { min: 40, max: 150 },
            angle: { min: 240, max: 300 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 0.85, end: 0 },
            tint: [0x4ade80, 0xfbbf24, 0x166534],
            lifespan: 320,
            quantity: 2,
            frequency: 30,
            blendMode: 'ADD',
        },

        trailOffset: { x: 0, y: -20 },
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
