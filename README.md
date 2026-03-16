# Phaser 射擊遊戲原型

一款使用 [Phaser 3](https://phaser.io/) 框架開發的瀏覽器太空射擊遊戲，採用模組化架構設計。

## 截圖

```
[ 開始畫面 ]      [ 模式選擇 ]        [ 遊戲畫面 ]
  Phaser Shooter    無盡模式            ★  ★  ★  ★  ★
  [Start Game]      [Endless Mode]      Score: 120
  [About Phaser]    [Stage Mode] 🚧        ▶ PLAYER
                                        ●●●  ENEMY  ●●●
```

## 功能特色

- **視差捲動背景** — 三層星空以不同速度滾動，營造深度感
- **遊戲模式** — 無盡模式（可遊玩）與關卡模式（開發中）
- **玩家移動** — 支援 WASD 或方向鍵操控；行動裝置支援虛擬搖桿
- **射擊系統** — 預設單發，拾取道具可升級為三連發（持續 10 秒）
- **兩種敵人** — 普通紅色敵人與攜帶道具的紫色特殊敵人（20% 出現率）
- **道具系統** — 拾取道具獲得三連發能力及 50 分加成
- **特效** — 碰撞時觸發鏡頭震動與閃爍特效
- **分數系統** — 即時計分，最高分存入瀏覽器 `localStorage` 持久保存
- **遊戲結束畫面** — 支援重新開始或返回主選單

## 專案結構

```
phaser-exp/
├── index.html          # 頁面入口
├── package.json        # 依賴套件與腳本
└── src/
    ├── main.js         # 遊戲初始化與設定
    ├── scenes/
    │   ├── StartScene.js       # 開始畫面
    │   ├── ModeSelectScene.js  # 模式選擇畫面（無盡 / 關卡）
    │   └── MainScene.js        # 主遊戲場景
    └── objects/
        ├── Player.js       # 玩家物件
        ├── Enemy.js        # 敵人物件
        ├── Bullet.js       # 子彈物件
        └── Powerup.js      # 道具物件
```

## 快速開始

### 環境需求

- [Node.js](https://nodejs.org/) 18 以上

### 安裝與啟動

```bash
# 安裝依賴
npm install

# 啟動開發伺服器（支援熱重載）
npm run dev
```

開啟瀏覽器前往 `http://localhost:5173` 即可遊玩。

### 建置正式版

```bash
# 建置至 dist/ 資料夾
npm run build

# 在本地預覽正式版
npm run preview
```

## 遊戲設定

| 參數 | 數值 |
|------|------|
| 畫布尺寸 | 800 × 600 px |
| 物理引擎 | Arcade Physics |
| 玩家速度 | 300 px/s |
| 子彈速度 | 600 px/s |
| 射擊間隔 | 180 ms |
| 敵人生成率 | 每秒 1 隻 |
| 三連發持續時間 | 10 秒 |
| 擊殺得分 | 10 分 |
| 拾取道具得分 | 50 分 |

## 技術棧

| 技術 | 版本 | 用途 |
|------|------|------|
| [Phaser 3](https://phaser.io/) | 3.90.0 | 遊戲框架（渲染、物理、輸入） |
| [Vite](https://vitejs.dev/) | 7.3.1 | 開發伺服器與打包工具 |
| ES6 Modules | — | 模組化程式碼管理 |

## 授權

本專案採用 [MIT License](LICENSE)。
