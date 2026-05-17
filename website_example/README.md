# 賽局理論教學網站

一個完整的靜態網站，涵蓋賽局理論的核心概念、經典賽局模型與互動模擬功能。

## 功能特色

- **首頁** — 介紹、發展歷史時間軸、諾貝爾獎得主一覽
- **核心概念** — 納許均衡、優勢策略、最小最大值、帕累托最優、混合策略
- **經典賽局** — 囚徒困境、獵鹿賽局、膽小鬼賽局、拍賣理論、古諾競爭、最後通牒賽局
- **互動模擬** — 囚徒困境單輪對決、重複賽局與策略對戰、自訂報酬矩陣的納許均衡求解

## 快速開始

```bash
npm install
npm run dev   # 啟動 localhost:3000
```

或直接雙擊 `public/index.html` 在瀏覽器開啟。

## 專案結構

```
website_example/
├── public/                 # HTML 頁面
│   ├── index.html          # 首頁
│   ├── concepts.html       # 核心概念
│   ├── games.html          # 經典賽局
│   └── simulator.html      # 互動模擬
├── src/
│   ├── styles/
│   │   ├── main.css        # 主要樣式、版面、元件
│   │   ├── components.css  # 賽局頁面與模擬器元件
│   │   └── animations.css  # 動畫效果
│   ├── js/
│   │   ├── main.js         # 導覽列、滾動動畫、首頁動態內容
│   │   ├── games.js        # 賽局卡片篩選功能
│   │   └── simulator.js    # 互動模擬邏輯
│   └── data/
│       ├── concepts.json   # 歷史時間軸與諾貝爾獎資料
│       └── games.json      # 賽局詳細資料與報酬矩陣
├── assets/
│   └── icons/logo.svg
├── tests/
│   └── games.test.js
├── package.json
├── CLAUDE.md
└── README.md
```

## 技術選型

| 項目 | 技術 |
|------|------|
| HTML | 語意化 HTML5，WCAG 無障礙標準 |
| CSS | 純 CSS，CSS Variables、Grid、Flexbox |
| JavaScript | Vanilla JS，IntersectionObserver API |
| 資料 | JSON，可輕易擴充賽局內容 |
| 測試 | Jest 單元測試 |

## 執行測試

```bash
npm test
```
