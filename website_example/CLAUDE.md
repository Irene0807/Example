# 賽局理論教學網站 — 專案說明

## 專案概述
靜態多頁網站，主題為賽局理論（Game Theory）。
無框架依賴，純 HTML + CSS + Vanilla JS，可直接用瀏覽器開啟。

## 檔案架構

```
website_example/
├── public/          # HTML 頁面
│   ├── index.html       ← 首頁（時間軸、諾貝爾獎）
│   ├── concepts.html    ← 核心概念（黏性 TOC）
│   ├── games.html       ← 賽局卡片（可篩選）
│   ├── simulator.html   ← 互動模擬器
│   └── news.html        ← 新聞賽局分析（NewsAPI）
├── src/
│   ├── styles/      # CSS 檔
│   │   ├── main.css         ← 變數、版型、導覽列、頁尾
│   │   ├── components.css   ← 賽局卡片、模擬器、新聞卡片
│   │   └── animations.css   ← Keyframes、scroll 動畫
│   ├── js/          # JS 模組（IIFE，非 ES module）
│   │   ├── main.js          ← 導覽列、IntersectionObserver
│   │   ├── games.js         ← 賽局卡片篩選
│   │   ├── simulator.js     ← 三個模擬器邏輯
│   │   └── news-scheduler.js← NewsAPI 排程抓取
│   └── data/        # 靜態資料
│       ├── concepts.json    ← 時間軸、諾貝爾獎（也內嵌在 main.js）
│       └── games.json       ← 6 個賽局完整資料
├── assets/icons/    # SVG 圖示
├── tests/           # Jest 單元測試
└── .claude/         # 專案級 Claude 設定
```

## 開發指令

```bash
npm run dev    # 啟動本地伺服器 (port 3000)
npm test       # 執行單元測試
npm run lint   # ESLint 檢查
```

## 修改指引

### 新增賽局卡片
使用 `/add-game <名稱>` 指令，或參考 `.claude/skills/add-game-card.md`。

### 修改配色
所有顏色透過 `src/styles/main.css` 頂部的 CSS Variables 統一控制。

### 新增核心概念
在 `public/concepts.html` 加入新的 `<section id="..." class="concept-section">` 區塊，並更新 `.toc` 目錄連結。

### 模擬器邏輯
`src/js/simulator.js` 包含三個獨立模擬：
1. `pdChoose()` — 單輪囚徒困境
2. `startRepeatedPD()` / `repeatChoice()` — 重複賽局（4 種 AI 策略）
3. `findNashEquilibrium()` — 純策略納許均衡求解

### 新聞排程
`src/js/news-scheduler.js` 每 15 分鐘向 NewsAPI `everything` 端點抓取中文新聞，
自動對應賽局理論概念。API Key 存於檔案頂部（僅限本地開發）。

## 設計原則
- 暗色主題，深藍色系為主調
- 響應式設計，支援行動裝置
- 語意化 HTML，表格使用 `scope` 屬性符合無障礙標準
- 動畫遵循 `prefers-reduced-motion` 媒體查詢
