import { useState } from 'react';
import { supabase } from '../lib/supabase';
import './AuthGate.css';

export default function AuthGate() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: 'https://kterhar-edu.github.io/wknd/',
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="auth-gate">
        <div className="auth-gate__card">
          <h1 className="auth-gate__logo">wknd</h1>
          <div className="auth-gate__sent-icon">✉️</div>
          <p className="auth-gate__heading">Check your email</p>
          <p className="auth-gate__sub">We sent a sign-in link to<br /><strong>{email}</strong></p>
          <button className="auth-gate__back" onClick={() => setSent(false)}>
            Use a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-gate">
      <div className="auth-gate__card">
        <h1 className="auth-gate__logo">wknd</h1>
        <p className="auth-gate__tagline">Your weekends, tracked.</p>

        <div className="auth-gate__form">
          <input
            className="auth-gate__input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="your@email.com"
            autoComplete="email"
            autoFocus
          />
          <button
            className="auth-gate__btn"
            onClick={handleSend}
            disabled={!email.trim() || loading}
          >
            {loading ? 'Sending…' : 'Send sign-in link'}
          </button>
          {error && <p className="auth-gate__error">{error}</p>}
        </div>

        <p className="auth-gate__hint">No password. One tap from your email.</p>
      </div>
    </div>
  );
}
