import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-[#1f2937] border-b border-[#374151]">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <span className="text-white font-semibold">TaskFlow</span>

        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 hidden sm:block">
              {user.name}
              {user.role === 'admin' && (
                <span className="ml-2 text-xs bg-[#111827] border border-[#374151] text-gray-400 px-2 py-0.5 rounded">
                  admin
                </span>
              )}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
