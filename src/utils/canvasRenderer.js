/**
 * Phaser Graphics → HTML5 Canvas 2D 轉譯器
 *
 * 將 aircraftProfiles 中的 draw(graphics) 呼叫轉譯到原生 Canvas 2D，
 * 使 React 元件無需 Phaser 即可繪製戰機紋理。
 */

/**
 * 將 Phaser 數值色碼轉為 CSS hex 字串
 * @param {number} color - 例如 0xdc2626
 * @returns {string} 例如 '#dc2626'
 */
function toHexColor(color) {
    return `#${color.toString(16).padStart(6, '0')}`;
}

/**
 * 建立模擬 Phaser.GameObjects.Graphics 的物件，
 * 所有繪圖指令會轉發到指定的 Canvas 2D context。
 * @param {CanvasRenderingContext2D} ctx
 * @returns {object} 模擬 graphics 物件
 */
function createMockGraphics(ctx) {
    return {
        fillStyle(color, alpha = 1) {
            ctx.fillStyle = toHexColor(color);
            ctx.globalAlpha = alpha;
        },

        fillTriangle(x1, y1, x2, y2, x3, y3) {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.closePath();
            ctx.fill();
        },

        fillRect(x, y, w, h) {
            ctx.fillRect(x, y, w, h);
        },

        fillEllipse(cx, cy, width, height) {
            ctx.beginPath();
            ctx.ellipse(cx, cy, width / 2, height / 2, 0, 0, Math.PI * 2);
            ctx.fill();
        },
    };
}

/**
 * 將戰機 profile 繪製到 canvas 上
 * @param {object} profile - aircraftProfiles 中的 profile 物件
 * @param {HTMLCanvasElement} canvas - 目標 canvas 元素
 */
export function renderProfileToCanvas(profile, canvas) {
    const { width, height } = profile.textureSize;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);

    const mockGraphics = createMockGraphics(ctx);
    profile.draw(mockGraphics);

    ctx.globalAlpha = 1;
}
