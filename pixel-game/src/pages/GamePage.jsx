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
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // 若沒有題目資料，導回首頁
    useEffect(() => {
        if (!questions || questions.length === 0) {
            navigate('/');
        }
    }, [questions, navigate]);

    // 隨機產生每關的關主頭像
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

            setTimeout(async () => {
                if (currentIndex < totalQuestions - 1) {
                    // 下一題
                    setCurrentIndex((prev) => prev + 1);
                    setSelectedOption(null);
                    setIsTransitioning(false);
                } else {
                    // 最後一題，提交答案
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
            }, 800);
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
                        if (selectedOption === opt) {
                            className += ' selected';
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

                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
}
