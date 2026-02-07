import { useState, useCallback } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import ResultPage from './pages/ResultPage';
import './index.css';

function AppRoutes() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState({
    playerId: '',
    questions: [],
    answers: [],
    result: null,
  });

  const handleGameStart = useCallback((playerId, questions) => {
    setGameState((prev) => ({
      ...prev,
      playerId,
      questions,
      answers: [],
      result: null,
    }));
    navigate('/game');
  }, [navigate]);

  const handleGameEnd = useCallback((result) => {
    setGameState((prev) => ({
      ...prev,
      result,
    }));
    navigate('/result');
  }, [navigate]);

  const handleAnswerUpdate = useCallback((answers) => {
    setGameState((prev) => ({
      ...prev,
      answers,
    }));
  }, []);

  const handleRestart = useCallback(() => {
    setGameState({
      playerId: '',
      questions: [],
      answers: [],
      result: null,
    });
    navigate('/');
  }, [navigate]);

  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage onGameStart={handleGameStart} />}
      />
      <Route
        path="/game"
        element={
          <GamePage
            playerId={gameState.playerId}
            questions={gameState.questions}
            onGameEnd={handleGameEnd}
            onAnswerUpdate={handleAnswerUpdate}
          />
        }
      />
      <Route
        path="/result"
        element={
          <ResultPage
            result={gameState.result}
            playerId={gameState.playerId}
            onRestart={handleRestart}
          />
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}
