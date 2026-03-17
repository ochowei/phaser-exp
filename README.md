# Phaser 射擊遊戲原型

一款使用 [Phaser 3](https://phaser.io/) 框架開發的瀏覽器太空射擊遊戲，採用模組化架構設計。

## 截圖

```
[ 開始畫面 ]      [ 模式選擇 ]        [ 遊戲畫面 ]
  SPACE SHOOTER     無盡模式            ★  ★  ★  ★  ★
  [Start Game]      [Endless Mode]      Score: 120  HP: ❤️❤️❤️
  [Options]         [Stage Mode] 🚧        ▶ PLAYER
                                        ●●●  ENEMY  ●●●
```

## 功能特色

- **視差捲動背景** — 三層星空以不同速度滾動，營造深度感
- **遊戲模式** — 無盡模式（可遊玩）與關卡模式（開發中）
- **玩家移動** — 支援 WASD 或方向鍵操控；行動裝置支援虛擬搖桿
- **射擊系統** — 預設單發，拾取道具可升級為三連發（持續 10 秒）
- **HP 系統** — 玩家擁有 3 條命，受傷後短暫無敵（1 秒閃爍）
- **兩種敵人** — 普通紅色敵人（R-71 Crimson）與攜帶道具的紫色特殊敵人（X-99 Phantom，20% 出現率）
- **飛機外觀 Profile** — 模組化的戰機外觀定義系統，支援自訂繪製、尾焰粒子效果
- **道具系統** — 拾取道具獲得三連發能力及 50 分加成
- **特效** — 碰撞時觸發鏡頭震動與閃爍特效
- **分數系統** — 即時計分，最高分存入瀏覽器 `localStorage` 持久保存
- **暫停功能** — 按 P / ESC 或右上角按鈕暫停，暫停時可返回主選單
- **背景音樂** — 選單與遊戲各有獨立 BGM，支援音量調節與靜音
- **設定畫面** — 可調整 BGM 音量、靜音切換
- **多語系** — 支援中文 / 英文切換，語言偏好存入 `localStorage`
- **遊戲結束畫面** — 支援重新開始或返回主選單

## 專案結構

```
phaser-exp/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI（測試 + 建置）
├── eslint.config.js        # ESLint 設定（flat config）
├── index.html              # 頁面入口
├── package.json            # 依賴套件與腳本
├── public/
│   └── assets/
│       └── audio/          # 音效資源
│           ├── bgm_menu.wav
│           └── bgm_game.wav
└── src/
    ├── main.js             # 遊戲初始化與設定
    ├── i18n.js             # 多語系（中 / 英）
    ├── profiles/
    │   └── aircraftProfiles.js  # 戰機外觀 Profile 定義
    ├── scenes/
    │   ├── StartScene.js        # 開始畫面
    │   ├── ModeSelectScene.js   # 模式選擇畫面（無盡 / 關卡）
    │   ├── OptionScene.js       # 設定畫面（音量 / 語言）
    │   └── MainScene.js         # 主遊戲場景
    ├── objects/
    │   ├── Player.js       # 玩家物件
    │   ├── Enemy.js        # 敵人物件
    │   ├── Bullet.js       # 子彈物件
    │   └── Powerup.js      # 道具物件
    └── __tests__/
        ├── i18n.test.js              # i18n 模組單元測試
        └── aircraftProfiles.test.js  # 戰機 Profile 單元測試
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

### 執行測試

```bash
# 執行所有單元測試
npm test

# 以 watch 模式執行測試
npm run test:watch
```

### 程式碼檢查

```bash
# 檢查程式碼風格
npm run lint

# 自動修正可修復的問題
npm run lint:fix
```

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
| 玩家 HP | 3（受傷後無敵 1 秒） |
| 子彈速度 | 600 px/s |
| 射擊間隔 | 260 ms |
| 敵人生成率 | 每秒 1 隻 |
| 特殊敵人出現率 | 20% |
| 三連發持續時間 | 10 秒 |
| 擊殺得分 | 10 分 |
| 拾取道具得分 | 50 分 |

## 技術棧

| 技術 | 版本 | 用途 |
|------|------|------|
| [Phaser 3](https://phaser.io/) | 3.90.0 | 遊戲框架（渲染、物理、輸入） |
| [Vite](https://vitejs.dev/) | 7.3.1 | 開發伺服器與打包工具 |
| [Vitest](https://vitest.dev/) | 4.1.0 | 單元測試框架 |
| [ESLint](https://eslint.org/) | 10.0.3 | 程式碼風格檢查 |
| ES6 Modules | — | 模組化程式碼管理 |

## 授權

本專案採用 [MIT License](LICENSE)。
