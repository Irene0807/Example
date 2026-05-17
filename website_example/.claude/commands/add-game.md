---
description: 在賽局理論網站新增一個完整的賽局案例（HTML 卡片 + JSON 資料）
---

使用方式：`/add-game <賽局名稱>`

例如：`/add-game 協調賽局` 或 `/add-game 公共財賽局`

執行步驟：

1. 詢問以下資訊（若未提供）：
   - 賽局名稱（中文）
   - 分類：cooperative / competitive / coordination
   - 玩家數量與策略列表
   - 報酬矩陣（2×2 格式）
   - 納許均衡位置
   - 現實世界應用範例（3 個）

2. 在 `public/games.html` 的 `#games-grid` 內新增 `<article class="game-card">` 區塊
   - 使用對應的 header 顏色 class
   - 表格 `<th>` 必須加 `scope="col"` 或 `scope="row"`

3. 在 `src/data/games.json` 的 `games` 陣列新增對應記錄

4. 確認篩選按鈕的 `data-filter` 值與新卡片的 `data-category` 相符

5. 執行 `npm test` 確認測試通過
