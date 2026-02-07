/**
 * ================================================================
 * PIXEL QUEST - Google Apps Script 後端
 * ================================================================
 *
 * 使用方式：
 * 1. 開啟你的 Google Sheets
 * 2. 擴充功能 > Apps Script
 * 3. 將此檔案內容貼上，取代預設的 Code.gs
 * 4. 部署 > 新增部署 > 網頁應用程式
 *    - 執行身分：你自己
 *    - 存取權限：任何人
 * 5. 複製部署 URL，貼到 .env 的 VITE_GOOGLE_APP_SCRIPT_URL
 *
 * Google Sheets 工作表格式：
 *
 * 「題目」工作表：
 * | 題號 | 題目 | A | B | C | D | 解答 |
 *
 * 「回答」工作表：
 * | ID | 闖關次數 | 總分 | 最高分 | 第一次通關分數 | 花了幾次通關 | 最近遊玩時間 |
 *
 * ================================================================
 */

const QUESTION_SHEET = '題目';
const ANSWER_SHEET = '回答';
const PASS_THRESHOLD = 7; // 通過門檻，需與前端 .env 一致

/**
 * 處理 GET 請求 - 取得隨機題目
 */
function doGet(e) {
    try {
        const action = e.parameter.action;

        if (action === 'getQuestions') {
            const count = parseInt(e.parameter.count) || 10;
            const questions = getRandomQuestions(count);
            return jsonResponse({ questions });
        }

        return jsonResponse({ error: '未知的 action' });
    } catch (err) {
        return jsonResponse({ error: err.message });
    }
}

/**
 * 處理 POST 請求 - 提交答案並計算成績
 */
function doPost(e) {
    try {
        const body = JSON.parse(e.postData.contents);
        const action = body.action;

        if (action === 'submitAnswers') {
            const playerId = body.id;
            const answers = body.answers;
            const result = calculateAndRecord(playerId, answers);
            return jsonResponse(result);
        }

        return jsonResponse({ error: '未知的 action' });
    } catch (err) {
        return jsonResponse({ error: err.message });
    }
}

/**
 * 從「題目」工作表隨機取 N 題（不含解答）
 */
function getRandomQuestions(count) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(QUESTION_SHEET);
    const data = sheet.getDataRange().getValues();

    // 第一列是標題，跳過
    const rows = data.slice(1).filter(row => row[0] !== '');

    // Fisher-Yates shuffle
    for (let i = rows.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rows[i], rows[j]] = [rows[j], rows[i]];
    }

    const selected = rows.slice(0, Math.min(count, rows.length));

    return selected.map(row => ({
        id: row[0],       // 題號
        question: row[1], // 題目
        A: row[2],        // 選項 A
        B: row[3],        // 選項 B
        C: row[4],        // 選項 C
        D: row[5],        // 選項 D
        // row[6] 是解答，不傳給前端
    }));
}

/**
 * 計算成績並記錄到「回答」工作表
 */
function calculateAndRecord(playerId, answers) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // 取得解答對照表
    const questionSheet = ss.getSheetByName(QUESTION_SHEET);
    const questionData = questionSheet.getDataRange().getValues();
    const answerMap = {};
    questionData.slice(1).forEach(row => {
        answerMap[row[0]] = row[6]; // 題號 -> 解答
    });

    // 計算分數
    let score = 0;
    const total = answers.length;
    answers.forEach(a => {
        if (answerMap[a.questionId] === a.answer) {
            score++;
        }
    });

    const passed = score >= PASS_THRESHOLD;
    const now = new Date();

    // 更新「回答」工作表
    const answerSheet = ss.getSheetByName(ANSWER_SHEET);
    const answerData = answerSheet.getDataRange().getValues();

    // 找到該 ID 的列
    let rowIndex = -1;
    for (let i = 1; i < answerData.length; i++) {
        if (String(answerData[i][0]) === String(playerId)) {
            rowIndex = i + 1; // Sheets 是 1-indexed
            break;
        }
    }

    if (rowIndex === -1) {
        // 新玩家：新增一列
        const newRow = [
            playerId,                    // ID
            1,                           // 闖關次數
            score,                       // 總分
            score,                       // 最高分
            passed ? score : '',         // 第一次通關分數
            passed ? 1 : '',             // 花了幾次通關
            now,                         // 最近遊玩時間
        ];
        answerSheet.appendRow(newRow);

        return {
            score,
            total,
            passed,
            highScore: score,
            attempts: 1,
        };
    } else {
        // 舊玩家：更新
        const existingRow = answerData[rowIndex - 1];
        const attempts = (existingRow[1] || 0) + 1;
        const highScore = Math.max(existingRow[3] || 0, score);
        const firstPassScore = existingRow[4]; // 不覆蓋
        const passAttempts = existingRow[5];

        answerSheet.getRange(rowIndex, 2).setValue(attempts);         // 闖關次數
        answerSheet.getRange(rowIndex, 3).setValue(score);            // 總分（本次）
        answerSheet.getRange(rowIndex, 4).setValue(highScore);        // 最高分

        // 第一次通關分數：只在尚未通關且本次通關時寫入
        if (passed && !firstPassScore && firstPassScore !== 0) {
            answerSheet.getRange(rowIndex, 5).setValue(score);          // 第一次通關分數
            answerSheet.getRange(rowIndex, 6).setValue(attempts);       // 花了幾次通關
        }

        answerSheet.getRange(rowIndex, 7).setValue(now);              // 最近遊玩時間

        return {
            score,
            total,
            passed,
            highScore,
            attempts,
        };
    }
}

/**
 * 回傳 JSON 格式
 */
function jsonResponse(data) {
    return ContentService
        .createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
}
