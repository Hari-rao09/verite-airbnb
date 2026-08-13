"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";

export default function LoginPage() {
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
});

console.log("Login successful:", response);

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

const user = {
  id: auth.user_id,
  name: auth.name,
  email: auth.email,
};

localStorage.setItem("user", JSON.stringify(user));

router.push("/");
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
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-center mb-2">
          Log in
        </h1>

        <p className="text-sm text-gray-500 text-center mb-8">
          Log in to continue your reservation
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full rounded-lg border px-3 py-3 outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full rounded-lg border px-3 py-3 outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#FF385C] py-3 text-white font-semibold hover:bg-[#e31c5f] disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/register")}
            className="font-semibold text-[#FF385C]"
          >
            Sign up
          </button>
        </div>
      </div>
    </main>
  );
}