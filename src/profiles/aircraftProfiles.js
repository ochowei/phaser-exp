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
        name: 'R-82 Ironwing',
        description: '紅棕色重裝戰鬥機，寬翼設計配備雙砲管與大型推進器（面朝上）',
        textureKey: 'playerTexture',
        textureSize: { width: 48, height: 48 },

        /**
         * 繪製戰機紋理（面朝上）
         * 紅棕色重型戰鬥機，參考經典紅色戰機外觀
         * @param {Phaser.GameObjects.Graphics} graphics - Phaser graphics 物件
         */
        draw(graphics) {
            // ── 機身主體輪廓（最底層，深褐色） ──
            graphics.fillStyle(0x1a0a08, 1);
            graphics.fillTriangle(24, 42, 2, 8, 46, 8);

            // ── 後掠主翼（左） ──
            graphics.fillStyle(0x8b3a2a, 1);
            graphics.fillTriangle(24, 14, 0, 34, 16, 20);

            // ── 後掠主翼（右） ──
            graphics.fillStyle(0x8b3a2a, 1);
            graphics.fillTriangle(24, 14, 48, 34, 32, 20);

            // ── 翼端裝甲板（左） ──
            graphics.fillStyle(0x5c2118, 1);
            graphics.fillRect(0, 24, 8, 14);

            // ── 翼端裝甲板（右） ──
            graphics.fillRect(40, 24, 8, 14);

            // ── 翼端砲管（左，灰色） ──
            graphics.fillStyle(0x555555, 1);
            graphics.fillRect(1, 8, 4, 18);

            // ── 翼端砲管（右，灰色） ──
            graphics.fillRect(43, 8, 4, 18);

            // ── 砲管尖端（左，深灰） ──
            graphics.fillStyle(0x333333, 1);
            graphics.fillRect(1, 6, 4, 4);

            // ── 砲管尖端（右，深灰） ──
            graphics.fillRect(43, 6, 4, 4);

            // ── 砲口發光（左，淡藍） ──
            graphics.fillStyle(0x66bbff, 1);
            graphics.fillRect(2, 6, 2, 2);

            // ── 砲口發光（右，淡藍） ──
            graphics.fillRect(44, 6, 2, 2);

            // ── 深紅主機身裝甲 ──
            graphics.fillStyle(0x9b3030, 1);
            graphics.fillTriangle(24, 38, 10, 12, 38, 12);

            // ── 機身中央裝甲層（深紅棕） ──
            graphics.fillStyle(0x7a2828, 1);
            graphics.fillTriangle(24, 34, 14, 14, 34, 14);

            // ── 機身中央脊線（暗色） ──
            graphics.fillStyle(0x3d1515, 1);
            graphics.fillRect(22, 12, 4, 24);

            // ── 橫向裝甲加強條（上方） ──
            graphics.fillStyle(0x6b2020, 1);
            graphics.fillRect(12, 18, 24, 2);

            // ── 橫向裝甲加強條（下方） ──
            graphics.fillRect(14, 30, 20, 2);

            // ── 機翼連接處裝甲（左） ──
            graphics.fillStyle(0x4a1a12, 1);
            graphics.fillRect(6, 20, 8, 8);

            // ── 機翼連接處裝甲（右） ──
            graphics.fillRect(34, 20, 8, 8);

            // ── 駕駛艙外框（暗色橢圓） ──
            graphics.fillStyle(0x3d1515, 1);
            graphics.fillEllipse(24, 16, 14, 10);

            // ── 駕駛艙（暗紅色光澤） ──
            graphics.fillStyle(0xcc5544, 1);
            graphics.fillEllipse(24, 16, 10, 7);

            // ── 駕駛艙高光 ──
            graphics.fillStyle(0xdd8877, 1);
            graphics.fillEllipse(24, 14, 6, 4);

            // ── 機頭感測器/天線塔基座 ──
            graphics.fillStyle(0x444444, 1);
            graphics.fillRect(21, 4, 6, 8);

            // ── 天線塔頂（圓柱形） ──
            graphics.fillStyle(0x555555, 1);
            graphics.fillRect(22, 0, 4, 6);

            // ── 天線塔砲口（頂部圓形灰色） ──
            graphics.fillStyle(0x666666, 1);
            graphics.fillEllipse(24, 2, 6, 4);

            // ── 引擎噴口外框（底部中央） ──
            graphics.fillStyle(0x333333, 1);
            graphics.fillEllipse(24, 42, 14, 10);

            // ── 引擎噴口內圈（深灰） ──
            graphics.fillStyle(0x444444, 1);
            graphics.fillEllipse(24, 42, 10, 7);

            // ── 引擎噴口光芯（橙紅） ──
            graphics.fillStyle(0xff6622, 1);
            graphics.fillEllipse(24, 43, 6, 4);

            // ── 引擎最亮核心（亮橙） ──
            graphics.fillStyle(0xffaa44, 1);
            graphics.fillEllipse(24, 43, 3, 2);

            // ── 小翼尖端（左，向外延伸的尖翼） ──
            graphics.fillStyle(0x6b2020, 1);
            graphics.fillTriangle(0, 36, 6, 30, 8, 36);

            // ── 小翼尖端（右，向外延伸的尖翼） ──
            graphics.fillTriangle(48, 36, 42, 30, 40, 36);
        },

        /** 尾焰粒子設定（向下噴射） */
        trail: {
            speed: { min: 40, max: 140 },
            angle: { min: 60, max: 120 },
            scale: { start: 0.45, end: 0 },
            alpha: { start: 0.85, end: 0 },
            tint: [0xffaa44, 0xff6622, 0xcc2200],
            lifespan: 280,
            quantity: 2,
            frequency: 30,
            blendMode: 'ADD',
        },

        /** 尾焰跟隨偏移（底部） */
        trailOffset: { x: 0, y: 22 },
    },

    /** 普通敵機 — 紅色系，面朝下飛行 */
    EN_RED: {
        name: 'R-71 Crimson',
        description: '紅色敵方戰機，面朝下飛行',
        textureKey: 'enemy_normal',
        textureSize: { width: 32, height: 32 },
        hp: 1,

        draw(graphics) {
            // 外部黑色輪廓
            graphics.fillStyle(0x0d0000, 1);
            graphics.fillTriangle(16, 3, 1, 30, 31, 30);

            // 深紅主機身裝甲
            graphics.fillStyle(0x7f1d1d, 1);
            graphics.fillTriangle(16, 7, 5, 27, 27, 27);

            // 銳角後掠翼（左）
            graphics.fillStyle(0xb91c1c, 1);
            graphics.fillTriangle(16, 9, 0, 28, 11, 17);

            // 銳角後掠翼（右）
            graphics.fillStyle(0xb91c1c, 1);
            graphics.fillTriangle(16, 9, 32, 28, 21, 17);

            // 翼端裝甲塊（左）
            graphics.fillStyle(0x450a0a, 1);
            graphics.fillRect(0, 22, 5, 7);

            // 翼端裝甲塊（右）
            graphics.fillRect(27, 22, 5, 7);

            // 核心機身（亮紅）
            graphics.fillStyle(0xef4444, 1);
            graphics.fillTriangle(16, 11, 9, 24, 23, 24);

            // 翼端砲管，指向下方（左）
            graphics.fillStyle(0xff6000, 1);
            graphics.fillRect(1, 28, 3, 4);

            // 翼端砲管，指向下方（右）
            graphics.fillRect(28, 28, 3, 4);

            // 機頭感測器（發光）
            graphics.fillStyle(0xfca5a5, 1);
            graphics.fillEllipse(16, 22, 9, 6);

            // 引擎噴口外框（頂部）
            graphics.fillStyle(0x4a0000, 1);
            graphics.fillRect(10, 0, 12, 5);

            // 引擎噴焰
            graphics.fillStyle(0xff4500, 1);
            graphics.fillRect(11, 0, 10, 4);

            // 引擎光芯（橙色）
            graphics.fillStyle(0xffa500, 1);
            graphics.fillRect(13, 0, 6, 2);

            // 引擎最亮核心（黃色）
            graphics.fillStyle(0xffee00, 1);
            graphics.fillRect(14, 0, 4, 1);
        },

        trail: {
            speed: { min: 40, max: 140 },
            angle: { min: 240, max: 300 },
            scale: { start: 0.35, end: 0 },
            alpha: { start: 0.85, end: 0 },
            tint: [0xffcc44, 0xff4400, 0xcc0000],
            lifespan: 220,
            quantity: 2,
            frequency: 35,
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
            // 超寬三角輪廓（大δ翼）
            graphics.fillStyle(0x0d0018, 1);
            graphics.fillTriangle(16, 3, 0, 30, 32, 30);

            // 深紫主機身
            graphics.fillStyle(0x4c1d95, 1);
            graphics.fillTriangle(16, 7, 5, 28, 27, 28);

            // 大展弦比後掠翼（左）
            graphics.fillStyle(0x6d28d9, 1);
            graphics.fillTriangle(16, 8, 0, 26, 12, 16);

            // 大展弦比後掠翼（右）
            graphics.fillStyle(0x6d28d9, 1);
            graphics.fillTriangle(16, 8, 32, 26, 20, 16);

            // 翼端推進器艙（左）
            graphics.fillStyle(0x2e1065, 1);
            graphics.fillRect(0, 20, 7, 9);

            // 翼端推進器艙（右）
            graphics.fillRect(25, 20, 7, 9);

            // 推進器噴口光（左）
            graphics.fillStyle(0xd946ef, 1);
            graphics.fillRect(1, 20, 5, 3);

            // 推進器噴口光（右）
            graphics.fillRect(26, 20, 5, 3);

            // 核心能量艙（亮紫）
            graphics.fillStyle(0xa855f7, 1);
            graphics.fillTriangle(16, 11, 9, 25, 23, 25);

            // 能量核心感測器（發光）
            graphics.fillStyle(0xe879f9, 1);
            graphics.fillEllipse(16, 21, 10, 7);

            // 核心光點（最亮）
            graphics.fillStyle(0xfaf5ff, 1);
            graphics.fillEllipse(16, 21, 5, 3);

            // 雙引擎噴口（頂部左）
            graphics.fillStyle(0x3b0764, 1);
            graphics.fillRect(7, 0, 7, 6);

            // 雙引擎噴口（頂部右）
            graphics.fillRect(18, 0, 7, 6);

            // 引擎光（左）
            graphics.fillStyle(0xc026d3, 1);
            graphics.fillRect(8, 0, 5, 4);

            // 引擎光（右）
            graphics.fillRect(19, 0, 5, 4);

            // 引擎核心（左）
            graphics.fillStyle(0xf0abfc, 1);
            graphics.fillRect(9, 0, 3, 2);

            // 引擎核心（右）
            graphics.fillRect(20, 0, 3, 2);
        },

        trail: {
            speed: { min: 35, max: 130 },
            angle: { min: 240, max: 300 },
            scale: { start: 0.4, end: 0 },
            alpha: { start: 0.85, end: 0 },
            tint: [0xf0abfc, 0xd946ef, 0x7e22ce],
            lifespan: 260,
            quantity: 2,
            frequency: 30,
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
            // 外部黑色輪廓
            graphics.fillStyle(0x001400, 1);
            graphics.fillTriangle(24, 4, 2, 44, 46, 44);

            // 深綠主裝甲機身
            graphics.fillStyle(0x14532d, 1);
            graphics.fillTriangle(24, 10, 9, 40, 39, 40);

            // 主翼（左）
            graphics.fillStyle(0x166534, 1);
            graphics.fillTriangle(24, 12, 0, 38, 14, 20);

            // 主翼（右）
            graphics.fillStyle(0x166534, 1);
            graphics.fillTriangle(24, 12, 48, 38, 34, 20);

            // 側翼砲台平台（左）
            graphics.fillStyle(0x052e16, 1);
            graphics.fillRect(0, 26, 10, 14);

            // 側翼砲台平台（右）
            graphics.fillRect(38, 26, 10, 14);

            // 側砲管（左）
            graphics.fillStyle(0x4ade80, 1);
            graphics.fillRect(1, 38, 4, 8);

            // 側砲管（右）
            graphics.fillRect(43, 38, 4, 8);

            // 核心艙體（亮綠）
            graphics.fillStyle(0x22c55e, 1);
            graphics.fillTriangle(24, 16, 13, 37, 35, 37);

            // 駕駛艙（發光）
            graphics.fillStyle(0xbbf7d0, 1);
            graphics.fillEllipse(24, 30, 16, 10);

            // 能量爐核心
            graphics.fillStyle(0x4ade80, 1);
            graphics.fillEllipse(24, 30, 9, 6);

            // 金色橫向裝甲紋路
            graphics.fillStyle(0xfbbf24, 1);
            graphics.fillRect(10, 20, 28, 2);

            // 三聯引擎外框（頂部左）
            graphics.fillStyle(0x022c22, 1);
            graphics.fillRect(7, 0, 9, 8);

            // 三聯引擎外框（頂部中）
            graphics.fillRect(20, 0, 8, 8);

            // 三聯引擎外框（頂部右）
            graphics.fillRect(32, 0, 9, 8);

            // 引擎光芯（左）
            graphics.fillStyle(0x86efac, 1);
            graphics.fillRect(9, 0, 5, 5);

            // 引擎光芯（中）
            graphics.fillRect(22, 0, 4, 5);

            // 引擎光芯（右）
            graphics.fillRect(34, 0, 5, 5);

            // 引擎最亮點（左）
            graphics.fillStyle(0xfbbf24, 1);
            graphics.fillRect(10, 0, 3, 2);

            // 引擎最亮點（中）
            graphics.fillRect(23, 0, 2, 2);

            // 引擎最亮點（右）
            graphics.fillRect(35, 0, 3, 2);
        },

        trail: {
            speed: { min: 40, max: 160 },
            angle: { min: 240, max: 300 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 0.85, end: 0 },
            tint: [0x86efac, 0x22c55e, 0x166534],
            lifespan: 300,
            quantity: 3,
            frequency: 30,
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
            // 厚重裝甲輪廓
            graphics.fillStyle(0x1c0000, 1);
            graphics.fillTriangle(24, 4, 2, 44, 46, 44);

            // 深紅主裝甲機身
            graphics.fillStyle(0x7f1d1d, 1);
            graphics.fillTriangle(24, 10, 9, 40, 39, 40);

            // 後掠主翼（左）
            graphics.fillStyle(0xb91c1c, 1);
            graphics.fillTriangle(24, 11, 0, 40, 15, 19);

            // 後掠主翼（右）
            graphics.fillStyle(0xb91c1c, 1);
            graphics.fillTriangle(24, 11, 48, 40, 33, 19);

            // 翼端重型砲台（左）
            graphics.fillStyle(0x450a0a, 1);
            graphics.fillRect(0, 28, 11, 14);

            // 翼端重型砲台（右）
            graphics.fillRect(37, 28, 11, 14);

            // 主砲管（底部中央，指向玩家）
            graphics.fillStyle(0xff4500, 1);
            graphics.fillRect(20, 40, 8, 8);

            // 副砲管（左砲台）
            graphics.fillStyle(0xff6600, 1);
            graphics.fillRect(2, 40, 4, 6);

            // 副砲管（右砲台）
            graphics.fillRect(42, 40, 4, 6);

            // 裝甲核心機身
            graphics.fillStyle(0xdc2626, 1);
            graphics.fillTriangle(24, 16, 13, 38, 35, 38);

            // 指揮艙（發光）
            graphics.fillStyle(0xfca5a5, 1);
            graphics.fillEllipse(24, 30, 16, 10);

            // 瞄準器核心（紅色發光）
            graphics.fillStyle(0xff0000, 1);
            graphics.fillEllipse(24, 30, 8, 5);

            // 橫向裝甲加強條
            graphics.fillStyle(0x991b1b, 1);
            graphics.fillRect(9, 22, 30, 3);

            // 雙引擎組外框（頂部左）
            graphics.fillStyle(0x4a0000, 1);
            graphics.fillRect(7, 0, 11, 9);

            // 雙引擎組外框（頂部右）
            graphics.fillRect(30, 0, 11, 9);

            // 引擎噴焰（左）
            graphics.fillStyle(0xff4500, 1);
            graphics.fillRect(9, 0, 7, 6);

            // 引擎噴焰（右）
            graphics.fillRect(32, 0, 7, 6);

            // 引擎光芯（左）
            graphics.fillStyle(0xff8c00, 1);
            graphics.fillRect(10, 0, 5, 4);

            // 引擎光芯（右）
            graphics.fillRect(33, 0, 5, 4);

            // 引擎核心最亮（左）
            graphics.fillStyle(0xffee00, 1);
            graphics.fillRect(12, 0, 2, 2);

            // 引擎核心最亮（右）
            graphics.fillRect(34, 0, 2, 2);
        },

        trail: {
            speed: { min: 40, max: 160 },
            angle: { min: 240, max: 300 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 0.85, end: 0 },
            tint: [0xff8844, 0xdc2626, 0x8b0000],
            lifespan: 300,
            quantity: 3,
            frequency: 30,
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
            // 超寬機體輪廓
            graphics.fillStyle(0x0f0020, 1);
            graphics.fillTriangle(24, 4, 0, 44, 48, 44);

            // 深紫主機身
            graphics.fillStyle(0x3b0764, 1);
            graphics.fillTriangle(24, 9, 8, 41, 40, 41);

            // 超大後掠翼（左，達邊緣）
            graphics.fillStyle(0x5b21b6, 1);
            graphics.fillTriangle(24, 10, 0, 42, 16, 18);

            // 超大後掠翼（右，達邊緣）
            graphics.fillStyle(0x5b21b6, 1);
            graphics.fillTriangle(24, 10, 48, 42, 32, 18);

            // 散射砲座（左）
            graphics.fillStyle(0x2e1065, 1);
            graphics.fillRect(0, 29, 13, 15);

            // 散射砲座（右）
            graphics.fillRect(35, 29, 13, 15);

            // 多管散射砲（左外）
            graphics.fillStyle(0xc084fc, 1);
            graphics.fillRect(1, 42, 4, 6);

            // 多管散射砲（左內）
            graphics.fillRect(7, 40, 4, 6);

            // 多管散射砲（右內）
            graphics.fillRect(37, 40, 4, 6);

            // 多管散射砲（右外）
            graphics.fillRect(43, 42, 4, 6);

            // 核心機身（亮紫）
            graphics.fillStyle(0x7c3aed, 1);
            graphics.fillTriangle(24, 15, 12, 39, 36, 39);

            // 能量充能核心（大）
            graphics.fillStyle(0xe0b0ff, 1);
            graphics.fillEllipse(24, 30, 20, 13);

            // 充能核心光點
            graphics.fillStyle(0xfaf5ff, 1);
            graphics.fillEllipse(24, 30, 10, 6);

            // 散射能量導管（水平橫線）
            graphics.fillStyle(0xa855f7, 1);
            graphics.fillRect(0, 27, 48, 3);

            // 四聯引擎（頂部，等距排列）
            graphics.fillStyle(0x1e1b4b, 1);
            graphics.fillRect(4, 0, 8, 7);
            graphics.fillRect(14, 0, 8, 7);
            graphics.fillRect(26, 0, 8, 7);
            graphics.fillRect(36, 0, 8, 7);

            // 引擎發光（左兩組）
            graphics.fillStyle(0xa78bfa, 1);
            graphics.fillRect(5, 0, 6, 5);
            graphics.fillRect(15, 0, 6, 5);

            // 引擎發光（右兩組）
            graphics.fillRect(27, 0, 6, 5);
            graphics.fillRect(37, 0, 6, 5);

            // 引擎核心
            graphics.fillStyle(0xe0b0ff, 1);
            graphics.fillRect(7, 0, 2, 3);
            graphics.fillRect(17, 0, 2, 3);
            graphics.fillRect(29, 0, 2, 3);
            graphics.fillRect(39, 0, 2, 3);
        },

        trail: {
            speed: { min: 40, max: 160 },
            angle: { min: 240, max: 300 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 0.85, end: 0 },
            tint: [0xe0b0ff, 0x7c3aed, 0x3b0764],
            lifespan: 310,
            quantity: 3,
            frequency: 28,
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
            // 流線型輪廓
            graphics.fillStyle(0x001a00, 1);
            graphics.fillTriangle(24, 4, 3, 44, 45, 44);

            // 深綠主機身
            graphics.fillStyle(0x064e3b, 1);
            graphics.fillTriangle(24, 9, 11, 40, 37, 40);

            // 主翼（左）
            graphics.fillStyle(0x047857, 1);
            graphics.fillTriangle(24, 11, 0, 38, 15, 19);

            // 主翼（右）
            graphics.fillStyle(0x047857, 1);
            graphics.fillTriangle(24, 11, 48, 38, 33, 19);

            // 追蹤飛彈艙（左翼下掛架）
            graphics.fillStyle(0x022c22, 1);
            graphics.fillRect(0, 25, 9, 17);

            // 追蹤飛彈艙（右翼下掛架）
            graphics.fillRect(39, 25, 9, 17);

            // 飛彈彈頭（金色，左）
            graphics.fillStyle(0xfbbf24, 1);
            graphics.fillRect(1, 40, 7, 4);

            // 飛彈彈頭（金色，右）
            graphics.fillRect(40, 40, 7, 4);

            // 核心機身（翠綠）
            graphics.fillStyle(0x16a34a, 1);
            graphics.fillTriangle(24, 16, 14, 38, 34, 38);

            // 追蹤雷達艙（大橢圓，發光）
            graphics.fillStyle(0x86efac, 1);
            graphics.fillEllipse(24, 30, 20, 13);

            // 雷達核心（金色）
            graphics.fillStyle(0xfbbf24, 1);
            graphics.fillEllipse(24, 30, 10, 6);

            // 雷達掃描核（最亮）
            graphics.fillStyle(0xfef9c3, 1);
            graphics.fillEllipse(24, 30, 4, 3);

            // 中央能量脊線（縱向）
            graphics.fillStyle(0x4ade80, 1);
            graphics.fillRect(22, 10, 4, 28);

            // 金色橫向裝甲條（上）
            graphics.fillStyle(0xfbbf24, 1);
            graphics.fillRect(11, 21, 26, 2);

            // 金色橫向裝甲條（下）
            graphics.fillRect(11, 35, 26, 2);

            // 三重引擎外框（頂部左）
            graphics.fillStyle(0x022c22, 1);
            graphics.fillRect(7, 0, 9, 9);

            // 三重引擎外框（頂部中）
            graphics.fillRect(20, 0, 8, 9);

            // 三重引擎外框（頂部右）
            graphics.fillRect(32, 0, 9, 9);

            // 引擎內核（左）
            graphics.fillStyle(0x4ade80, 1);
            graphics.fillRect(9, 0, 5, 6);

            // 引擎內核（中）
            graphics.fillRect(22, 0, 4, 6);

            // 引擎內核（右）
            graphics.fillRect(34, 0, 5, 6);

            // 引擎金色光芯（左）
            graphics.fillStyle(0xfbbf24, 1);
            graphics.fillRect(10, 0, 3, 3);

            // 引擎金色光芯（中）
            graphics.fillRect(23, 0, 2, 3);

            // 引擎金色光芯（右）
            graphics.fillRect(35, 0, 3, 3);
        },

        trail: {
            speed: { min: 45, max: 170 },
            angle: { min: 240, max: 300 },
            scale: { start: 0.55, end: 0 },
            alpha: { start: 0.9, end: 0 },
            tint: [0x86efac, 0xfbbf24, 0x16a34a],
            lifespan: 340,
            quantity: 3,
            frequency: 25,
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
