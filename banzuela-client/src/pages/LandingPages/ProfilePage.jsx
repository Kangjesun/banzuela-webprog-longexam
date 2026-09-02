import { useState } from "react";

import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import { updateUser, changePassword } from "../../services/UserService";

const inputClasses =
  "mt-2 w-full rounded-xl border-2 border-yellow-400 bg-white px-4 py-3 text-sm font-lexend text-zinc-900 outline-none focus:border-blue-600";

const EyeIcon = ({ hidden }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-5 w-5"
    aria-hidden="true"
  >
    {hidden ? (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3l18 18"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.6 10.6a2 2 0 0 0 2.8 2.8"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.9 5.1A10.7 10.7 0 0 1 12 4.9c6 0 9.75 7.1 9.75 7.1a17.3 17.3 0 0 1-4.1 4.8M6.2 6.2C3.8 7.8 2.25 12 2.25 12s3.75 7.1 9.75 7.1c1.2 0 2.3-.2 3.4-.6"
        />
      </>
    ) : (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12s3.75-7.1 9.75-7.1S21.75 12 21.75 12s-3.75 7.1-9.75 7.1S2.25 12 2.25 12Z"
        />
        <circle cx="12" cy="12" r="2.5" />
      </>
    )}
  </svg>
);

const AccountPage = () => {
  const { user } = useAuth();
  const userId = user?.id || user?._id;

  const [profile, setProfile] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    contactNumber: user?.contactNumber || "",
    address: user?.address || "",
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [error, setError] = useState("");

  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const handleProfileChange = (event) => {
    setProfile({
      ...profile,
      [event.target.name]: event.target.value,
    });
  };

  const handlePasswordChange = (event) => {
    setPassword({
      ...password,
      [event.target.name]: event.target.value,
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((current) => ({
      ...current,
      [field]: !current[field],
    }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setProfileMessage("");
    setPasswordMessage("");

    const firstName = profile.firstName.trim();
    const lastName = profile.lastName.trim();
    const email = profile.email.trim().toLowerCase();
    const contactNumber = profile.contactNumber.trim();
    const address = profile.address.trim();

    if (!firstName) {
      setError("First name is required.");
      return;
    }

    if (!lastName) {
      setError("Last name is required.");
      return;
    }

    if (!email) {
      setError("Email address is required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!contactNumber) {
      setError("Contact number is required.");
      return;
    }

    if (!/^09[0-9]{9}$/.test(contactNumber)) {
      setError(
        "Please enter a valid Philippine mobile number starting with 09."
      );
      return;
    }

    if (!address) {
      setError("Address is required.");
      return;
    }

    try {
      const { data } = await updateUser(userId, {
        firstName,
        lastName,
        email,
        contactNumber,
        address,
      });

      const updatedUser = data.data || data.user;

      setProfile({
        firstName: updatedUser.firstName || "",
        lastName: updatedUser.lastName || "",
        email: updatedUser.email || "",
        contactNumber: updatedUser.contactNumber || "",
        address: updatedUser.address || "",
      });

      setProfileMessage("Profile updated successfully.");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to update profile."
      );
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setPasswordMessage("");
    setProfileMessage("");

    if (password.newPassword !== password.confirmNewPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const { data } = await changePassword(userId, {
        currentPassword: password.currentPassword,
        newPassword: password.newPassword,
      });

      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });

      setPasswordMessage(
        data.message || "Password changed successfully."
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to change password."
      );
    }
  };

  if (!user) {
    return (
      <section className="border-y-2 border-yellow-400 bg-blue-950/95 p-6">
        <h1 className="font-lexend text-2xl font-bold text-white">
          Please sign in to manage your account.
        </h1>

        <Button
          to="/auth/signin"
          variant="primary"
          className="mt-6"
        >
          Sign In
        </Button>
      </section>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <section className="border-y-2 border-yellow-400 bg-blue-950/95 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <p className="text-[11px] font-lexend font-semibold uppercase tracking-[0.28em] text-yellow-400">
          Account
        </p>

        <h1 className="mt-2 text-3xl font-lexend font-bold text-white">
          Manage your account
        </h1>

        <p className="mt-3 font-lexend text-sm text-yellow-100">
          Update your personal information and account password.
        </p>
      </section>

      {error && (
        <div className="border-y-2 border-red-400 bg-red-950/40 px-4 py-4 text-sm font-lexend text-red-200 sm:px-6 lg:px-8">
          {error}
        </div>
      )}

      <section className="border-y-2 border-yellow-400 bg-blue-950/95 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border-2 border-yellow-400 bg-zinc-200 p-5 sm:p-6">
          <h2 className="text-2xl font-lexend font-semibold text-zinc-900">
            Personal information
          </h2>

          {profileMessage && (
            <p className="mt-4 rounded-xl border-2 border-green-400 bg-green-50 px-4 py-3 text-sm font-lexend text-green-700">
              {profileMessage}
            </p>
          )}

          <form
            onSubmit={handleProfileSubmit}
            className="mt-6 space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="font-lexend text-sm text-zinc-900">
                First name

                <input
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleProfileChange}
                  className={inputClasses}
                  required
                />
              </label>

              <label className="font-lexend text-sm text-zinc-900">
                Last name

                <input
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleProfileChange}
                  className={inputClasses}
                  required
                />
              </label>
            </div>

            <label className="block font-lexend text-sm text-zinc-900">
              Email

              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                className={inputClasses}
                required
              />
            </label>

            <label className="block font-lexend text-sm text-zinc-900">
              Contact number

              <input
                type="tel"
                name="contactNumber"
                value={profile.contactNumber}
                onChange={handleProfileChange}
                className={inputClasses}
                pattern="09[0-9]{9}"
                minLength={11}
                maxLength={11}
                title="Enter a valid Philippine mobile number starting with 09."
                required
              />
            </label>

            <label className="block font-lexend text-sm text-zinc-900">
              Address

              <textarea
                name="address"
                value={profile.address}
                onChange={handleProfileChange}
                rows={3}
                className={inputClasses}
                placeholder="Enter your complete address"
                autoComplete="street-address"
                required
              />

              <p className="mt-2 text-xs text-zinc-600">
                Your address is used for order and delivery purposes.
              </p>
            </label>

            <button
              type="submit"
              className="rounded-full border-2 border-yellow-400 bg-blue-900/95 px-5 py-3 text-sm font-semibold text-white transition hover:bg-yellow-300"
            >
              Save profile
            </button>
          </form>
        </div>
      </section>

      <section className="border-y-2 border-yellow-400 bg-blue-950/95 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border-2 border-yellow-400 bg-zinc-200 p-5 sm:p-6">
          <h2 className="text-2xl font-lexend font-semibold text-zinc-900">
            Change password
          </h2>

          {passwordMessage && (
            <p className="mt-4 rounded-xl border-2 border-green-400 bg-green-50 px-4 py-3 text-sm font-lexend text-green-700">
              {passwordMessage}
            </p>
          )}

          <form
            onSubmit={handlePasswordSubmit}
            className="mt-6 space-y-4"
          >
            {[
              ["currentPassword", "Current password"],
              ["newPassword", "New password"],
              ["confirmNewPassword", "Confirm new password"],
            ].map(([name, label]) => (
              <label
                key={name}
                className="block font-lexend text-sm text-zinc-900"
              >
                {label}

                <div className="relative">
                  <input
                    type={showPasswords[name] ? "text" : "password"}
                    name={name}
                    value={password[name]}
                    onChange={handlePasswordChange}
                    className={`${inputClasses.replace(
                      "mt-2 ",
                      ""
                    )} pr-12`}
                    minLength={
                      name === "currentPassword" ? undefined : 8
                    }
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      togglePasswordVisibility(name)
                    }
                    className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-zinc-500 transition hover:text-blue-700"
                    aria-label={
                      showPasswords[name]
                        ? `Hide ${label}`
                        : `Show ${label}`
                    }
                  >
                    <EyeIcon hidden={showPasswords[name]} />
                  </button>
                </div>
              </label>
            ))}

            <button
              type="submit"
              className="rounded-full border-2 border-yellow-400 bg-blue-900/95 px-5 py-3 text-sm font-semibold text-white transition hover:bg-yellow-300"
            >
              Change password
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default AccountPage;