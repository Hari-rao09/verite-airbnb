"use client";

import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
  initialMode?: "login" | "register";
}

export default function LoginModal({
  onClose,
  onLoginSuccess,
  initialMode = "login",
}: LoginModalProps) {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const switchMode = (newMode: "login" | "register") => {
    setMode(newMode);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        if (!name.trim()) {
          throw new Error("Please enter your full name");
        }

        // 1. Register user
        await authApi.register({
          name: name.trim(),
          email: email.trim(),
          password,
        });

        // 2. Automatically log in after registration
        const loginRes = (await authApi.login({
          email: email.trim(),
          password,
        })) as any;

        const token =
          loginRes.access_token ||
          loginRes.accessToken ||
          loginRes.token ||
          loginRes.data?.access_token ||
          loginRes.data?.token;

        if (!token) {
          throw new Error("Registration succeeded. Please log in.");
        }

        localStorage.setItem("token", token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: loginRes.user_id,
            name: loginRes.name || name.trim(),
            email: loginRes.email || email.trim(),
          })
        );

        onLoginSuccess();
        onClose();
        router.refresh();
      } else {
        // Log in
        const response = (await authApi.login({
          email: email.trim(),
          password,
        })) as any;

        const token =
          response.access_token ||
          response.accessToken ||
          response.token ||
          response.data?.access_token ||
          response.data?.token;

        if (!token) {
          throw new Error("Login succeeded but no token was returned");
        }

        localStorage.setItem("token", token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: response.user_id,
            name: response.name,
            email: response.email,
          })
        );

        onLoginSuccess();
        onClose();
        router.refresh();
      }
    } catch (err: any) {
      console.error("Auth action failed:", err);
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          (mode === "register" ? "Registration failed. Please try again." : "Invalid email or password.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />

      <div className="relative w-full max-w-[500px] rounded-3xl bg-white p-7 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 hover:bg-gray-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>

        {/* Logo / Icon */}
        <div className="flex justify-center pt-2">
          <div className="w-10 h-10 rounded-full bg-[#FF385C]/10 flex items-center justify-center text-[#FF385C]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 32 32"
              fill="currentColor"
            >
              <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.011.315c0 4.256-3.15 7.806-7.382 7.806-3.08 0-5.46-1.748-6.118-4.225-.658 2.477-3.038 4.225-6.118 4.225-4.232 0-7.382-3.55-7.382-7.806 0-1.127.315-2.298.971-3.711l.145-.353c.986-2.296 5.146-11.006 7.1-14.836l.533-1.025C9.537 1.963 10.992 1 13 1h3zm0 2c-1.378 0-2.316.634-3.414 2.593l-.478.918C10.222 10.25 6.096 18.892 5.14 21.12l-.128.312c-.595 1.282-.882 2.291-.882 3.197 0 3.224 2.36 5.806 5.37 5.806 2.668 0 4.67-1.854 4.88-4.48l.02-.358V25a1 1 0 0 1 2 0v.6c.19 2.91 2.212 4.895 4.9 4.895 3.01 0 5.37-2.582 5.37-5.806 0-.806-.239-1.73-.758-2.981l-.128-.312c-.956-2.228-5.082-10.87-6.968-14.609l-.478-.918C17.316 3.634 16.378 3 15 3h1z" />
            </svg>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="mt-5 flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`flex-1 pb-3 text-center text-base font-semibold transition-colors border-b-2 ${
              mode === "login"
                ? "border-black text-black"
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => switchMode("register")}
            className={`flex-1 pb-3 text-center text-base font-semibold transition-colors border-b-2 ${
              mode === "register"
                ? "border-black text-black"
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            Sign up
          </button>
        </div>

        <h2 className="mt-5 text-xl font-semibold text-gray-900">
          {mode === "register"
            ? "Create your account"
            : "Welcome back to Airbnb"}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {mode === "register"
            ? "Enter your details to register and start booking stays."
            : "Log in with your email and password."}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Name (Registration only) */}
          {mode === "register" && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={mode === "register"}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={
                  mode === "register"
                    ? "Create a secure password"
                    : "Enter your password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={4}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-11 text-sm outline-none focus:border-black transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Disclaimer for Sign Up */}
          {mode === "register" && (
            <p className="text-[11px] text-gray-500 pt-1 leading-relaxed">
              By selecting <strong>Agree and continue</strong>, you agree to
              Airbnb's Terms of Service and Privacy Policy.
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-[#FF385C] py-3.5 font-semibold text-white hover:bg-[#e31c5f] transition duration-200 disabled:opacity-50"
          >
            {loading
              ? mode === "register"
                ? "Creating account..."
                : "Logging in..."
              : mode === "register"
              ? "Agree and continue"
              : "Continue"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Social Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() =>
              alert("Google authentication is available in production.")
            }
            className="w-full rounded-xl border border-gray-300 py-3 text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-3"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            Continue with Google
          </button>

          <button
            type="button"
            onClick={() =>
              alert("Apple authentication is available in production.")
            }
            className="w-full rounded-xl border border-gray-300 py-3 text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-3"
          >
            <svg className="w-4 h-4 fill-black" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.05-7.62-7.85-11.77-14.42-6.41-10.12-11.44-21.68-15.08-34.69-3.64-13.01-5.46-24.87-5.46-35.58 0-14.65 3.65-26.68 10.95-36.1 7.3-9.42 16.53-14.22 27.69-14.42 5.01 0 10.51 1.34 16.5 4.02 5.99 2.68 9.77 4.07 11.34 4.17 1.89-.1 5.86-1.54 11.91-4.32 6.05-2.78 11.39-4.04 16.03-3.78 12.18.66 22.02 5.16 29.53 13.51-10.68 6.53-15.91 15.54-15.69 27.03.22 9.04 3.73 16.71 10.53 23.01 6.8 6.3 14.88 9.94 24.24 10.92-2.18 6.54-4.8 13.1-7.86 19.68zM119.22 31.85c0-7.39 2.62-14.28 7.86-20.67 5.24-6.39 11.75-10.45 19.53-12.18.22 1.09.33 2.18.33 3.27 0 7.39-2.73 14.52-8.19 21.39-5.46 6.87-12.01 10.95-19.65 12.24-.1-.87-.16-1.74-.16-2.61z" />
            </svg>
            Continue with Apple
          </button>
        </div>

        {/* Footer switch prompt */}
        <div className="mt-6 text-center text-xs text-gray-500">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("register")}
                className="font-bold text-gray-900 underline hover:text-black"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="font-bold text-gray-900 underline hover:text-black"
              >
                Log in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}