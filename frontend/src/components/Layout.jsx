import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="px-10 pb-10">
      <nav className="flex justify-between items-center py-4 border-b border-white/10">
        <div>
          <Link to="/">
            <span className="text-2xl font-bold">Jobs App</span>
          </Link>
        </div>
        <div className="space-x-6">
          <Link to="/jobs" className="hover:text-blue-700 transition-colors duration-300">
            Jobs
          </Link>
          <Link to="/careers" className="hover:text-blue-700 transition-colors duration-300">
            Careers
          </Link>
          <Link to="/salaries" className="hover:text-blue-700 transition-colors duration-300">
            Salaries
          </Link>
          <Link to="/companies" className="hover:text-blue-700 transition-colors duration-300">
            Companies
          </Link>
        </div>
        <div className="space-x-4 flex">
          {isAuthenticated ? (
            <>
              <Link 
                to="/jobs/create" 
                className="hover:text-blue-700 transition-colors duration-300"
              >
                Post a job
              </Link>
              <button 
                onClick={handleLogout}
                className="hover:text-red-500 transition-colors duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="p-2 bg-blue-800 rounded-xl hover:bg-blue-700 transition-colors duration-300"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="p-2 bg-blue-800 rounded-xl hover:bg-blue-700 transition-colors duration-300"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="mt-10 max-w-[986px] mx-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;

