// =====================================================================
// YOUR APP STARTS HERE
// Edit this file freely. Add components, pages, and logic below.
// The user is already authenticated when this component renders.
//
// What's included as a starter: a per-user checklist that proves the
// DynamoDB storage layer is wired up end-to-end (CREATE / READ / UPDATE
// / DELETE). Replace it with your own feature when you're ready — the
// same pattern (auth fetch → POST / PATCH / DELETE → re-render) works
// for almost anything. Backend: see `api/INSTRUCTIONS.md` "Storage".
// =====================================================================

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "./_auth/useAuth";

type ChecklistItem = {
  id: string;
  SK: string;
  text: string;
  done: boolean;
  createdAt: number;
};

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const { user, signOut, getAccessToken } = useAuth();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (adding) inputRef.current?.focus();
  }, [adding]);

  const authFetch = useCallback(
    async (path: string, init: RequestInit = {}) => {
      const token = await getAccessToken();
      const res = await fetch(`${API}${path}`, {
        ...init,
        headers: {
          ...(init.headers ?? {}),
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} → ${res.status}`);
      return res.json();
    },
    [getAccessToken],
  );

  const load = useCallback(async () => {
    try {
      setError(null);
      const { items } = await authFetch("/api/items");
      setItems(items);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => { load(); }, [load]);

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || busy) return;
    setBusy(true);
    try {
      await authFetch("/api/items", { method: "POST", body: JSON.stringify({ text }) });
      setDraft("");
      await load();
      inputRef.current?.focus();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (item: ChecklistItem) => {
    const next = { ...item, done: !item.done };
    setItems((prev) => prev.map((i) => (i.SK === item.SK ? next : i)));
    try {
      await authFetch(`/api/items/${encodeURIComponent(item.SK)}`, {
        method: "PATCH",
        body: JSON.stringify({ done: next.done }),
      });
    } catch (e) {
      setItems((prev) => prev.map((i) => (i.SK === item.SK ? item : i)));
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const removeItem = async (sk: string) => {
    setBusy(true);
    try {
      await authFetch(`/api/items/${encodeURIComponent(sk)}`, { method: "DELETE" });
      setItems((prev) => prev.filter((i) => i.SK !== sk));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={{ margin: 0 }}>My App</h1>
        <button onClick={signOut} style={styles.button}>
          Sign out ({user.username})
        </button>
      </header>
      <main>
        <section style={styles.card}>
          <div style={styles.badge}>STORAGE DEMO · REPLACE WITH YOUR FEATURE</div>
          <h2 style={styles.title}>Checklist</h2>
          <p style={styles.blurb}>
            Saved per-user in DynamoDB. Data persists as long as your stage is deployed.
          </p>
          {error && <div style={styles.error}>Error: {error}</div>}
          {loading ? (
            <div style={styles.empty}>Loading…</div>
          ) : items.length === 0 ? (
            <div style={styles.empty}>No items yet — add one to test storage.</div>
          ) : (
            <ul style={styles.list}>
              {items.map((item) => (
                <li key={item.SK} style={styles.item}>
                  <label style={styles.itemLabel}>
                    <input type="checkbox" checked={item.done} onChange={() => toggle(item)} />
                    <span style={{ textDecoration: item.done ? "line-through" : "none" }}>
                      {item.text}
                    </span>
                  </label>
                  <button onClick={() => removeItem(item.SK)} disabled={busy} style={styles.deleteButton}>
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
          {adding ? (
            <form onSubmit={addItem} style={styles.addRow}>
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Escape") { setAdding(false); setDraft(""); } }}
                placeholder="Add item…"
                style={styles.addInput}
                disabled={busy}
              />
              <button type="submit" disabled={busy || !draft.trim()} style={styles.addPrimary}>Add</button>
              <button type="button" onClick={() => { setAdding(false); setDraft(""); }} style={styles.addCancel}>Cancel</button>
            </form>
          ) : (
            <button onClick={() => setAdding(true)} style={styles.addTrigger}>+ Add item</button>
          )}
        </section>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { fontFamily: "system-ui, sans-serif", padding: "2rem", maxWidth: "640px", margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid #eee", paddingBottom: "1rem" },
  button: { cursor: "pointer", padding: "0.4rem 0.8rem", border: "1px solid #d0d7de", borderRadius: "6px", background: "#f6f8fa" },
  card: { border: "1px solid #e1e4e8", borderRadius: "10px", padding: "1.5rem", background: "#fff" },
  badge: { display: "inline-block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em", padding: "0.2rem 0.55rem", borderRadius: "999px", background: "#f1f0fe", color: "#6e57e0", marginBottom: "0.5rem" },
  title: { margin: "0 0 0.25rem", fontSize: "1.25rem", fontWeight: 600 },
  blurb: { fontSize: "0.85rem", color: "#57606a", marginTop: 0, marginBottom: "1rem" },
  error: { background: "#ffebe9", border: "1px solid #ffc1b8", color: "#a40e26", padding: "0.5rem 0.75rem", borderRadius: "6px", marginBottom: "0.75rem", fontSize: "0.875rem" },
  empty: { color: "#8c959f", fontStyle: "italic", padding: "0.5rem 0" },
  list: { listStyle: "none", padding: 0, margin: "0 0 0.5rem" },
  item: { display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.45rem 0", borderBottom: "1px solid #f6f8fa" },
  itemLabel: { display: "flex", alignItems: "center", gap: "0.6rem", flex: 1, cursor: "pointer" },
  deleteButton: { cursor: "pointer", border: "none", background: "transparent", color: "#8c959f" },
  addTrigger: { cursor: "pointer", border: "none", background: "transparent", color: "#6e57e0", padding: "0.5rem 0", marginTop: "0.5rem", fontSize: "0.95rem" },
  addRow: { display: "flex", gap: "0.5rem", marginTop: "0.5rem" },
  addInput: { flex: 1, padding: "0.45rem 0.7rem", border: "1px solid #6e57e0", borderRadius: "6px", fontSize: "0.95rem" },
  addPrimary: { cursor: "pointer", padding: "0.45rem 0.9rem", border: "1px solid #6e57e0", borderRadius: "6px", background: "#6e57e0", color: "#fff" },
  addCancel: { cursor: "pointer", padding: "0.45rem 0.7rem", border: "none", background: "transparent", color: "#57606a" },
};
