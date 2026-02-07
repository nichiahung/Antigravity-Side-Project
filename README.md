# 🕹️ PIXEL QUEST — 闖關問答遊戲

像素風街機問答遊戲，串接 Google Sheets 作為題庫與成績記錄後端。

## 目錄

- [快速開始](#快速開始)
- [環境變數](#環境變數)
- [Google Sheets 設定](#google-sheets-設定)
- [Google Apps Script 部署](#google-apps-script-部署)
- [部署到 GitHub Pages](#部署到-github-pages)
- [測試題目](#測試題目生成式-ai-基礎知識)
- [專案結構](#專案結構)

---

## 快速開始

```bash
# 安裝依賴
npm install

# 啟動開發伺服器（Demo 模式，不需要 Google Sheets）
npm run dev

# 建置生產版本
npm run build
```

> **💡 Demo 模式：** 當 `.env` 的 `VITE_GOOGLE_APP_SCRIPT_URL` 尚未設定時，遊戲會自動使用內建假資料運行，方便開發測試。

---

## 環境變數

複製 `.env` 並修改：

| 變數名稱 | 說明 | 預設值 |
|----------|------|--------|
| `VITE_GOOGLE_APP_SCRIPT_URL` | Google Apps Script 部署 URL | `YOUR_DEPLOYMENT_ID`（Demo 模式） |
| `VITE_PASS_THRESHOLD` | 通過門檻（答對幾題才算通關） | `7` |
| `VITE_QUESTION_COUNT` | 每次遊戲的題目數量 | `10` |

---

## Google Sheets 設定

### 步驟 1：建立 Google Sheets

1. 前往 [Google Sheets](https://sheets.google.com) → 建立一份新的試算表
2. 將試算表命名為（例如）`PIXEL QUEST 題庫`

### 步驟 2：建立「題目」工作表

1. 將預設的 `工作表1` 重新命名為 **`題目`**（點擊底部的工作表標籤，右鍵 → 重新命名）
2. 在第一列（Row 1）填入以下欄位標題：

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| 題號 | 題目 | A | B | C | D | 解答 |

3. 從第二列開始填入題目資料（見下方[測試題目](#測試題目生成式-ai-基礎知識)）

> **⚠️ 注意：**「解答」欄位填入的是選項代號（`A`、`B`、`C` 或 `D`），不是答案內容。

### 步驟 3：建立「回答」工作表

1. 點擊底部的 **`+`** 新增工作表
2. 將新工作表命名為 **`回答`**
3. 在第一列填入以下欄位標題：

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| ID | 闖關次數 | 總分 | 最高分 | 第一次通關分數 | 花了幾次通關 | 最近遊玩時間 |

4. **不需要手動填入資料**，遊戲會自動寫入

---

## Google Apps Script 部署

### 步驟 1：開啟 Apps Script 編輯器

1. 在你的 Google Sheets 中，點擊上方選單列的 **擴充功能** → **Apps Script**
2. 這會在新分頁中開啟 Apps Script 編輯器

### 步驟 2：貼上程式碼

1. 刪除編輯器中預設的所有程式碼（`function myFunction() { }` 那段）
2. 打開本專案的 [`google-apps-script.js`](./google-apps-script.js)
3. **複製全部內容**，貼到 Apps Script 編輯器中
4. 按 `Ctrl + S` 儲存

### 步驟 3：部署為網頁應用程式

1. 點擊右上角的 **「部署」** → **「新增部署」**
2. 點擊左側齒輪圖示 ⚙️ → 選擇 **「網頁應用程式」**
3. 設定以下選項：
   - **說明：** `PIXEL QUEST API`（隨意填寫）
   - **執行身分：** `我`
   - **存取權限：** `所有人`
4. 點擊 **「部署」**
5. 首次部署會要求授權：
   - 點擊 **「授權存取」**
   - 選擇你的 Google 帳號
   - 如出現「這個應用程式未經 Google 驗證」，點擊 **「進階」** → **「前往 PIXEL QUEST API（不安全）」**
   - 點擊 **「允許」**
6. 部署成功後，複製顯示的 **「網頁應用程式 URL」**

### 步驟 4：設定環境變數

1. 打開本專案的 `.env` 檔案
2. 將複製的 URL 貼到 `VITE_GOOGLE_APP_SCRIPT_URL`：

```env
VITE_GOOGLE_APP_SCRIPT_URL=https://script.google.com/macros/s/你的部署ID/exec
```

3. 重新啟動 dev server（`npm run dev`）

> **💡 更新程式碼後：** 如果你修改了 Apps Script 程式碼，需要重新部署（部署 → 管理部署 → 編輯 → 版本選「新版本」→ 部署）。URL 不會改變。

---

## 部署到 GitHub Pages

本專案內建 GitHub Actions，push 到 `main` 分支即自動部署。

### 步驟 1：建立 GitHub Repository

1. 在 GitHub 建立新的 repository
2. 將本專案程式碼 push 上去：

```bash
git init
git add .
git commit -m "init: pixel quest"
git remote add origin https://github.com/你的帳號/你的repo.git
git push -u origin main
```

### 步驟 2：設定 Repository Secrets

1. 進入 GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. 點擊 **New repository secret**，依序新增以下三個：

| Secret 名稱 | 值 |
|-------------|-----|
| `VITE_GOOGLE_APP_SCRIPT_URL` | 你的 Google Apps Script 部署 URL |
| `VITE_PASS_THRESHOLD` | `7`（或你想要的通過門檻） |
| `VITE_QUESTION_COUNT` | `10`（或你想要的題數） |

### 步驟 3：啟用 GitHub Pages

1. 進入 repo → **Settings** → **Pages**
2. **Source** 選擇 **GitHub Actions**
3. 儲存後，回到 **Actions** 頁面確認 workflow 執行成功

### 步驟 4：完成

部署完成後，你的遊戲會在以下網址上線：

```
https://你的帳號.github.io/你的repo/
```

> **💡 後續更新：** 每次 push 到 `main` 分支都會自動重新部署。

---

## 測試題目：生成式 AI 基礎知識

以下 10 題可直接複製貼上到 Google Sheets「題目」工作表：

| 題號 | 題目 | A | B | C | D | 解答 |
|------|------|---|---|---|---|------|
| 1 | GPT 中的「T」代表什麼？ | Translation | Transformer | Transfer | Tensor | B |
| 2 | 以下哪一個是大型語言模型（LLM）？ | ResNet | YOLO | GPT-4 | U-Net | C |
| 3 | Transformer 架構最早由哪篇論文提出？ | ImageNet | Attention Is All You Need | BERT Paper | AlexNet | B |
| 4 | 什麼是「Prompt Engineering」？ | 訓練模型的程式碼 | 設計有效的輸入提示以獲得理想輸出 | 一種程式語言 | 硬體加速技術 | B |
| 5 | 「Hallucination（幻覺）」在 AI 中指的是？ | 模型產生看似合理但不正確的內容 | 模型無法回答問題 | 模型運算速度過慢 | 模型佔用過多記憶體 | A |
| 6 | RAG 技術中的「R」代表什麼？ | Reinforcement | Retrieval | Recurrent | Recursive | B |
| 7 | Fine-tuning 是指什麼？ | 從零開始訓練模型 | 在預訓練模型上用特定資料進行微調 | 刪除模型參數 | 壓縮模型大小 | B |
| 8 | 以下哪個是圖片生成模型？ | BERT | Stable Diffusion | Word2Vec | FastText | B |
| 9 | Token 在 LLM 中代表什麼？ | 一個完整的句子 | 模型處理文字的最小單位 | 一種加密金鑰 | API 的使用費用 | B |
| 10 | Temperature 參數越高，模型輸出會？ | 越精確固定 | 越隨機多樣 | 越短 | 越慢 | B |

---

## 專案結構

```
pixel-game/
├── .env                        # 環境變數
├── google-apps-script.js       # GAS 後端（複製到 Sheets）
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx                # 進入點
│   ├── App.jsx                 # Router + 遊戲狀態
│   ├── index.css               # 像素風設計系統
│   ├── api.js                  # API 串接 + Demo 模式
│   ├── avatars.js              # DiceBear 頭像
│   └── pages/
│       ├── HomePage.jsx        # 首頁（ID 輸入）
│       ├── GamePage.jsx        # 遊戲頁（闖關問答）
│       └── ResultPage.jsx      # 結果頁（分數）
```
