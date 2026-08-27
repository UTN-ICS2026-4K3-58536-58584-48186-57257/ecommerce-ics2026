import { useState } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import LoginModal from '../../auth/components/LoginModal';
import RegisterModal from '../../auth/components/RegisterModal';
import useAuth from '../../auth/hook/useAuth';

const ORANGE = '#F3C9A7';
const ORANGE_DARK = '#E8B18F';

function StoreHeader() {
  const navigate = useNavigate();
  const { isAuthenticated, user, signout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e) => {
    const term = e.target.value;

    if (window.location.pathname !== '/') {
      navigate(`/?search=${term}`);
    } else {
      setSearchParams(prev => {
        if (term) prev.set('search', term);
        else prev.delete('search');

        return prev;
      });
    }
  };

  const handleLogout = () => {
    signout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const linkStyle = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-[#eeb685ff]' : 'text-gray-600 hover:text-orange-400'}`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105" style={{ backgroundColor: ORANGE }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3 4 7l8 4 8-4-8-4Z" />
                <path d="M4 7v6l8 4 8-4V7" />
                <path d="M12 3v8" />
              </svg>
            </div>
            <span className="font-bold text-xl text-[#F3C9A7] tracking-tight">Blow</span>
          </div>

          <div className="hidden md:flex items-center gap-8 flex-1 justify-center px-8">
            <nav className="flex gap-6">
              <NavLink to="/" className={linkStyle}>Productos</NavLink>
              <NavLink to="/cart" className={linkStyle}>Carrito</NavLink>
            </nav>

            <div className="relative w-full max-w-xs">
              <input
                type="text"
                className="block w-full pl-4 pr-3 py-2 border border-gray-200 rounded-full text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all"
                placeholder="Buscar productos..."
                onChange={handleSearch}
                defaultValue={searchParams.get('search') || ''}
              />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="text-right mr-2">
                  <p className="text-xs text-gray-400 font-medium">Bienvenido/a</p>
                  <p className="text-sm font-bold text-gray-700 leading-none">{user?.username}</p>
                </div>
                <button onClick={handleLogout} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-500 text-sm font-medium transition-all">
                  Salir
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setOpenLogin(true)} className="px-4 py-2 rounded-lg text-gray-600 hover:bg-orange-50 hover:text-orange-600 font-medium text-sm transition-colors">
                  Ingresar
                </button>
                <button
                  onClick={() => setOpenRegister(true)}
                  className="px-5 py-2 rounded-lg text-white font-medium text-sm shadow-sm hover:shadow transition-all"
                  style={{ backgroundColor: ORANGE }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = ORANGE_DARK}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = ORANGE}
                >
                  Registrarse
                </button>
              </>
            )}
          </div>

          <div className="flex md:hidden items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 pt-2 space-y-3 shadow-lg">
          <input
            type="text"
            className="block w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-orange-300"
            placeholder="Buscar..."
            onChange={handleSearch}
            defaultValue={searchParams.get('search') || ''}
          />
          <NavLink to="/" className="block py-2 font-medium text-gray-700 hover:text-orange-500" onClick={() => setIsMenuOpen(false)}>Productos</NavLink>
          <NavLink to="/cart" className="block py-2 font-medium text-gray-700 hover:text-orange-500" onClick={() => setIsMenuOpen(false)}>Carrito</NavLink>
          <div className="border-t border-gray-100 pt-3">
            {isAuthenticated ? (
              <button onClick={handleLogout} className="w-full text-left py-2 text-red-600 font-medium">Cerrar Sesión ({user?.username})</button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => { setOpenLogin(true); setIsMenuOpen(false); }} className="py-2 rounded-lg border border-gray-200 text-gray-700 font-medium">Ingresar</button>
                <button onClick={() => { setOpenRegister(true); setIsMenuOpen(false); }} className="py-2 rounded-lg text-white font-medium" style={{ backgroundColor: ORANGE }}>Registrarse</button>
              </div>
            )}
          </div>
        </div>
      )}

      {openLogin && <LoginModal onClose={() => setOpenLogin(false)} />}
      {openRegister && <RegisterModal onClose={() => setOpenRegister(false)} />}
    </header>
  );
}

export default StoreHeader;