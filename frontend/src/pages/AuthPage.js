import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, Sparkles } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center pt-20 pb-20 lg:pb-12" data-testid="auth-page">
        <div className="ked-container">
          <div className="max-w-md mx-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-sans text-ked-text-muted hover:text-ked-text transition-colors mb-8"
              data-testid="auth-back"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-ked-border rounded-2xl p-8"
            >
              {/* Logo */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="font-serif text-3xl font-semibold text-ked-text">KED</span>
                </div>
                <h1 className="font-serif text-2xl text-ked-text mb-1">
                  {isLogin ? "Welcome back" : "Join KED"}
                </h1>
                <p className="font-sans text-sm text-ked-text-muted">
                  {isLogin
                    ? "Sign in to your entrepreneur account"
                    : "Start your journey as a woman entrepreneur"}
                </p>
              </div>

              {/* Form */}
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                {!isLogin && (
                  <div>
                    <label className="text-xs font-sans font-medium text-ked-text-muted block mb-1.5">Full Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-ked-border rounded-xl font-sans text-sm text-ked-text placeholder:text-ked-text-muted/50 focus:outline-none focus:ring-2 focus:ring-ked-primary/30"
                      data-testid="auth-name"
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs font-sans font-medium text-ked-text-muted block mb-1.5">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-ked-border rounded-xl font-sans text-sm text-ked-text placeholder:text-ked-text-muted/50 focus:outline-none focus:ring-2 focus:ring-ked-primary/30"
                    data-testid="auth-email"
                  />
                </div>
                {!isLogin && (
                  <div>
                    <label className="text-xs font-sans font-medium text-ked-text-muted block mb-1.5">Phone</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-ked-border rounded-xl font-sans text-sm text-ked-text placeholder:text-ked-text-muted/50 focus:outline-none focus:ring-2 focus:ring-ked-primary/30"
                      data-testid="auth-phone"
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs font-sans font-medium text-ked-text-muted block mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full px-4 py-3 pr-12 bg-[#FAF8F5] border border-ked-border rounded-xl font-sans text-sm text-ked-text placeholder:text-ked-text-muted/50 focus:outline-none focus:ring-2 focus:ring-ked-primary/30"
                      data-testid="auth-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ked-text-muted hover:text-ked-text"
                      data-testid="toggle-password"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isLogin && (
                  <div className="flex items-center justify-end">
                    <button className="text-xs font-sans text-ked-primary hover:underline" data-testid="forgot-password">
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-ked-primary text-white rounded-full py-3.5 font-sans font-medium hover:bg-ked-primary-hover transition-all"
                  data-testid="auth-submit"
                >
                  {isLogin ? "Sign In" : "Create Account"}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-ked-border" />
                <span className="text-xs font-sans text-ked-text-muted">or</span>
                <div className="flex-1 h-px bg-ked-border" />
              </div>

              {/* Google Login */}
              <button
                className="w-full flex items-center justify-center gap-3 border border-ked-border rounded-full py-3 font-sans text-sm font-medium text-ked-text hover:bg-ked-surface transition-all"
                data-testid="auth-google"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              {/* Toggle */}
              <p className="text-center mt-6 text-sm font-sans text-ked-text-muted">
                {isLogin ? "New to KED? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-ked-primary font-medium hover:underline"
                  data-testid="auth-toggle"
                >
                  {isLogin ? "Create an account" : "Sign in"}
                </button>
              </p>
            </motion.div>

            {/* Trust Note */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <Sparkles className="w-4 h-4 text-ked-primary" />
              <p className="text-xs font-sans text-ked-text-muted">
                Trusted by 2,500+ women entrepreneurs across India
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
