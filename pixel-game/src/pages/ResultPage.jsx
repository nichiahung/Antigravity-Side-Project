import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const PASS_THRESHOLD = Number(import.meta.env.VITE_PASS_THRESHOLD) || 7;
const QUESTION_COUNT = Number(import.meta.env.VITE_QUESTION_COUNT) || 10;

export default function ResultPage({ result, playerId, onRestart }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (!result) {
            navigate('/');
        }
    }, [result, navigate]);

    if (!result) return null;

    const { score, total, passed, highScore, attempts, corrections } = result;

    return (
        <div className="page">
            <div className="pixel-card animate-pixel-fade" style={{ textAlign: 'center' }}>
                {/* 結果標題 */}
                <div className={`result-banner ${passed ? 'passed' : 'failed'}`}>
                    {passed ? '★ STAGE CLEAR! ★' : '✖ GAME OVER ✖'}
                </div>

                {/* 分數 */}
                <div className={`score-display ${passed ? 'passed' : 'failed'}`}>
                    {score}/{total}
                </div>

                <p
                    style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '1.5rem',
                        color: 'var(--color-text-muted)',
                    }}
                >
                    通過門檻：{PASS_THRESHOLD} / {QUESTION_COUNT}
                </p>

                <div className="pixel-divider" />

                {/* 統計數據 */}
                <div className="stats-grid">
                    <div className="stat-item">
                        <div className="stat-label">PLAYER</div>
                        <div className="stat-value">{playerId}</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-label">ATTEMPTS</div>
                        <div className="stat-value">{attempts ?? '-'}</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-label">SCORE</div>
                        <div className="stat-value">{score}</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-label">HIGH SCORE</div>
                        <div className="stat-value">{highScore ?? score}</div>
                    </div>
                </div>

                {/* 每題結果 */}
                {corrections && corrections.length > 0 && (
                    <>
                        <div className="pixel-divider" />
                        <div style={{ textAlign: 'left', width: '100%' }}>
                            <div style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '0.5rem',
                                color: 'var(--color-text-muted)',
                                marginBottom: 'var(--space-md)',
                                textAlign: 'center',
                            }}>
                                ANSWER REVIEW
                            </div>
                            {corrections.map((c, i) => (
                                <div
                                    key={c.questionId}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: 'var(--space-sm) var(--space-md)',
                                        fontFamily: 'var(--font-body)',
                                        fontSize: '1.25rem',
                                        borderBottom: '1px solid rgba(124, 58, 237, 0.15)',
                                    }}
                                >
                                    <span style={{ color: 'var(--color-text-muted)' }}>Q{i + 1}</span>
                                    <span style={{
                                        color: c.isCorrect ? 'var(--color-success)' : 'var(--color-danger)',
                                    }}>
                                        {c.isCorrect ? '✓' : `✗ ${c.selected} → ${c.correct}`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* 按鈕 */}
                <div className="btn-group">
                    <button
                        className="pixel-btn pixel-btn-primary"
                        onClick={onRestart}
                    >
                        {passed ? '▶ PLAY AGAIN' : '▶ RETRY'}
                    </button>
                    <button
                        className="pixel-btn pixel-btn-secondary"
                        onClick={() => navigate('/')}
                    >
                        ◀ HOME
                    </button>
                </div>
                <p style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
                    <Link to="/leaderboard" className="nav-link">🏆 LEADERBOARD</Link>
                </p>
            </div>
        </div>
    );
}
