import { Link } from 'react-router-dom';
import Button from '../../components/Button';

const inputClasses =
  'mt-2 w-full rounded-xl border border-blue-700 bg-blue-900/95 px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-yellow-400 focus:bg-blue-900/80';

const actionButtonClassName =
  'w-full rounded-xl py-3 text-[11px] tracking-[0.2em]';

const SignInPage = () => {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
        Log In
      </h1>
      <p className="mt-3 text-sm leading-6 text-zinc-600">
        Access your store account to review orders, saved items, and pickup details.
      </p>
      <form className="mt-8 space-y-5">

        <div>
          <label htmlFor="signin-email" className="text-sm font-medium text-zinc-700">
            Email Address
          </label>

          <input
            id="signin-email"
            type="email"
            placeholder="student@email.com"
            autoComplete="email"
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="signin-password" className="text-sm font-medium text-zinc-700">
            Password
          </label>

          <input
            id="signin-password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            className={inputClasses}
          />

          <p className="mt-2 text-xs leading-5 text-zinc-500">
            It must be a combination of minimum 8 letters, numbers, and symbols.
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 text-sm">
          <label className="flex items-center gap-2 text-zinc-600">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-blue-700 accent-yellow-400"
            />
            <span>Remember me</span>
          </label>
          <button
            type="button"
            className="font-medium text-zinc-700 transition hover:text-yellow-400"
          >
            Forgot Password?
          </button>

        </div>

        <Button
          type="submit"
          variant="primary"
          className={`${actionButtonClassName} bg-yellow-400 text-zinc-900 hover:bg-yellow-300`}
        >
          Log In
        </Button>

        <div className="grid gap-3 pt-2 sm:grid-cols-2">
          <Button
            type="button"
            variant="secondary"
            className={`${actionButtonClassName} border border-yellow-400 text-white hover:bg-yellow-400`}
          >
            Log In with Google
          </Button>

          <Button
            type="button"
            variant="secondary"
            className={`${actionButtonClassName} border border-yellow-400 text-white hover:bg-yellow-400`}
          >
            Log In with Apple
          </Button>
        </div>
      </form>

      <div className="mt-8 border-t border-blue-700 pt-6 text-sm text-zinc-600">
        No account yet?{' '}
        <Link
          to="/auth/signup"
          className="font-semibold text-yellow-400 transition hover:text-yellow-300"
        >
          Sign Up
        </Link>
      </div>
    </>
  );
};

export default SignInPage;