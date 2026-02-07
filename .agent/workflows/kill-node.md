---
description: 殺掉 Node 進程 / 清理佔用的 port
---

// turbo-all

## 殺掉所有 Node 進程

```powershell
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
```

## 確認已清理乾淨

```powershell
Get-Process -Name "node" -ErrorAction SilentlyContinue | Format-Table Id, ProcessName, CPU -AutoSize
```

如果沒有輸出，代表所有 Node 進程都已清除。
