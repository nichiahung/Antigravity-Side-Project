import { useState } from 'react';
import { fetchQuestions } from '../api';
import { preloadAvatars } from '../avatars';

const QUESTION_COUNT = Number(import.meta.env.VITE_QUESTION_COUNT) || 10;

export default function HomePage({ onGameStart }) {
    const [playerId, setPlayerId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleStart = async (e) => {
        e.preventDefault();
        const id = playerId.trim();
        if (!id) {
            setError('請輸入你的 ID！');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // 同時取題 + 預載頭像
            const [questions] = await Promise.all([
                fetchQuestions(QUESTION_COUNT),
                preloadAvatars(),
            ]);
            onGameStart(id, questions);
        } catch (err) {
            setError(err.message || '連線失敗，請稍後再試');
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="animate-pixel-fade">
                <h1 className="game-title animate-flicker">
                    PIXEL
                    <br />
                    QUEST
                    <span className="subtitle">闖 關 問 答</span>
                </h1>

                <div className="pixel-card">
                    <form onSubmit={handleStart}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="player-id">
                                PLAYER ID
                            </label>
                            <input
                                id="player-id"
                                type="text"
                                className="pixel-input"
                                placeholder="輸入你的 ID..."
                                value={playerId}
                                onChange={(e) => setPlayerId(e.target.value)}
                                disabled={loading}
                                autoFocus
                            />
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <div className="pixel-divider" />

                        {loading ? (
                            <div className="loading-container">
                                <div className="loading-dots">
                                    <span />
                                    <span />
                                    <span />
                                </div>
                                <div className="loading-text">LOADING...</div>
                            </div>
                        ) : (
                            <button
                                type="submit"
                                className="pixel-btn pixel-btn-primary"
                                style={{ width: '100%' }}
                            >
                                ▶ START GAME
                            </button>
                        )}
                    </form>
                </div>

                <p
                    style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '0.5rem',
                        color: 'var(--color-text-muted)',
                        textAlign: 'center',
                        marginTop: 'var(--space-xl)',
                        letterSpacing: '1px',
                    }}
                >
                    共 {QUESTION_COUNT} 題 ─ 準備好了嗎？
                </p>
            </div>
        </div>
    );
}
