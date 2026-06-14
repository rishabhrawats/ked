import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, CheckCircle, Eye, EyeOff, Sparkles } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import { useAuth } from "@/contexts/AuthContext";

const initialForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  business_name: "",
  location: "",
  category: "",
  bio: "",
  whatsapp: "",
};

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get("mode") !== "register");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const update = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      if (isLogin) {
        await login(form.email, form.password);
        navigate("/dashboard");
      } else {
        const response = await register({
          ...form,
          whatsapp: form.whatsapp || form.phone,
        });
        setMessage(response.message);
        setIsLogin(true);
        setForm((current) => ({ ...initialForm, email: current.email }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center pt-24 pb-20 lg:pb-12" data-testid="auth-page">
        <div className="ked-container">
          <div className="max-w-xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-ked-text-muted hover:text-ked-text mb-8">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-ked-border rounded-2xl p-6 md:p-8">
              <div className="text-center mb-7">
                <span className="font-serif text-3xl font-semibold text-ked-text">KED</span>
                <h1 className="font-serif text-2xl text-ked-text mt-3">
                  {isLogin ? "Welcome back" : "Apply as a KED seller"}
                </h1>
                <p className="text-sm text-ked-text-muted">
                  {isLogin ? "Sign in to your secure workspace" : "Seller applications are reviewed by the KED team"}
                </p>
              </div>

              {error && <div className="mb-4 flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"><AlertCircle className="h-4 w-4 mt-0.5" />{error}</div>}
              {message && <div className="mb-4 flex gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"><CheckCircle className="h-4 w-4 mt-0.5" />{message}</div>}

              <form className="space-y-4" onSubmit={submit}>
                {!isLogin && (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Full name" value={form.name} onChange={update("name")} />
                      <Field label="Business name" value={form.business_name} onChange={update("business_name")} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Phone" type="tel" value={form.phone} onChange={update("phone")} />
                      <Field label="WhatsApp" type="tel" value={form.whatsapp} onChange={update("whatsapp")} required={false} placeholder="Defaults to phone" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="City, state" value={form.location} onChange={update("location")} />
                      <Field label="Business category" value={form.category} onChange={update("category")} />
                    </div>
                  </>
                )}
                <Field label="Email" type="email" value={form.email} onChange={update("email")} placeholder="you@example.com" />
                <label className="block text-xs font-medium text-ked-text-muted">
                  Password
                  <div className="relative mt-1.5">
                    <input required minLength={10} type={showPassword ? "text" : "password"} value={form.password} onChange={update("password")} placeholder="At least 10 characters with letters and numbers" className="w-full px-4 py-3 pr-12 bg-[#FAF8F5] border border-ked-border rounded-xl text-sm text-ked-text focus:outline-none focus:ring-2 focus:ring-ked-primary/30" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ked-text-muted">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </label>
                {!isLogin && (
                  <label className="block text-xs font-medium text-ked-text-muted">
                    Tell us about your business
                    <textarea value={form.bio} onChange={update("bio")} rows={3} maxLength={1200} className="mt-1.5 w-full px-4 py-3 bg-[#FAF8F5] border border-ked-border rounded-xl text-sm text-ked-text focus:outline-none focus:ring-2 focus:ring-ked-primary/30 resize-none" />
                  </label>
                )}
                <button disabled={busy} type="submit" className="w-full bg-ked-primary text-white rounded-full py-3.5 font-medium hover:bg-ked-primary-hover disabled:opacity-50">
                  {busy ? "Please wait..." : isLogin ? "Sign In" : "Submit Seller Application"}
                </button>
              </form>

              <p className="text-center mt-6 text-sm text-ked-text-muted">
                {isLogin ? "New to KED? " : "Already applied? "}
                <button onClick={() => { setIsLogin(!isLogin); setError(""); setMessage(""); }} className="text-ked-primary font-medium hover:underline">
                  {isLogin ? "Apply as a seller" : "Sign in"}
                </button>
              </p>
            </motion.div>
            <div className="flex items-center justify-center gap-2 mt-6">
              <Sparkles className="w-4 h-4 text-ked-primary" />
              <p className="text-xs text-ked-text-muted">Secure, moderated access for women-led businesses</p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function Field({ label, value, onChange, type = "text", required = true, placeholder = "" }) {
  return (
    <label className="block text-xs font-medium text-ked-text-muted">
      {label}
      <input required={required} type={type} value={value} onChange={onChange} placeholder={placeholder} className="mt-1.5 w-full px-4 py-3 bg-[#FAF8F5] border border-ked-border rounded-xl text-sm text-ked-text focus:outline-none focus:ring-2 focus:ring-ked-primary/30" />
    </label>
  );
}
