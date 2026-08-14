"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      if (!name.trim()) {
        throw new Error("Please enter your name");
      }

      await authApi.register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      // Automatically log in after registration
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

      router.push("/");
    } catch (err: any) {
      console.error("Registration failed:", err);

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-center mb-2">
          Sign up
        </h1>

        <p className="text-sm text-gray-500 text-center mb-8">
          Create an account to book and manage stays
        </p>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3.5 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              minLength={4}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#FF385C] py-3.5 text-white font-semibold hover:bg-[#e31c5f] transition duration-200 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#FF385C] hover:underline"
          >
            Log in
          </Link>
        </div>
      </div>
    </main>
  );
}
