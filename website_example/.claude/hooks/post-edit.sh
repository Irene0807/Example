#!/bin/sh
# 在 Edit / Write 工具執行後自動觸發
# 功能：提醒確認畫面效果，並檢查 HTML 無障礙基本規則

CHANGED_FILE="$1"

# 若修改的是 HTML 檔案，提示在瀏覽器確認
case "$CHANGED_FILE" in
  *.html)
    echo "✏️  HTML 已更新：$CHANGED_FILE"
    echo "   → 請在瀏覽器重新整理確認畫面顯示正確"
    echo "   → 確認表格 <th> 有 scope 屬性（無障礙需求）"
    ;;
  *.css)
    echo "🎨  CSS 已更新：$CHANGED_FILE"
    echo "   → 建議用 DevTools 確認 RWD 在不同寬度下正常"
    ;;
  *.js)
    echo "⚙️  JS 已更新：$CHANGED_FILE"
    echo "   → 建議執行 npm test 確認邏輯未受影響"
    ;;
  *.json)
    echo "📦  資料已更新：$CHANGED_FILE"
    echo "   → 確認 JSON 格式正確（無多餘逗號）"
    ;;
esac
