import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111827] p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-white">Sign in</h1>
          <p className="text-sm text-gray-400 mt-1">TaskFlow — Task Management</p>
        </div>

        <div className="card p-6">
          {error && (
            <div className="mb-4 px-3 py-2 rounded bg-red-950 border border-red-800 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Email</label>
              <input
                id="login-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
                autoFocus
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Password</label>
              <input
                id="login-password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                className="input"
              />
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            No account?{' '}
            <Link to="/register" className="text-green-400 hover:text-green-300">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
