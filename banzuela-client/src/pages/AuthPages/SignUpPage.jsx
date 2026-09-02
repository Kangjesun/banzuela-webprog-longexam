import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";

import { Eye, EyeOff } from "lucide-react";

const inputClasses =
  "mt-2 w-full rounded-xl border border-blue-700 bg-blue-900/95 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-400 focus:border-yellow-400 focus:bg-blue-900/80";

const actionButtonClassName =
  "w-full rounded-xl py-3 text-[11px] tracking-[0.2em] font-bold uppercase";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.firstName.trim()) {
      setError("First name is required.");
      return;
    }

    if (!formData.lastName.trim()) {
      setError("Last name is required.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email address is required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!formData.contactNumber.trim()) {
      setError("Contact number is required.");
      return;
    }

    if (!/^09[0-9]{9}$/.test(formData.contactNumber)) {
      setError(
        "Please enter a valid Philippine mobile number starting with 09."
      );
      return;
    }

    if (!formData.address.trim()) {
      setError("Address is required.");
      return;
    }

    if (!formData.password) {
      setError("Password is required.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!formData.confirmPassword) {
      setError("Please confirm your password.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await signup({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        contactNumber: formData.contactNumber.trim(),
        address: formData.address.trim(),
        password: formData.password,
      });

      navigate("/auth/signin");
    } catch (err) {
      console.error("Signup error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
        Sign Up
      </h1>

      <p className="mt-3 text-sm leading-6 text-zinc-600">
        Create a Bulldog Exchange account to buy and sell
        products.
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
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="first-name"
              className="text-sm font-medium text-zinc-700"
            >
              First Name
            </label>

            <input
              id="first-name"
              name="firstName"
              type="text"
              placeholder="First name"
              autoComplete="given-name"
              value={formData.firstName}
              onChange={handleChange}
              className={inputClasses}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label
              htmlFor="last-name"
              className="text-sm font-medium text-zinc-700"
            >
              Last Name
            </label>

            <input
              id="last-name"
              name="lastName"
              type="text"
              placeholder="Last name"
              autoComplete="family-name"
              value={formData.lastName}
              onChange={handleChange}
              className={inputClasses}
              disabled={loading}
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="signup-email"
            className="text-sm font-medium text-zinc-700"
          >
            Email
          </label>

          <input
            id="signup-email"
            name="email"
            type="email"
            placeholder="your@email.com"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            className={inputClasses}
            disabled={loading}
            required
          />
        </div>

        <div>
          <label
            htmlFor="signup-contact-number"
            className="text-sm font-medium text-zinc-700"
          >
            Contact Number
          </label>

          <input
            id="signup-contact-number"
            name="contactNumber"
            type="tel"
            placeholder="09XXXXXXXXX"
            autoComplete="tel"
            value={formData.contactNumber}
            onChange={handleChange}
            className={inputClasses}
            pattern="09[0-9]{9}"
            minLength={11}
            maxLength={11}
            title="Enter a valid Philippine mobile number starting with 09."
            disabled={loading}
            required
          />

          <p className="mt-2 text-xs text-zinc-500">
            Example: 09123456789
          </p>
        </div>

        <div>
          <label
            htmlFor="signup-address"
            className="text-sm font-medium text-zinc-700"
          >
            Address
          </label>

          <textarea
            id="signup-address"
            name="address"
            placeholder="Enter your complete address"
            autoComplete="street-address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className={inputClasses}
            disabled={loading}
            required
          />

          <p className="mt-2 text-xs text-zinc-500">
            Enter your complete address for order and
            delivery purposes.
          </p>
        </div>

        <div>
          <label
            htmlFor="signup-password"
            className="text-sm font-medium text-zinc-700"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="signup-password"
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              className={`${inputClasses} pr-12`}
              minLength={8}
              disabled={loading}
              required
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
            Use a secure password with letters,
            numbers, and symbols.
          </p>
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className="text-sm font-medium text-zinc-700"
          >
            Confirm Password
          </label>

          <div className="relative">
            <input
              id="confirm-password"
              name="confirmPassword"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Confirm password"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`${inputClasses} pr-12`}
              minLength={8}
              disabled={loading}
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (previous) => !previous
                )
              }
              className="absolute right-3 top-1/2 mt-1 -translate-y-1/2 rounded-lg p-2 text-zinc-300 transition hover:text-yellow-400 focus:outline-none"
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
              disabled={loading}
            >
              {showConfirmPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className={`${actionButtonClassName} bg-yellow-400 text-zinc-900 hover:bg-yellow-300`}
        >
          {loading
            ? "Creating Account..."
            : "Create Account"}
        </Button>

        <div className="grid gap-3 pt-2 sm:grid-cols-2">
          <Button
            type="button"
            variant="secondary"
            disabled={loading}
            className={`${actionButtonClassName} border border-yellow-400 text-white hover:bg-yellow-400 hover:text-zinc-900`}
          >
            Sign Up with Google
          </Button>

          <Button
            type="button"
            variant="secondary"
            disabled={loading}
            className={`${actionButtonClassName} border border-yellow-400 text-white hover:bg-yellow-400 hover:text-zinc-900`}
          >
            Sign Up with Apple
          </Button>
        </div>
      </form>

      <div className="mt-8 border-t border-blue-700 pt-6 text-sm text-zinc-600">
        Already have an account?{" "}

        <Link
          to="/auth/signin"
          className="font-semibold text-yellow-400 transition hover:text-yellow-300"
        >
          Log In
        </Link>
      </div>
    </>
  );
};

export default SignUpPage;
