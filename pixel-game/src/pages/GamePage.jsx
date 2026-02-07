import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitAnswers } from '../api';
import { getRandomAvatars } from '../avatars';

const PASS_THRESHOLD = Number(import.meta.env.VITE_PASS_THRESHOLD) || 7;

export default function GamePage({
    playerId,
    questions,
    onGameEnd,
    onAnswerUpdate,
}) {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!questions || questions.length === 0) {
            navigate('/');
        }
    }, [questions, navigate]);

    const avatars = useMemo(
        () => (questions ? getRandomAvatars(questions.length) : []),
        [questions]
    );

    const currentQuestion = questions?.[currentIndex];
    const totalQuestions = questions?.length || 0;
    const progress = ((currentIndex + 1) / totalQuestions) * 100;

    const handleSelect = useCallback(
        (option) => {
            if (selectedOption || isTransitioning) return;

            setSelectedOption(option);
            const newAnswers = [
                ...answers,
                { questionId: currentQuestion.id, answer: option },
            ];
            setAnswers(newAnswers);
            onAnswerUpdate(newAnswers);

            setIsTransitioning(true);

            // 延遲較長讓玩家看到回饋
            setTimeout(async () => {
                if (currentIndex < totalQuestions - 1) {
                    setCurrentIndex((prev) => prev + 1);
                    setSelectedOption(null);
                    setCorrectAnswer(null);
                    setIsTransitioning(false);
                } else {
                    setSubmitting(true);
                    try {
                        const result = await submitAnswers(playerId, newAnswers);
                        onGameEnd(result);
                    } catch (err) {
                        setError(err.message || '提交失敗');
                        setSubmitting(false);
                        setIsTransitioning(false);
                    }
                }
            }, 1200);
        },
        [
            selectedOption,
            isTransitioning,
            answers,
            currentQuestion,
            currentIndex,
            totalQuestions,
            playerId,
            onAnswerUpdate,
            onGameEnd,
        ]
    );

    if (!currentQuestion) return null;

    if (submitting) {
        return (
            <div className="page">
                <div className="loading-container">
                    <div className="loading-dots">
                        <span />
                        <span />
                        <span />
                    </div>
                    <div className="loading-text">CALCULATING SCORE...</div>
                </div>
            </div>
        );
    }

    const options = ['A', 'B', 'C', 'D'];
    // 找到正確答案（從 demo 模式的 _answer 或後端回傳）
    const correctKey = currentQuestion._answer || null;

    return (
        <div className="page">
            {/* 進度條 */}
            <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                <div className="progress-bar-text">
                    STAGE {currentIndex + 1} / {totalQuestions}
                </div>
            </div>

            <div className="pixel-card animate-slide-in" key={currentIndex}>
                {/* 關主頭像 */}
                <div className="avatar-container">
                    <img
                        src={avatars[currentIndex]}
                        alt={`Boss ${currentIndex + 1}`}
                    />
                </div>

                <div className="stage-indicator">
                    ─── STAGE {currentIndex + 1} ───
                </div>

                {/* 題目 */}
                <div className="question-number">
                    Q{currentIndex + 1}.
                </div>
                <div className="question-text">{currentQuestion.question}</div>

                {/* 選項 */}
                <div className="options-list">
                    {options.map((opt) => {
                        let className = 'pixel-btn pixel-btn-option';

                        if (selectedOption) {
                            if (opt === selectedOption) {
                                // 玩家選的選項
                                if (correctKey) {
                                    // Demo 模式有正確答案
                                    className += opt === correctKey ? ' correct' : ' wrong';
                                } else {
                                    className += ' selected';
                                }
                            }
                            // 顯示正確答案
                            if (correctKey && opt === correctKey && opt !== selectedOption) {
                                className += ' correct';
                            }
                        }

                        return (
                            <button
                                key={opt}
                                className={className}
                                onClick={() => handleSelect(opt)}
                                disabled={!!selectedOption}
                            >
                                <span
                                    style={{
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: '0.625rem',
                                        marginRight: 'var(--space-md)',
                                        color: 'var(--color-warning)',
                                    }}
                                >
                                    {opt}.
                                </span>
                                {currentQuestion[opt]}
                            </button>
                        );
                    })}
                </div>

                {/* 答題回饋文字 */}
                {selectedOption && correctKey && (
                    <div className={`answer-feedback ${selectedOption === correctKey ? 'correct' : 'wrong'}`}>
                        {selectedOption === correctKey ? '✓ CORRECT!' : `✗ WRONG — 正確答案：${correctKey}`}
                    </div>
                )}

                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
}
