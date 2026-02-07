require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;
const PASS_THRESHOLD = Number(process.env.PASS_THRESHOLD) || 7;

// CORS
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
    origin: corsOrigin === '*' ? true : corsOrigin.split(',').map(s => s.trim()),
}));
app.use(express.json());

// ─── GET /api/questions ───
app.get('/api/questions', (req, res) => {
    try {
        const count = Math.min(parseInt(req.query.count) || 10, 50);

        const questions = db
            .prepare('SELECT id, question, option_a, option_b, option_c, option_d FROM questions ORDER BY RANDOM() LIMIT ?')
            .all(count)
            .map(row => ({
                id: row.id,
                question: row.question,
                A: row.option_a,
                B: row.option_b,
                C: row.option_c,
                D: row.option_d,
            }));

        res.json({ questions });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── POST /api/submit ───
app.post('/api/submit', (req, res) => {
    try {
        const { id: playerId, answers } = req.body;

        if (!playerId || !Array.isArray(answers)) {
            return res.status(400).json({ error: '缺少 id 或 answers' });
        }

        // 取得所有答案對照
        const answerMap = {};
        db.prepare('SELECT id, answer FROM questions').all().forEach(row => {
            answerMap[row.id] = row.answer;
        });

        // 計算分數 + 每題結果
        let score = 0;
        const total = answers.length;
        const corrections = answers.map(a => {
            const correct = answerMap[a.questionId];
            const isCorrect = correct === a.answer;
            if (isCorrect) score++;
            return { questionId: a.questionId, selected: a.answer, correct, isCorrect };
        });

        const passed = score >= PASS_THRESHOLD;
        const now = new Date().toISOString();

        // 查詢玩家
        const player = db.prepare('SELECT * FROM players WHERE id = ?').get(playerId);

        if (!player) {
            // 新玩家
            db.prepare(`
        INSERT INTO players (id, attempts, last_score, high_score, first_pass_score, pass_attempts, last_played_at)
        VALUES (?, 1, ?, ?, ?, ?, ?)
      `).run(
                playerId,
                score,
                score,
                passed ? score : null,
                passed ? 1 : null,
                now,
            );

            res.json({ score, total, passed, highScore: score, attempts: 1, corrections });
        } else {
            // 舊玩家
            const attempts = player.attempts + 1;
            const highScore = Math.max(player.high_score, score);
            const firstPassScore = player.first_pass_score;
            const passAttempts = player.pass_attempts;

            const updateFields = {
                attempts,
                last_score: score,
                high_score: highScore,
                last_played_at: now,
            };

            // 第一次通關
            if (passed && firstPassScore == null) {
                updateFields.first_pass_score = score;
                updateFields.pass_attempts = attempts;
            }

            db.prepare(`
        UPDATE players SET
          attempts = @attempts,
          last_score = @last_score,
          high_score = @high_score,
          first_pass_score = COALESCE(@first_pass_score, first_pass_score),
          pass_attempts = COALESCE(@pass_attempts, pass_attempts),
          last_played_at = @last_played_at
        WHERE id = @id
      `).run({ ...updateFields, id: playerId, first_pass_score: updateFields.first_pass_score ?? null, pass_attempts: updateFields.pass_attempts ?? null });

            res.json({ score, total, passed, highScore, attempts, corrections });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── GET /api/leaderboard ───
app.get('/api/leaderboard', (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);
        const players = db
            .prepare('SELECT id, high_score, attempts, last_played_at FROM players ORDER BY high_score DESC, attempts ASC LIMIT ?')
            .all(limit);
        res.json({ leaderboard: players });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Health check ───
app.get('/api/health', (req, res) => {
    const count = db.prepare('SELECT COUNT(*) as count FROM questions').get();
    res.json({ status: 'ok', questions: count.count });
});

app.listen(PORT, () => {
    const count = db.prepare('SELECT COUNT(*) as count FROM questions').get();
    console.log(`🎮 PIXEL QUEST API Server`);
    console.log(`   Port: ${PORT}`);
    console.log(`   題庫: ${count.count} 題`);
    console.log(`   通過門檻: ${PASS_THRESHOLD}`);
    console.log(`   CORS: ${corsOrigin}`);
});
