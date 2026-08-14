"use client";

import { useRouter } from "next/navigation";
import LoginModal from "@/components/auth/login-modal";
import Header from "@/components/layout/header";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white dark:bg-[#121212] text-[#222222] dark:text-gray-100 flex flex-col justify-center items-center">
      <Header />
      <LoginModal
        initialMode="register"
        onClose={() => router.push("/")}
        onLoginSuccess={() => router.push("/")}
      />
    </main>
  );
}
