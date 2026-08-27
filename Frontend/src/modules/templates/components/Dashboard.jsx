import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hook/useAuth';
import Button from '../../shared/components/Button';

function Dashboard() {
  const [openMenu, setOpenMenu] = useState(false);

  const navigate = useNavigate();
  const { signout } = useAuth();

  const logout = () => {
    signout();
    navigate('/login');
  };

  const getLinkStyles = ({ isActive }) => `
    pl-4 w-full block py-3 rounded-lg font-medium transition-all
    ${
  isActive
    ? 'bg-[var(--color-bg-active)] text-[var(--color-text-main)] shadow-sm'
    : 'text-gray-600 hover:bg-[var(--color-bg-hover)]'
}
  `;

  const renderLogoutButton = (mobile = false) => (
    <Button
      className={`
        ${mobile ? 'block w-full sm:hidden' : 'hidden sm:block'}
        rounded-lg px-4 py-2 font-semibold transition-all border
        bg-white text-[var(--color-status-error)] border-transparent
        hover:bg-[var(--color-status-error)] hover:text-white
      `}
      onClick={logout}
    >
      Cerrar sesión
    </Button>
  );

  return (
    <div
      className="
        min-h-screen
        grid grid-cols-1 grid-rows-[auto_1fr]
        sm:grid-cols-[260px_1fr] sm:gap-4
        bg-[var(--color-bg-dashboard)]
      "
    >

      <header
        className="
          flex items-center justify-between
          p-4 shadow-sm rounded-b-xl
          bg-white border-b border-gray-200
          sm:col-span-2
        "
      >

        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: 'var(--color-brand-primary)' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3 4 7l8 4 8-4-8-4Z" />
              <path d="M4 7v6l8 4 8-4V7" />
              <path d="M12 3v8" />
            </svg>
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-2xl font-semibold text-[var(--color-brand-secondary)]">
              Blow
            </span>
            <span className="text-xs text-gray-500 -mt-0.5">
              Panel de administración
            </span>
          </div>
        </div>

        {renderLogoutButton()}

        <button
          className="sm:hidden text-3xl text-[var(--color-text-main)]"
          onClick={() => setOpenMenu(!openMenu)}
        >
          {openMenu ? '×' : '≡'}
        </button>
      </header>

      <aside
        className={`
          fixed sm:static
          top-0 bottom-0 left-0 z-10
          w-64 p-6 bg-white shadow-xl sm:shadow-none
          border-r border-gray-200
          transition-all duration-300 ease-in-out
          ${openMenu ? 'translate-x-0' : '-translate-x-64 sm:translate-x-0'}
          flex flex-col justify-between
        `}
      >
        <nav>
          <ul className="flex flex-col gap-2 mt-2">
            <li>
              <NavLink to="/admin" className={getLinkStyles}>
                Principal
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/products" className={getLinkStyles}>
                Productos
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/orders" className={getLinkStyles}>
                Órdenes
              </NavLink>
            </li>
          </ul>

          <hr className="mt-6 border-gray-300/40" />
        </nav>

        {renderLogoutButton(true)}
      </aside>

      <main
        className="
          p-5 overflow-y-auto
          bg-white rounded-xl shadow-md border border-gray-200
        "
      >
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;