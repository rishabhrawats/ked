import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle,
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  Plus,
  RefreshCw,
  Settings,
  ShieldCheck,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { usePublicData } from "@/contexts/PublicDataContext";

const emptyContent = {
  name: "",
  title: "",
  description: "",
  category: "",
  image: "",
  images: [],
  price: 0,
  originalPrice: null,
  tags: [],
  type: "",
  priceType: "",
  duration: "",
  slots: [],
  isOnline: false,
};

function StatusBadge({ status }) {
  const styles = {
    active: "bg-emerald-50 text-emerald-700",
    published: "bg-emerald-50 text-emerald-700",
    pending: "bg-amber-50 text-amber-700",
    rejected: "bg-red-50 text-red-700",
    suspended: "bg-red-50 text-red-700",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {status || "draft"}
    </span>
  );
}

function Notice({ type = "error", children }) {
  if (!children) return null;
  return (
    <div className={`mb-5 flex gap-2 rounded-xl border p-3 text-sm ${
      type === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
        : "border-red-200 bg-red-50 text-red-800"
    }`}>
      {type === "success" ? <CheckCircle className="h-4 w-4 mt-0.5" /> : <AlertCircle className="h-4 w-4 mt-0.5" />}
      {children}
    </div>
  );
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { refresh: refreshPublic } = usePublicData();
  const navigate = useNavigate();
  const isAdmin = user.role === "super_admin";
  const [tab, setTab] = useState(isAdmin ? "overview" : "products");
  const [overview, setOverview] = useState(null);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [form, setForm] = useState(emptyContent);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(async () => {
    setError("");
    if (tab === "security") return;
    if (isAdmin) {
      if (tab === "overview") setOverview(await api("/admin/overview"));
      else if (tab === "users") setUsers(await api("/admin/users"));
      else if (tab === "inquiries") setInquiries(await api("/admin/inquiries"));
      else setItems(await api(`/admin/content/${tab}`));
    } else {
      const summary = await api("/seller/dashboard");
      setDashboard(summary);
      if (["products", "services", "posts"].includes(tab)) {
        setItems(await api(`/seller/content/${tab}`));
      }
    }
  }, [isAdmin, tab]);

  useEffect(() => {
    setItems([]);
    load().catch((err) => setError(err.message));
  }, [load]);

  const navItems = useMemo(
    () =>
      isAdmin
        ? [
            ["overview", "Overview", LayoutDashboard],
          ["users", "Users", Users],
            ["profiles", "Profiles", ShieldCheck],
            ["products", "Products", Package],
            ["services", "Services", FileText],
            ["posts", "Community Posts", FileText],
            ["inquiries", "Inquiries", FileText],
            ["security", "Security", Settings],
          ]
        : [
            ["profile", "Business Profile", ShieldCheck],
            ["products", "My Products", Package],
            ["services", "My Services", FileText],
            ["posts", "My Posts", FileText],
            ["inquiries", "My Inquiries", FileText],
            ["security", "Security", Settings],
          ],
    [isAdmin],
  );

  const resetForm = () => {
    setForm(emptyContent);
    setEditingId(null);
    setShowForm(false);
  };

  const saveContent = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const payload = {
        ...form,
        name: form.name || form.title,
        title: form.title || form.name,
        price: Number(form.price || 0),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        tags: typeof form.tags === "string" ? form.tags.split(",").map((v) => v.trim()).filter(Boolean) : form.tags,
      };
      await api(
        editingId
          ? `/seller/content/${tab}/${editingId}`
          : `/seller/content/${tab}`,
        { method: editingId ? "PUT" : "POST", body: payload },
      );
      setSuccess("Saved and submitted for Super Admin approval.");
      resetForm();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const uploadImage = async (file) => {
    if (!file) return;
    const body = new FormData();
    body.append("file", file);
    setBusy(true);
    try {
      const result = await api("/uploads", { method: "POST", body });
      setForm((current) => ({ ...current, image: result.url, images: [result.url] }));
      setSuccess("Image uploaded.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const removeContent = async (id) => {
    if (!window.confirm("Delete this item permanently?")) return;
    try {
      await api(`/seller/content/${tab}/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const moderate = async (kind, id, status) => {
    setBusy(true);
    setError("");
    try {
      const path =
        kind === "users"
          ? `/admin/users/${id}`
          : `/admin/content/${kind}/${id}`;
      await api(path, { method: "PATCH", body: { status, note: "" } });
      setSuccess(`Status changed to ${status}.`);
      await Promise.all([load(), refreshPublic()]);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (item) => {
    setForm({
      ...emptyContent,
      ...item,
      tags: (item.tags || []).join(", "),
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const signOut = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F7F3EF] pt-20 pb-12">
      <div className="ked-container">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ked-primary">
              {isAdmin ? "Super Admin" : "Seller Workspace"}
            </p>
            <h1 className="font-serif text-3xl text-ked-text">Welcome, {user.name}</h1>
            <p className="text-sm text-ked-text-muted">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <Link to="/" className="rounded-full border border-ked-border bg-white px-4 py-2 text-sm">View site</Link>
            <button onClick={signOut} className="flex items-center gap-2 rounded-full bg-ked-text px-4 py-2 text-sm text-white">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>

        {!isAdmin && user.status !== "active" && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="font-semibold text-amber-900">Application awaiting approval</h2>
            <p className="mt-1 text-sm text-amber-800">
              Your Super Admin must approve the seller account before you can submit listings.
            </p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[240px,1fr]">
          <aside className="h-fit rounded-2xl border border-ked-border bg-white p-3">
            {navItems.map(([id, label, Icon]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm ${
                  tab === id ? "bg-ked-accent text-ked-text font-medium" : "text-ked-text-muted hover:bg-ked-surface"
                }`}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </aside>

          <main className="min-w-0 rounded-2xl border border-ked-border bg-white p-5 md:p-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="font-serif text-2xl capitalize text-ked-text">{tab.replace("-", " ")}</h2>
              <div className="flex gap-2">
                <button onClick={() => load().catch((err) => setError(err.message))} className="rounded-full border border-ked-border p-2">
                  <RefreshCw className="h-4 w-4" />
                </button>
                {!isAdmin && ["products", "services", "posts"].includes(tab) && user.status === "active" && (
                  <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 rounded-full bg-ked-primary px-4 py-2 text-sm text-white">
                    <Plus className="h-4 w-4" /> Add new
                  </button>
                )}
              </div>
            </div>

            <Notice>{error}</Notice>
            <Notice type="success">{success}</Notice>

            {isAdmin && tab === "overview" && overview && (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Total users" value={overview.users.total} />
                <Metric label="Pending sellers" value={overview.users.pending} />
                <Metric label="Pending products" value={overview.content.products.pending} />
                <Metric label="Total inquiries" value={overview.inquiries} />
              </div>
            )}

            {isAdmin && tab === "users" && (
              <DataTable>
                {users.map((item) => (
                  <Row key={item.id} title={item.name} subtitle={`${item.email} | ${item.role}`} status={item.status}>
                    {item.role !== "super_admin" && (
                      <>
                        <Action onClick={() => moderate("users", item.id, "active")}>Approve</Action>
                        <Action danger onClick={() => moderate("users", item.id, "suspended")}>Suspend</Action>
                      </>
                    )}
                  </Row>
                ))}
              </DataTable>
            )}

            {isAdmin && ["profiles", "products", "services", "posts"].includes(tab) && (
              <DataTable>
                {items.map((item) => (
                  <Row key={item.id} title={item.title || item.name} subtitle={item.category} status={item.status}>
                    <Action onClick={() => moderate(tab, item.id, "published")}>Publish</Action>
                    <Action danger onClick={() => moderate(tab, item.id, "rejected")}>Reject</Action>
                  </Row>
                ))}
              </DataTable>
            )}

            {isAdmin && tab === "inquiries" && (
              <DataTable>
                {inquiries.map((item) => (
                  <Row key={item.id} title={item.name} subtitle={`${item.phone} | ${item.entity_type}: ${item.entity_id}`} status={item.status} />
                ))}
              </DataTable>
            )}

            {!isAdmin && tab === "inquiries" && (
              <DataTable>
                {(dashboard?.inquiries || []).map((item) => (
                  <Row key={item.id} title={item.name} subtitle={`${item.phone} | ${item.entity_type}: ${item.entity_id}`} status={item.status} />
                ))}
              </DataTable>
            )}

            {!isAdmin && tab === "profile" && dashboard?.profile && (
              <ProfileEditor
                profile={dashboard.profile}
                disabled={user.status !== "active"}
                onSaved={async () => {
                  setSuccess("Profile changes submitted for Super Admin approval.");
                  await load();
                }}
                onError={(message) => setError(message)}
              />
            )}

            {tab === "security" && (
              <SecurityPanel
                onSuccess={(message) => setSuccess(message)}
                onError={(message) => setError(message)}
              />
            )}

            {!isAdmin && ["products", "services", "posts"].includes(tab) && !showForm && (
              <DataTable>
                {items.map((item) => (
                  <Row key={item.id} title={item.title || item.name} subtitle={item.category} status={item.status}>
                    <Action onClick={() => startEdit(item)}>Edit</Action>
                    <button onClick={() => removeContent(item.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </Row>
                ))}
                {!items.length && <p className="py-12 text-center text-sm text-ked-text-muted">No content yet.</p>}
              </DataTable>
            )}

            {!isAdmin && showForm && (
              <form onSubmit={saveContent} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label={tab === "posts" ? "Post title" : "Name"} value={tab === "posts" ? form.title : form.name} onChange={(value) => setForm({ ...form, [tab === "posts" ? "title" : "name"]: value })} required />
                  <Field label="Category" value={form.category} onChange={(value) => setForm({ ...form, category: value })} required />
                </div>
                <label className="block text-sm font-medium text-ked-text">
                  Description
                  <textarea required minLength={10} rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1.5 w-full rounded-xl border border-ked-border bg-[#FAF8F5] px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-ked-primary/30" />
                </label>
                {tab !== "posts" && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Price (INR)" type="number" value={form.price} onChange={(value) => setForm({ ...form, price: value })} />
                    <Field label="Tags (comma separated)" value={form.tags} onChange={(value) => setForm({ ...form, tags: value })} />
                  </div>
                )}
                {tab === "services" && (
                  <div className="grid gap-4 md:grid-cols-3">
                    <Field label="Service type" value={form.type} onChange={(value) => setForm({ ...form, type: value })} />
                    <Field label="Duration" value={form.duration} onChange={(value) => setForm({ ...form, duration: value })} />
                    <Field label="Price type" value={form.priceType} onChange={(value) => setForm({ ...form, priceType: value })} />
                  </div>
                )}
                <div className="rounded-xl border border-dashed border-ked-border p-4">
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-ked-text-muted">
                    <Upload className="h-5 w-5" />
                    Upload JPG, PNG, or WebP up to 5MB
                    <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => uploadImage(e.target.files?.[0])} />
                  </label>
                  {form.image && <img src={form.image} alt="Upload preview" className="mt-3 h-28 rounded-lg object-cover" />}
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={resetForm} className="rounded-full border border-ked-border px-5 py-2.5 text-sm">Cancel</button>
                  <button disabled={busy} className="rounded-full bg-ked-primary px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50">
                    {busy ? "Saving..." : "Submit for approval"}
                  </button>
                </div>
              </form>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-ked-border bg-[#FAF8F5] p-5">
      <p className="text-xs uppercase tracking-wider text-ked-text-muted">{label}</p>
      <p className="mt-2 font-serif text-4xl text-ked-text">{value}</p>
    </div>
  );
}

function DataTable({ children }) {
  return <div className="divide-y divide-ked-border overflow-hidden rounded-xl border border-ked-border">{children}</div>;
}

function Row({ title, subtitle, status, children }) {
  return (
    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ked-text">{title}</p>
        <p className="truncate text-xs text-ked-text-muted">{subtitle}</p>
      </div>
      <StatusBadge status={status} />
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

function Action({ children, danger = false, onClick }) {
  return (
    <button disabled={false} onClick={onClick} className={`rounded-full px-3 py-1.5 text-xs font-medium ${danger ? "bg-red-50 text-red-700" : "bg-ked-accent text-ked-text"}`}>
      {children}
    </button>
  );
}

function Field({ label, value, onChange, type = "text", required = false }) {
  return (
    <label className="block text-sm font-medium text-ked-text">
      {label}
      <input required={required} type={type} value={value ?? ""} onChange={(event) => onChange(event.target.value)} className="mt-1.5 w-full rounded-xl border border-ked-border bg-[#FAF8F5] px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-ked-primary/30" />
    </label>
  );
}

function ProfileEditor({ profile, disabled, onSaved, onError }) {
  const [values, setValues] = useState({
    name: profile.name || "",
    business: profile.business || "",
    tagline: profile.tagline || "",
    location: profile.location || "",
    category: profile.category || "",
    story: profile.story || "",
    image: profile.image || "",
    instagram: profile.social?.instagram || "",
    whatsapp: profile.social?.whatsapp || "",
  });
  const [saving, setSaving] = useState(false);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api("/seller/profile", { method: "PUT", body: values });
      await onSaved();
    } catch (err) {
      onError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const upload = async (file) => {
    if (!file) return;
    const body = new FormData();
    body.append("file", file);
    setSaving(true);
    try {
      const result = await api("/uploads", { method: "POST", body });
      setValues((current) => ({ ...current, image: result.url }));
    } catch (err) {
      onError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-4">
      <div className="flex items-center justify-between rounded-xl bg-[#FAF8F5] p-4">
        <p className="text-sm text-ked-text-muted">Current status: <StatusBadge status={profile.status} /></p>
        {profile.moderation_note && <p className="text-xs text-red-700">{profile.moderation_note}</p>}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Founder name" value={values.name} onChange={(value) => setValues({ ...values, name: value })} required />
        <Field label="Business name" value={values.business} onChange={(value) => setValues({ ...values, business: value })} required />
        <Field label="Tagline" value={values.tagline} onChange={(value) => setValues({ ...values, tagline: value })} />
        <Field label="Location" value={values.location} onChange={(value) => setValues({ ...values, location: value })} required />
        <Field label="Category" value={values.category} onChange={(value) => setValues({ ...values, category: value })} required />
        <Field label="WhatsApp" value={values.whatsapp} onChange={(value) => setValues({ ...values, whatsapp: value })} />
        <Field label="Instagram" value={values.instagram} onChange={(value) => setValues({ ...values, instagram: value })} />
      </div>
      <label className="block text-sm font-medium text-ked-text">
        Business story
        <textarea rows={5} value={values.story} onChange={(event) => setValues({ ...values, story: event.target.value })} className="mt-1.5 w-full rounded-xl border border-ked-border bg-[#FAF8F5] px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-ked-primary/30" />
      </label>
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-ked-border p-4 text-sm text-ked-text-muted">
        <Upload className="h-5 w-5" /> Upload profile image
        <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => upload(event.target.files?.[0])} />
      </label>
      {values.image && <img src={values.image} alt="Profile preview" className="h-32 w-32 rounded-xl object-cover" />}
      <button disabled={disabled || saving} className="rounded-full bg-ked-primary px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50">
        {saving ? "Saving..." : "Submit profile for approval"}
      </button>
    </form>
  );
}

function SecurityPanel({ onSuccess, onError }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      onError("New passwords do not match.");
      return;
    }
    setSaving(true);
    try {
      const result = await api("/auth/change-password", {
        method: "POST",
        body: {
          current_password: currentPassword,
          new_password: newPassword,
        },
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onSuccess(result.message);
    } catch (err) {
      onError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-lg space-y-4">
      <p className="text-sm text-ked-text-muted">Use at least 10 characters with letters and numbers.</p>
      <Field label="Current password" type="password" value={currentPassword} onChange={setCurrentPassword} required />
      <Field label="New password" type="password" value={newPassword} onChange={setNewPassword} required />
      <Field label="Confirm new password" type="password" value={confirmPassword} onChange={setConfirmPassword} required />
      <button disabled={saving} className="rounded-full bg-ked-primary px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50">
        {saving ? "Updating..." : "Change password"}
      </button>
    </form>
  );
}
