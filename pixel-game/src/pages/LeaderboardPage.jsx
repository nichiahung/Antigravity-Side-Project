import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLeaderboard } from '../api';

export default function LeaderboardPage() {
    const navigate = useNavigate();
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchLeaderboard(10)
            .then(setPlayers)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="page">
                <div className="loading-container">
                    <div className="loading-dots">
                        <span />
                        <span />
                        <span />
                    </div>
                    <div className="loading-text">LOADING...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="pixel-card animate-pixel-fade" style={{ textAlign: 'center' }}>
                <div className="result-banner passed">
                    🏆 LEADERBOARD 🏆
                </div>

                {error && <div className="error-message">{error}</div>}

                {players.length === 0 && !error && (
                    <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', fontSize: '1.25rem', margin: 'var(--space-xl) 0' }}>
                        還沒有玩家紀錄
                    </p>
                )}

                {players.length > 0 && (
                    <div className="leaderboard-table">
                        <div className="leaderboard-header">
                            <span className="lb-rank">#</span>
                            <span className="lb-name">PLAYER</span>
                            <span className="lb-score">HIGH SCORE</span>
                            <span className="lb-attempts">ATTEMPTS</span>
                        </div>
                        {players.map((p, i) => (
                            <div
                                key={p.id}
                                className={`leaderboard-row ${i < 3 ? `top-${i + 1}` : ''}`}
                            >
                                <span className="lb-rank">
                                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                                </span>
                                <span className="lb-name">{p.id}</span>
                                <span className="lb-score">{p.high_score}</span>
                                <span className="lb-attempts">{p.attempts}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="btn-group" style={{ marginTop: 'var(--space-xl)' }}>
                    <button
                        className="pixel-btn pixel-btn-primary"
                        onClick={() => navigate('/')}
                    >
                        ◀ HOME
                    </button>
                </div>
            </div>
        </div>
    );
}
