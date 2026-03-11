import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { GameProvider } from './context/GameContext';
import AppRoutes from './routes';
import SplashScreen from './pages/SplashScreen';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <SplashScreen />;

  return (
    <BrowserRouter>
      <ThemeProvider>
        <GameProvider>
          <AppRoutes />
        </GameProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;