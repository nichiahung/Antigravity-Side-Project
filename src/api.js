const GAS_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
const PASS_THRESHOLD = Number(import.meta.env.VITE_PASS_THRESHOLD) || 7;

// 當 GAS URL 未設定或為預設值時，使用 demo 模式
const IS_DEMO =
    !GAS_URL || GAS_URL.includes('YOUR_DEPLOYMENT_ID');

// ─── Demo 假資料 ───
const DEMO_QUESTIONS = [
    { id: 1, question: '台灣最高的山是？', A: '玉山', B: '雪山', C: '合歡山', D: '阿里山', _answer: 'A' },
    { id: 2, question: 'HTML 是什麼的縮寫？', A: 'Hyper Text Markup Language', B: 'High Tech Modern Language', C: 'Hyper Transfer Mode Link', D: 'Home Tool Markup Language', _answer: 'A' },
    { id: 3, question: 'JavaScript 陣列的第一個 index 是？', A: '1', B: '0', C: '-1', D: 'null', _answer: 'B' },
    { id: 4, question: 'CSS 中，哪個屬性可以改變文字顏色？', A: 'font-color', B: 'text-color', C: 'color', D: 'foreground', _answer: 'C' },
    { id: 5, question: 'React 中，什麼 hook 用於管理狀態？', A: 'useEffect', B: 'useState', C: 'useRef', D: 'useMemo', _answer: 'B' },
    { id: 6, question: '2 的 10 次方是多少？', A: '512', B: '1000', C: '1024', D: '2048', _answer: 'C' },
    { id: 7, question: 'Git 中，哪個指令用來建立新分支？', A: 'git new', B: 'git branch', C: 'git create', D: 'git fork', _answer: 'B' },
    { id: 8, question: 'HTTP 狀態碼 404 代表什麼？', A: '伺服器錯誤', B: '未授權', C: '找不到頁面', D: '請求超時', _answer: 'C' },
    { id: 9, question: '哪個不是 JavaScript 的資料型別？', A: 'string', B: 'boolean', C: 'float', D: 'symbol', _answer: 'C' },
    { id: 10, question: 'npm 代表什麼？', A: 'Node Package Manager', B: 'New Project Manager', C: 'Node Process Module', D: 'Network Protocol Manager', _answer: 'A' },
];

function getDemoQuestions(count) {
    const shuffled = [...DEMO_QUESTIONS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map(({ _answer, ...q }) => q);
}

function getDemoResult(answers) {
    let score = 0;
    answers.forEach((a) => {
        const q = DEMO_QUESTIONS.find((q) => q.id === a.questionId);
        if (q && q._answer === a.answer) score++;
    });
    const total = answers.length;
    return {
        score,
        total,
        passed: score >= PASS_THRESHOLD,
        highScore: score,
        attempts: 1,
    };
}

// ─── Public API ───

/**
 * 從 Google Apps Script 取得隨機題目
 * @param {number} count
 * @returns {Promise<Array>}
 */
export async function fetchQuestions(count) {
    if (IS_DEMO) {
        // 模擬網路延遲
        await new Promise((r) => setTimeout(r, 800));
        return getDemoQuestions(count);
    }

    const res = await fetch(`${GAS_URL}?action=getQuestions&count=${count}`);
    if (!res.ok) throw new Error('無法取得題目');
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.questions;
}

/**
 * 提交作答結果到 Google Apps Script
 * @param {string} playerId
 * @param {Array<{questionId: number, answer: string}>} answers
 * @returns {Promise<Object>}
 */
export async function submitAnswers(playerId, answers) {
    if (IS_DEMO) {
        await new Promise((r) => setTimeout(r, 600));
        return getDemoResult(answers);
    }

    const res = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
            action: 'submitAnswers',
            id: playerId,
            answers,
        }),
    });
    if (!res.ok) throw new Error('提交失敗');
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data;
}
