const db = require('./db');

// 10 題生成式 AI 基礎知識測試題
const questions = [
    { id: 1, question: 'GPT 中的「T」代表什麼？', A: 'Translation', B: 'Transformer', C: 'Transfer', D: 'Tensor', answer: 'B' },
    { id: 2, question: '以下哪一個是大型語言模型（LLM）？', A: 'ResNet', B: 'YOLO', C: 'GPT-4', D: 'U-Net', answer: 'C' },
    { id: 3, question: 'Transformer 架構最早由哪篇論文提出？', A: 'ImageNet', B: 'Attention Is All You Need', C: 'BERT Paper', D: 'AlexNet', answer: 'B' },
    { id: 4, question: '什麼是「Prompt Engineering」？', A: '訓練模型的程式碼', B: '設計有效的輸入提示以獲得理想輸出', C: '一種程式語言', D: '硬體加速技術', answer: 'B' },
    { id: 5, question: '「Hallucination（幻覺）」在 AI 中指的是？', A: '模型產生看似合理但不正確的內容', B: '模型無法回答問題', C: '模型運算速度過慢', D: '模型佔用過多記憶體', answer: 'A' },
    { id: 6, question: 'RAG 技術中的「R」代表什麼？', A: 'Reinforcement', B: 'Retrieval', C: 'Recurrent', D: 'Recursive', answer: 'B' },
    { id: 7, question: 'Fine-tuning 是指什麼？', A: '從零開始訓練模型', B: '在預訓練模型上用特定資料進行微調', C: '刪除模型參數', D: '壓縮模型大小', answer: 'B' },
    { id: 8, question: '以下哪個是圖片生成模型？', A: 'BERT', B: 'Stable Diffusion', C: 'Word2Vec', D: 'FastText', answer: 'B' },
    { id: 9, question: 'Token 在 LLM 中代表什麼？', A: '一個完整的句子', B: '模型處理文字的最小單位', C: '一種加密金鑰', D: 'API 的使用費用', answer: 'B' },
    { id: 10, question: 'Temperature 參數越高，模型輸出會？', A: '越精確固定', B: '越隨機多樣', C: '越短', D: '越慢', answer: 'B' },
];

// 清空並重新匯入
db.exec('DELETE FROM questions');

const insert = db.prepare(`
  INSERT INTO questions (id, question, option_a, option_b, option_c, option_d, answer)
  VALUES (@id, @question, @A, @B, @C, @D, @answer)
`);

const insertMany = db.transaction((items) => {
    for (const item of items) {
        insert.run(item);
    }
});

insertMany(questions);

console.log(`✅ 成功匯入 ${questions.length} 題到 quiz.db`);
process.exit(0);
