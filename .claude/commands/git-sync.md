同步 Example 資料夾下所有 git repo：自動 pull --rebase 再 push，處理所有衝突。

```powershell
$root = "c:\Users\user\Desktop\Irene\4down\Teaching\1 Claude\Example"

# 找出所有包含 .git 的子目錄（包含根目錄本身）
$repos = @($root) + (Get-ChildItem $root -Recurse -Depth 2 -Filter ".git" -Hidden |
    Where-Object { $_.PSIsContainer } |
    Select-Object -ExpandProperty Parent |
    Select-Object -ExpandProperty FullName) | Sort-Object -Unique

foreach ($repo in $repos) {
    $hasRemote = git -C $repo remote 2>$null
    if (-not $hasRemote) { continue }

    Write-Host "`n[$repo]"
    git -C $repo fetch --quiet 2>$null

    $status = git -C $repo status --short 2>$null
    $ahead = git -C $repo rev-list "@{u}..HEAD" --count 2>$null
    $behind = git -C $repo rev-list "HEAD..@{u}" --count 2>$null

    if ($status) {
        Write-Host "  未提交的變更，跳過"
        continue
    }
    if ($behind -gt 0) {
        Write-Host "  Pull $behind 個新 commit..."
        git -C $repo pull --rebase --quiet
    }
    if ($ahead -gt 0) {
        Write-Host "  Push $ahead 個 commit..."
        git -C $repo push --quiet
        Write-Host "  完成"
    } else {
        Write-Host "  已是最新"
    }
}
Write-Host "`n全部完成"
```
