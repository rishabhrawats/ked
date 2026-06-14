import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { api } from "@/lib/api";

export default function InquiryDialog({ entityType, entityId, title, open, onClose }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  if (!open) return null;

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await api("/inquiries", {
        method: "POST",
        body: {
          entity_type: entityType,
          entity_id: entityId,
          ...form,
          email: form.email || null,
        },
      });
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const whatsappUrl = result?.whatsapp
    ? `https://wa.me/${result.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
        `Hello, I am interested in ${title}. My KED inquiry reference is ${result.id}.`,
      )}`
    : "";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ked-primary">Send inquiry</p>
            <h2 className="font-serif text-2xl text-ked-text">{title}</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-ked-surface" aria-label="Close inquiry form">
            <X className="h-5 w-5" />
          </button>
        </div>
        {result ? (
          <div className="text-center">
            <div className="mb-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
              Your inquiry has been saved. Reference: <strong>{result.id}</strong>
            </div>
            {whatsappUrl ? (
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 text-sm font-medium text-white">
                <MessageCircle className="h-4 w-4" /> Continue on WhatsApp
              </a>
            ) : (
              <p className="text-sm text-ked-text-muted">The seller will contact you using the details provided.</p>
            )}
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <Field label="Your name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
            <Field label="Phone / WhatsApp" type="tel" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} />
            <Field label="Email (optional)" type="email" required={false} value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
            <label className="block text-sm font-medium text-ked-text">
              Message
              <textarea rows={3} maxLength={2000} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} className="mt-1.5 w-full rounded-xl border border-ked-border bg-[#FAF8F5] px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-ked-primary/30" />
            </label>
            <button disabled={busy} className="w-full rounded-full bg-ked-primary py-3 text-sm font-medium text-white disabled:opacity-50">
              {busy ? "Saving inquiry..." : "Save and continue"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required = true }) {
  return (
    <label className="block text-sm font-medium text-ked-text">
      {label}
      <input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1.5 w-full rounded-xl border border-ked-border bg-[#FAF8F5] px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-ked-primary/30" />
    </label>
  );
}
