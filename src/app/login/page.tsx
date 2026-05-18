"use client";

import Link from "next/link";
import { useState } from "react";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";

export default function LoginPage() {
  const { t } = useDemoLocale();
  const [step, setStep] = useState<"credentials" | "mfa">("credentials");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-eco-navy via-[#0f2d4a] to-eco-teal-dark px-6 py-12">
      <div className="w-full max-w-md">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          {t("login_kicker")}
        </p>
        <h1 className="mt-3 text-center text-2xl font-semibold text-white">
          {step === "credentials" ? t("login_titleCred") : t("login_titleMfa")}
        </h1>
        <p className="mt-2 text-center text-sm text-white/70">{t("login_sub")}</p>

        <form
          className="mt-8 rounded-2xl border border-white/10 bg-white/95 p-6 shadow-2xl backdrop-blur"
          onSubmit={(e) => {
            e.preventDefault();
            if (step === "credentials") setStep("mfa");
            else window.location.href = "/rm";
          }}
        >
          {step === "credentials" ? (
            <>
              <label className="block text-xs font-medium text-eco-muted">
                {t("login_email")}
                <input
                  type="email"
                  defaultValue="advisor@ecobank.com"
                  className="mt-1 w-full rounded-lg border border-eco-border px-3 py-2.5 text-sm text-eco-ink"
                  readOnly
                />
              </label>
              <label className="mt-4 block text-xs font-medium text-eco-muted">
                {t("login_password")}
                <input
                  type="password"
                  defaultValue="••••••••"
                  className="mt-1 w-full rounded-lg border border-eco-border px-3 py-2.5 text-sm text-eco-ink"
                  readOnly
                />
              </label>
            </>
          ) : (
            <label className="block text-xs font-medium text-eco-muted">
              {t("login_otp")}
              <input
                type="text"
                inputMode="numeric"
                placeholder="000 000"
                className="mt-1 w-full rounded-lg border border-eco-border px-3 py-3 text-center text-lg tracking-widest text-eco-ink"
                defaultValue="482 901"
              />
              <p className="mt-2 text-[11px] text-eco-muted">{t("login_otpHint")}</p>
            </label>
          )}

          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-eco-navy py-3 text-sm font-semibold text-white hover:bg-eco-navy/90"
          >
            {step === "credentials" ? t("login_continue") : t("login_enterRm")}
          </button>

          {step === "mfa" && (
            <button
              type="button"
              onClick={() => setStep("credentials")}
              className="mt-3 w-full text-center text-xs text-eco-muted hover:text-eco-ink"
            >
              {t("login_back")}
            </button>
          )}
        </form>

        <p className="mt-6 text-center text-xs text-white/50">
          <Link href="/" className="hover:text-white hover:underline">
            {t("login_skip")}
          </Link>
          <span className="mx-2">·</span>
          <Link href="/rm" className="hover:text-white hover:underline">
            {t("login_rmDirect")}
          </Link>
        </p>
      </div>
    </div>
  );
}
