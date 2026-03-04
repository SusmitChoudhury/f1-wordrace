
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import GameArea from './components/GameArea';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)' }}>
          <h1 className="heading-3" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--primary)', fontStyle: 'italic', fontWeight: 800 }}>FI</span> WordRace
          </h1>
        </header>

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<Home />} />
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
              <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-main)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Multiplayer</Link>
              <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-main)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Single Player</Link>
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
