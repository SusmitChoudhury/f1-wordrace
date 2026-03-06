import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Home from './components/Home';
import GameArea from './components/GameArea';

const ScrollToSection = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (pathname === '/' && hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [pathname, hash]);

  return null;
};

function App() {
  return (
    <Router>
      <ScrollToSection />
      <div className="app-container">
        <header style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface)' }}>
          <h1 className="heading-3" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <span style={{ color: 'var(--primary)', fontStyle: 'italic', fontWeight: 800 }}>FI</span> WordRace
          </h1>

          <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link to="/#home" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600 }}>Home</Link>
            <Link to="/#how-it-works" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600 }}>How It Works</Link>
            <Link to="/#features" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600 }}>Features</Link>
            <Link to="/#about" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600 }}>About</Link>
            <span style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 0.5rem' }}></span>
            <Link to="/multiplayer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Multiplayer</Link>
            <Link to="/multiplayer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Single Player</Link>
          </nav>
        </header>

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/multiplayer" element={<Home />} />
            <Route path="/room/:roomId" element={<GameArea />} />
          </Routes>
        </main>

        <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '2rem 3rem', marginTop: 'auto' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '2rem' }}>
            {/* Left Side: Logo */}
            <div>
              <h2 className="heading-3" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--primary)', fontStyle: 'italic', fontWeight: 800 }}>FI</span> WordRace
              </h2>
            </div>

            {/* Center: Quick Links */}
            <div style={{ display: 'flex', gap: '2rem' }}>
              <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-main)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Home</Link>
              <Link to="/multiplayer" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-main)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Multiplayer</Link>
              <Link to="/multiplayer" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-main)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Single Player</Link>
            </div>

            {/* Right Side: Copyright */}
            <div>
              <p className="text-body" style={{ fontSize: '0.875rem' }}>
                © 2026 FI WordRace. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
