import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";

import { Eye, EyeOff } from "lucide-react";

const inputClasses =
  "mt-2 w-full rounded-xl border border-blue-700 bg-blue-900/95 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-400 focus:border-yellow-400 focus:bg-blue-900/80";

const actionButtonClassName =
  "w-full rounded-xl py-3 text-[11px] tracking-[0.2em]";

const SignInPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Email address is required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    
    try {
      setLoading(true);

      const result = await login(
        cleanEmail,
        password
      );

      if (!result?.user) {
        throw new Error(
          "Login succeeded but no user information was returned."
        );
      }

      const role = String(
        result.user.role || ""
      )
        .trim()
        .toLowerCase();

      if (
        role === "admin" ||
        role === "seller"
      ) {
        navigate("/dashboard", {
          replace: true,
        });
        return;
      }

      if (role === "customer") {
        navigate("/products", {
          replace: true,
        });
        return;
      }

      setError(
        "Your account does not have a valid user role."
      );
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to log in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
        Log In
      </h1>

      <p className="mt-3 text-sm leading-6 text-zinc-600">
        Access your store account to review orders,
        saved items, and pickup details.
      </p>

      {error && (
        <div className="mt-6 rounded-xl border border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        className="mt-8 space-y-5"
        onSubmit={handleSubmit}
      >
        <div>
          <label
            htmlFor="signin-email"
            className="text-sm font-medium text-zinc-700"
          >
            Email Address
          </label>

          <input
            id="signin-email"
            type="email"
            placeholder="student@email.com"
            autoComplete="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            className={inputClasses}
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="signin-password"
            className="text-sm font-medium text-zinc-700"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="signin-password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              className={`${inputClasses} pr-12`}
              disabled={loading}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (previous) => !previous
                )
              }
              className="absolute right-3 top-1/2 mt-1 -translate-y-1/2 rounded-lg p-2 text-zinc-300 transition hover:text-yellow-400 focus:outline-none"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>

          <p className="mt-2 text-xs leading-5 text-zinc-500">
            Password must be at least 8 characters.
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 text-sm">
          <label className="flex items-center gap-2 text-zinc-600">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-blue-700 accent-yellow-400"
              disabled={loading}
            />

            <span>Remember me</span>
          </label>

          <button
            type="button"
            disabled={loading}
            className="font-medium text-zinc-700 transition hover:text-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Forgot Password?
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className={`${actionButtonClassName} bg-yellow-400 text-zinc-900 hover:bg-yellow-300`}
        >
          {loading
            ? "Logging In..."
            : "Log In"}
        </Button>

        <div className="grid gap-3 pt-2 sm:grid-cols-2">
          <Button
            type="button"
            variant="secondary"
            disabled={loading}
            className={`${actionButtonClassName} border border-yellow-400 text-white hover:bg-yellow-400`}
          >
            Log In with Google
          </Button>

          <Button
            type="button"
            variant="secondary"
            disabled={loading}
            className={`${actionButtonClassName} border border-yellow-400 text-white hover:bg-yellow-400`}
          >
            Log In with Apple
          </Button>
        </div>
      </form>

      <div className="mt-8 border-t border-blue-700 pt-6 text-sm text-zinc-600">
        No account yet?{" "}

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
