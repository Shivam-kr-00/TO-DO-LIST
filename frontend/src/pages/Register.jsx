import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
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
          <h1 className="text-xl font-semibold text-white">Create account</h1>
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
              <label className="block text-sm text-gray-300 mb-1">Full Name</label>
              <input
                id="register-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
                required
                autoFocus
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Email</label>
              <input
                id="register-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Password</label>
              <input
                id="register-password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 6 characters with a number"
                required
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Role</label>
              <select
                id="register-role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="input"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-green-400 hover:text-green-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
