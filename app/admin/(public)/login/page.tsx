"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";

export default function AdminLoginPage() {
  const { t } = useLanguage();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const form = event.currentTarget;
    const accessCode = String(new FormData(form).get("accessCode") || "");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessCode }),
      });
      const result = await response.json();
      form.reset();

      if (!response.ok) {
        setError(result.error || t.adminLogin.invalidCode);
        return;
      }

      window.location.assign("/admin");
    } catch {
      form.reset();
      setError(t.adminLogin.networkError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-primary-blue-100 dark:bg-slate-950 px-5 py-12 sm:px-10 transition-colors">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link href="/" className="text-sm font-bold text-black-100 dark:text-white hover:text-primary-blue transition">
            {t.adminLogin.brand}
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <LanguageSwitcher />
            <Link href="/" className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-black-100 dark:hover:text-white transition">
              {t.adminLogin.backToSite}
            </Link>
          </div>
        </div>

        <div className="grid overflow-hidden rounded-lg bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 shadow-sm md:grid-cols-[1fr_420px]">
          <section className="hidden bg-black-100 dark:bg-slate-950 p-10 text-white md:block">
            <p className="text-sm font-semibold uppercase text-gray-400">{t.adminLogin.administration}</p>
            <h1 className="mt-16 text-4xl font-extrabold">{t.adminLogin.carInventory}</h1>
            <p className="mt-4 max-w-sm text-white/75">{t.adminLogin.adminDesc}</p>
          </section>

          <section className="p-6 sm:p-10 ltr:text-left rtl:text-right bg-white dark:bg-slate-900">
            <h1 className="text-2xl font-bold text-black-100 dark:text-white">{t.adminLogin.adminAccess}</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t.adminLogin.enterCodeDesc}</p>

            <form onSubmit={submitCode} className="mt-7">
              <label htmlFor="admin-access-code" className="block text-sm font-semibold text-black-100 dark:text-gray-200">
                {t.adminLogin.accessCode}
              </label>
              <input
                id="admin-access-code"
                name="accessCode"
                type="password"
                minLength={8}
                maxLength={8}
                pattern="[A-Za-z0-9]{8}"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                required
                aria-describedby={error ? "admin-login-error" : undefined}
                className="mt-2 w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-black-100 dark:text-white px-3 py-3 font-mono tracking-[0.2em] outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 text-center"
              />
              {error && <p id="admin-login-error" role="alert" className="mt-3 text-sm text-red-700 dark:text-red-400">{error}</p>}
              <button
                disabled={submitting}
                type="submit"
                className="mt-5 w-full rounded-md bg-primary-blue px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 transition disabled:cursor-wait disabled:opacity-60"
              >
                {submitting ? t.adminLogin.verifying : t.adminLogin.continue}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}