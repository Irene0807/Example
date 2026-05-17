---
name: add-game-card
description: 在 games.html 新增賽局卡片的標準步驟
---

# Skill: Add Game Card

## 觸發時機
當使用者說「新增一個賽局」、「加入 XX 賽局」或使用 `/add-game` 指令時。

## 執行步驟

### Step 1：蒐集資料
確認以下欄位都有值：
```
name: 賽局中文名稱
category: cooperative | competitive | coordination
icon: emoji
tag: 簡短標籤（如「最著名賽局」）
description: 一句話描述
strategies_A: [策略1, 策略2]
strategies_B: [策略1, 策略2]
payoffs: [[（a11,b11）,（a12,b12）],[（a21,b21）,（a22,b22）]]
nash_equilibria: 位置列表
key_insight: 核心洞見
applications: [3 個現實應用]
```

### Step 2：建立 HTML 結構
複製以下模板到 `public/games.html` 的 `#games-grid`：

```html
<article class="game-card" data-category="{{category}}">
  <div class="game-card-header {{css-class}}">
    <span class="game-icon">{{icon}}</span>
    <h2>{{name}}</h2>
    <span class="game-tag">{{tag}}</span>
  </div>
  <div class="game-card-body">
    <p class="game-desc">{{description}}</p>
    <div class="game-matrix">
      <table>
        <thead>
          <tr><th scope="col"></th><th scope="col">{{策略B1}}</th><th scope="col">{{策略B2}}</th></tr>
        </thead>
        <tbody>
          <tr><th scope="row">{{策略A1}}</th><td>{{a11,b11}}</td><td>{{a12,b12}}</td></tr>
          <tr><th scope="row">{{策略A2}}</th><td>{{a21,b21}}</td><td>{{a22,b22}}</td></tr>
        </tbody>
      </table>
    </div>
    <div class="game-analysis">
      <p><strong>納許均衡：</strong>{{nash}}</p>
      <p><strong>核心洞見：</strong>{{insight}}</p>
    </div>
    <div class="game-applications">
      <h4>現實應用</h4>
      <ul>{{applications}}</ul>
    </div>
  </div>
</article>
```

### Step 3：更新 JSON
在 `src/data/games.json` 的 `games` 陣列尾端加入完整記錄。

### Step 4：驗證
- 確認 `data-category` 與篩選按鈕的 `data-filter` 一致
- 所有 `<th>` 有 scope 屬性
- JSON 格式合法（最後一個項目後無逗號）
