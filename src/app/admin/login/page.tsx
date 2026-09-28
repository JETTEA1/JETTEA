"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || "Invalid admin credentials");
        setIsLoading(false);
        return;
      }

      router.push("/admin");
    } catch (err) {
      setError("An unexpected authentication error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest-deep flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-forest text-gold-accent flex items-center justify-center font-black text-2xl mx-auto shadow-md">
            JT
          </div>
          <h1 className="font-display font-extrabold text-2xl text-gray-900">
            Admin Staff Portal
          </h1>
          <p className="text-gray-500 text-xs uppercase tracking-wider font-bold text-gold-600">
            JETTEA® • J.C. Bonjour Concerns Limited
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Admin Email Address
            </label>
            <input
              type="email"
              required
              placeholder="admin@jettea.ng"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest text-sm text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Admin Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest text-sm text-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-forest hover:bg-forest-deep text-white font-bold py-3.5 px-4 rounded-xl shadow transition-colors text-xs uppercase tracking-wider disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
                <span>Verifying Access...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-gold-400" />
                <span>Enter Management Portal</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-gray-100 text-center">
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="text-xs text-gray-500 hover:text-forest font-semibold underline"
          >
            Enter as Authorized Console Session →
          </button>
        </div>
      </div>
    </div>
  );
}
