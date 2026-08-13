"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function LoginModal({
  onClose,
  onLoginSuccess,
}: LoginModalProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await authApi.login({
        email,
        password,
      } as any);

      const auth = response as any;

      const token =
        auth.access_token ||
        auth.accessToken ||
        auth.token ||
        auth.data?.access_token ||
        auth.data?.token;

      if (!token) {
        throw new Error("Login succeeded but no token was returned");
      }

      localStorage.setItem("token", token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: auth.user_id,
          name: auth.name,
          email: auth.email,
        })
      );

      onLoginSuccess();
      onClose();

      router.refresh();
    } catch (error: any) {
      console.error("Login failed:", error);

      setError(
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-[480px] rounded-3xl bg-white p-8 shadow-2xl">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Logo */}
        <div className="flex justify-center pt-4">
          <div className="text-[#FF385C] text-4xl font-bold">
            ∧
          </div>
        </div>

        <h2 className="mt-4 text-center text-2xl font-semibold">
          Log in or sign up
        </h2>

        <form onSubmit={handleLogin} className="mt-8">

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <input
            type="email"
            placeholder="Phone number or email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-400 px-4 py-4 outline-none focus:border-black"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-3 w-full rounded-xl border border-gray-400 px-4 py-4 outline-none focus:border-black"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-xl bg-[#FF385C] py-4 font-semibold text-white hover:bg-[#e31c5f] disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Continue"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-300" />
          <span className="text-sm">or</span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>

        <button className="w-full rounded-xl border border-gray-400 py-3 font-medium hover:bg-gray-50">
          Continue with Google
        </button>

        <button className="mt-3 w-full rounded-xl border border-gray-400 py-3 font-medium hover:bg-gray-50">
          Continue with Apple
        </button>
      </div>
    </div>
  );
}