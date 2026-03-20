# Phaser 射擊遊戲原型

一款使用 [Phaser 3](https://phaser.io/) 框架開發的瀏覽器直向捲軸太空射擊遊戲，採用模組化架構設計。

## 截圖

```
[ 開始畫面 ]      [ 模式選擇 ]        [ 遊戲畫面（直向捲軸）]
  SPACE SHOOTER     無盡模式            Score: 120  HP: ❤️❤️❤️
  [Start Game]      [Endless Mode]        ●●● ENEMY ●●●
  [Bestiary]        [Stage Mode]             ▼ ▼ ▼
  [Options]                                ▲ PLAYER ▲

[ 關卡選擇 ]      [ 關卡模式 ]
  SELECT STAGE      BOSS HP ████░░
  [1] Asteroid Belt ✓    ●●● BOSS ●●●
  [2] Nebula Frontier        ▼ ▼ ▼
  [3] Dark Core 🔒       ▲ PLAYER ▲
```

## 功能特色

- **直向視差捲動背景** — 三層星空由上往下以不同速度滾動，營造深度感
- **遊戲模式** — 無盡模式與關卡模式（3 關，混合波次制 + Boss 戰）
- **玩家移動** — 支援 WASD 或方向鍵操控；行動裝置支援虛擬搖桿
- **射擊系統** — 預設單發，拾取道具可升級為三連發（持續 10 秒）
- **HP 系統** — 玩家擁有 3 條命，受傷後短暫無敵（1 秒閃爍）
- **三種敵人** — 普通紅色敵人（R-71 Crimson, 1 HP）、攜帶道具的紫色特殊敵人（X-99 Phantom, 3 HP，20% 出現率）、迷你Boss（G-50 Leviathan, 10 HP，每 30 秒出現）
- **關卡模式** — 3 個關卡，各有預設波次與獨特 Boss（瞄準射擊 / 扇形散射 / 追蹤彈），關卡選擇畫面支援解鎖進度與重玩
- **關卡 Boss** — Crimson Commander（20 HP）、Violet Overlord（30 HP）、Emerald Tyrant（40 HP），各有獨特攻擊模式
- **敵人血量差異** — 不同敵機擁有不同血量，HP > 1 的敵人會顯示血條
- **迷你Boss** — 綠色大型戰機，擁有 10 HP 血條、會發射紅色子彈，擊敗獲 100 分及道具掉落
- **飛機外觀 Profile** — 模組化的戰機外觀定義系統，支援自訂繪製、尾焰粒子效果
- **道具系統** — 拾取道具獲得三連發能力及 50 分加成
- **特效** — 碰撞時觸發鏡頭震動與閃爍特效
- **分數系統** — 即時計分，最高分存入瀏覽器 `localStorage` 持久保存
- **暫停功能** — 按 P / ESC 或右上角按鈕暫停，暫停時可返回主選單
- **背景音樂** — 選單與遊戲各有獨立 BGM，支援音量調節與靜音
- **敵人圖鑑** — 可從主選單瀏覽所有 6 種敵人的外觀預覽、血量、分數與攻擊方式
- **設定畫面** — 可調整 BGM 音量、靜音切換
- **React + Phaser 混搭架構** — 開始畫面、模式選擇、設定、關卡選擇畫面均使用 React 組件渲染（CSS 動畫星空），進入遊戲後才初始化 Phaser
- **響應式設計** — 遊戲畫面自動縮放以適應任何視窗大小（桌面、平板、手機），維持 4:3 比例
- **載入提示** — 頁面開啟時顯示載入動畫，React 初始化完成後自動消失
- **多語系** — 支援中文 / 英文切換，語言偏好存入 `localStorage`
- **遊戲結束畫面** — 支援重新開始或返回主選單

## 專案結構

```
phaser-exp/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI（測試 + 建置）
├── eslint.config.js        # ESLint 設定（flat config + JSX）
├── vite.config.js          # Vite 設定（React 外掛）
├── index.html              # 頁面入口（React 掛載點）
├── package.json            # 依賴套件與腳本
├── public/
│   └── assets/
│       └── audio/          # 音效資源
│           ├── bgm_menu.wav
│           └── bgm_game.wav
└── src/
    ├── main.jsx            # React 入口
    ├── App.jsx             # 頂層路由（React 開始/模式選擇畫面 ↔ Phaser 遊戲）
    ├── main.js             # [已棄用] 舊 Phaser 入口（保留參考）
    ├── i18n.js             # 多語系（中 / 英）
    ├── components/
    │   ├── StartScreen.jsx      # React 開始畫面（CSS 星空動畫）
    │   ├── StartScreen.css      # 開始畫面樣式
    │   ├── ModeSelectScreen.jsx # React 模式選擇畫面（無盡 / 關卡）
    │   ├── ModeSelectScreen.css # 模式選擇畫面樣式
    │   ├── OptionsScreen.jsx    # React 設定畫面（音量 / 語言）
    │   ├── OptionsScreen.css    # 設定畫面樣式
    │   ├── BestiaryScreen.jsx     # React 敵人圖鑑畫面
    │   ├── BestiaryScreen.css     # 敵人圖鑑畫面樣式
    │   ├── StageSelectScreen.jsx  # React 關卡選擇畫面（解鎖 / 重玩）
    │   ├── StageSelectScreen.css  # 關卡選擇畫面樣式
    │   ├── GameWrapper.jsx       # 響應式縮放包裝器（CSS transform scale）
    │   └── GameCanvas.jsx       # Phaser 包裝器（按需初始化 / 銷毀）
    ├── profiles/
    │   └── aircraftProfiles.js  # 戰機外觀 Profile 定義（7 組：玩家、普通敵人、特殊敵人、迷你Boss、3 關卡Boss）
    ├── data/
    │   ├── enemyData.js         # 敵人圖鑑資料（名稱、分數、類型）
    │   └── stageData.js         # 關卡模式設定資料（波次、Boss）
    ├── systems/
    │   └── WaveManager.js       # 波次進行控制器
    ├── utils/
    │   ├── canvasRenderer.js    # Phaser Graphics → Canvas 2D 轉譯器（圖鑑預覽用）
    │   └── sceneHelpers.js      # 場景共用函式（紋理、背景、輸入、暫停等）
    ├── scenes/
    │   ├── MainScene.js         # 無盡模式遊戲場景
    │   └── StageScene.js        # 關卡模式遊戲場景
    ├── objects/
    │   ├── Player.js       # 玩家物件
    │   ├── Enemy.js        # 敵人物件
    │   ├── Bullet.js       # 子彈物件
    │   └── Powerup.js      # 道具物件
    └── __tests__/
        ├── i18n.test.js              # i18n 模組單元測試
        ├── aircraftProfiles.test.js  # 戰機 Profile 單元測試
        └── stageData.test.js         # 關卡資料單元測試
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
| 射擊間隔 | 380 ms |
| 敵人生成率 | 每秒 1 隻 |
| 特殊敵人出現率 | 20% |
| 三連發持續時間 | 10 秒 |
| 擊殺得分（普通） | 10 分 |
| 擊殺得分（特殊） | 20 分 |
| 擊殺得分（迷你Boss） | 100 分 |
| 普通敵人 HP | 1 |
| 特殊敵人 HP | 3 |
| 迷你Boss HP | 10 |
| 迷你Boss 生成間隔 | 30 秒 |
| 迷你Boss 速度 | 60 px/s |
| 迷你Boss 射擊間隔 | 1500 ms |
| 拾取道具得分 | 50 分 |
| 第1關 Boss HP | 20（瞄準射擊） |
| 第2關 Boss HP | 30（扇形散射） |
| 第3關 Boss HP | 40（追蹤彈） |

## 技術棧

| 技術 | 版本 | 用途 |
|------|------|------|
| [React](https://react.dev/) | 19.2 | UI 框架（開始畫面、模式選擇） |
| [Phaser 3](https://phaser.io/) | 3.90.0 | 遊戲框架（渲染、物理、輸入） |
| [Vite](https://vitejs.dev/) | 7.3.1 | 開發伺服器與打包工具 |
| [Vitest](https://vitest.dev/) | 4.1.0 | 單元測試框架 |
| [ESLint](https://eslint.org/) | 10.0.3 | 程式碼風格檢查 |
| ES6 Modules | — | 模組化程式碼管理 |

## 授權

本專案採用 [MIT License](LICENSE)。
