import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/img/nubdexchange_logo.png';
import { useAuth } from '../context/AuthContext';

const publicLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Products', to: '/products' },
];

const customerLinks = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Cart', to: '/cart' },
  { label: 'Orders', to: '/orders' },
  { label: 'Reviews', to: '/reviews' },
  { label: 'Profile', to: '/profile' },
];

const navLinkClassName = ({ isActive }) =>
  [
    'rounded-full border-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] transition',
    isActive
      ? 'border-yellow-400 bg-yellow-400 text-blue-950'
      : 'border-transparent text-blue-100 hover:border-yellow-400 hover:bg-blue-900 hover:text-yellow-300',
  ].join(' ');

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isCustomer = user?.role === 'customer';

  const handleLogout = () => {
    logout();
    navigate('/auth/signin');
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-2 border-yellow-400 bg-blue-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-8xl items-center justify-between px-3 py-3 sm:px-4 sm:py-3 lg:px-6">

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 pl-19">
          <img
            src={logo}
            alt="BulldogEx"
            className="h-9 w-9 rounded-full border-2 border-yellow-400 bg-blue-900 object-contain shrink-0"
          />

          <p className="text-xl font-bold text-yellow-400 leading-none">
            BulldogEx Shop
          </p>
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">

          <nav className="flex items-center gap-2">

            {(isCustomer ? customerLinks : publicLinks).map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={navLinkClassName}
              >
                {link.label}
              </NavLink>
            ))}

          </nav>

          <div className="h-6 w-px bg-yellow-400/40 mx-2" />

          {/* Public Authentication Links */}
          {!user && (
            <div className="flex items-center gap-2">
              <NavLink
                to="/auth/signin"
                className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-100 hover:text-yellow-300 transition"
              >
                Sign In
              </NavLink>

              <NavLink
                to="/auth/signup"
                className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-100 hover:text-yellow-300 transition"
              >
                Sign Up
              </NavLink>
            </div>
          )}

          {/* Customer Logout */}
          {isCustomer && (
            <button
              type="button"
              onClick={handleLogout}
              className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-100 hover:text-yellow-300 transition"
            >
              Logout
            </button>
          )}

        </div>

      </div>
    </header>
  );
};

export default NavBar;
