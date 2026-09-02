import { Link } from "react-router-dom";
import Logo from "../assets/img/nubdexchange_logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-900 px-4 py-8">
      <div className="mx-auto max-w-4xl flex items-center justify-between">

        <div className="flex items-center gap-3">
          <img
            src={Logo}
            alt="BulldogEx Logo"
            className="h-10 w-10 rounded-md object-cover border border-zinc-700"
          />
          <div className="leading-tight">
            <h2 className="text-sm font-bold text-white">
              BulldogEx Shop
            </h2>
            <p className="text-[10px] text-zinc-400">
              Campus essentials
            </p>
          </div>
        </div>


        <div className="flex items-start gap-14">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Navigation
            </p>
            <div className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <Link to="/" className="hover:text-white">Home</Link>
              <Link to="/products" className="hover:text-white">Products</Link>
              <Link to="/cart" className="hover:text-white">Cart</Link>
            </div>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Account
            </p>
            <div className="flex gap-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <Link to="/auth/signin" className="hover:text-white">Sign In</Link>
              <Link to="/auth/signup" className="hover:text-white">Sign Up</Link>
            </div>
          </div>

        </div>
      </div>

      <div className="mx-auto mt-6 max-w-4xl border-t border-zinc-700 pt-3 text-center text-[10px] text-zinc-500">
        © {new Date().getFullYear()} BulldogEx Shop
      </div>
    </footer>
  );
};

export default Footer;