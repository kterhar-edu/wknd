import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './AuthGate.css';

export default function AuthGate() {
  const [step, setStep]       = useState('email'); // 'email' | 'code'
  const [email, setEmail]     = useState('');
  const [digits, setDigits]   = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const inputRefs = useRef([]);

  // Auto-focus first code box when step changes
  useEffect(() => {
    if (step === 'code') {
      setTimeout(() => inputRefs.current[0]?.focus(), 120);
    }
  }, [step]);

  // ── Step 1: send OTP ────────────────────────────────────────────────────────
  const handleSend = async (e) => {
    e?.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setDigits(['', '', '', '', '', '']);
      setStep('code');
    }
  };

  // ── Step 2: verify OTP ──────────────────────────────────────────────────────
  const verify = async (code) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code,
      type: 'email',
    });
    setLoading(false);
    if (error) {
      setError('Wrong code — check your email and try again.');
      setDigits(['', '', '', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    }
    // On success App.jsx's onAuthStateChange handles the session automatically
  };

  const handleDigitChange = (index, value) => {
    // Allow paste of full 6-digit code into any box
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length > 1) {
      const newDigits = [...digits];
      cleaned.split('').slice(0, 6 - index).forEach((ch, i) => {
        if (index + i < 6) newDigits[index + i] = ch;
      });
      setDigits(newDigits);
      const next = Math.min(5, index + cleaned.length);
      inputRefs.current[next]?.focus();
      const code = newDigits.join('');
      if (code.length === 6) verify(code);
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = cleaned;
    setDigits(newDigits);
    if (cleaned && index < 5) inputRefs.current[index + 1]?.focus();

    const code = newDigits.join('');
    if (code.length === 6) verify(code);
  };

  const handleDigitKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      const newDigits = [...digits];
      newDigits[index - 1] = '';
      setDigits(newDigits);
      inputRefs.current[index - 1]?.focus();
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  if (step === 'code') {
    return (
      <div className="auth-gate">
        <div className="auth-gate__card">
          <h1 className="auth-gate__logo">wknd</h1>
          <div className="auth-gate__sent-icon">✉️</div>
          <p className="auth-gate__heading">Enter your code</p>
          <p className="auth-gate__sub">
            We sent a 6-digit code to<br /><strong>{email}</strong>
          </p>

          <div className="auth-gate__digits">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={el => inputRefs.current[i] = el}
                className="auth-gate__digit"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={d}
                onChange={e => handleDigitChange(i, e.target.value)}
                onKeyDown={e => handleDigitKeyDown(i, e)}
                disabled={loading}
              />
            ))}
          </div>

          {loading && <p className="auth-gate__hint">Verifying…</p>}
          {error && <p className="auth-gate__error">{error}</p>}

          <button
            className="auth-gate__back"
            onClick={() => { setStep('email'); setError(null); }}
          >
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

        <form className="auth-gate__form" onSubmit={handleSend}>
          <input
            className="auth-gate__input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            autoComplete="email"
            autoFocus
            required
          />
          <button
            className="auth-gate__btn"
            type="submit"
            disabled={!email.trim() || loading}
          >
            {loading ? 'Sending…' : 'Send code'}
          </button>
          {error && <p className="auth-gate__error">{error}</p>}
        </form>

        <p className="auth-gate__hint">No password. A 6-digit code arrives in your email.</p>
      </div>
    </div>
  );
}
