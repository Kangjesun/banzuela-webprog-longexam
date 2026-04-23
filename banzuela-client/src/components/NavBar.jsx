import { NavLink } from 'react-router-dom';
import logo from '../assets/img/nubdexchange_logo.png';

const links = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Products', to: '/products' },
  { label: 'Sign In', to: '/auth/signin' },
  { label: 'Sign Up', to: '/auth/signup' },
];

const navLinkClassName = ({ isActive }) =>
  [
    'rounded-full border-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] transition',
    isActive
      ? 'border-yellow-400 bg-yellow-400 text-blue-950'
      : 'border-transparent text-blue-100 hover:border-yellow-400 hover:bg-blue-900 hover:text-yellow-300',
  ].join(' ');

const NavBar = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-2 border-yellow-400 bg-blue-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-8xl items-center justify-between px-3 py-3 sm:px-4 sm:py-3 lg:px-6">
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

        <div className="hidden md:flex items-center gap-2">
          <nav className="flex items-center gap-2">
            {links.slice(0, 3).map((link) => (
              <NavLink
                key={link.to} to={link.to} end={link.to === '/'} className={navLinkClassName}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="h-6 w-px bg-yellow-400/40 mx-2" />

          <div className="flex items-center gap-2">
            {links.slice(3).map((link) => (
              <NavLink key={link.to} to={link.to}
                className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-100 hover:text-yellow-300 transition"
              >
                {link.label}
              </NavLink>
            ))}
          </div>

        </div>

      </div>
    </header>
  );
};

export default NavBar;