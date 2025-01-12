import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useAuthStore } from '../../lib/store';

export function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <img
                src="https://i.postimg.cc/hjmyGVDp/fave.png" 
                alt="TeleCure Logo"
                className="h-8 w-8" 
              />
              <span className="text-2xl font-bold text-blue-600">teleCure hospital</span>
            </a>
          </div>
          
          {}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {isAuthenticated ? (
              <>
                <a
                  href="/symptoms"
                  className="text-base font-medium text-gray-500 hover:text-gray-900"
                >
                  Symptoms
                </a>
                <Button onClick={handleLogout}>Sign out</Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate('/login')}>
                  Sign in
                </Button>
                <Button onClick={() => navigate('/register')}>
                  Sign up
                </Button>
              </>
            )}
          </div>

          {}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {isAuthenticated ? (
                <>
                  <a
                    href="/symptoms"
                    className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  >
                    Symptoms
                  </a>
                  <Button onClick={handleLogout} className="w-full">
                    Sign out
                  </Button>
                </>
              ) : (
                <div className="space-y-2 px-3 py-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/login')}
                    className="w-full"
                  >
                    Sign in
                  </Button>
                  <Button onClick={() => navigate('/register')} className="w-full">
                    Sign up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
