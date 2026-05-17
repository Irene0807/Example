# 賽局理論互動 App — 專案說明

## 專案概述
賽局理論互動應用程式，風格與內容參考 `../website_example/`。
以繁體中文撰寫，面向大學部或高中學生。

## 目標功能
- 互動式賽局模擬（囚徒困境、協調賽局、膽小鬼賽局等）
- 視覺化報酬矩陣與均衡解
- 多玩家對戰模式（本機或連線）

## 參考來源
- 賽局定義與報酬資料：`../website_example/src/data/games.json`
- 模擬器邏輯：`../website_example/src/js/simulator.js`
- 設計風格：`../website_example/src/styles/`

## 開發規範
- 語言與術語標準：參見全域 `~/.claude/CLAUDE.md`
- 賽局理論準確性：均衡不等於最優，囚徒困境必須說明個人理性 ≠ 集體理性
- HTML 表格 `<th>` 必須有 `scope` 屬性

## 專案狀態
待開發。啟動前請先確認技術選型（純 HTML/JS vs. React/Vue）。
