const API_BASE = import.meta.env?.VITE_API_BASE || "http://127.0.0.1:8000/api";

async function handleJson(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.detail || JSON.stringify(data));
  }
  return data;
}

export async function getPredictDates() {
  const res = await fetch(`${API_BASE}/predict-dates/`);
  if (!res.ok) throw new Error("Impossible de charger les dates.");
  return res.json(); // { dates: [...] }
}

export async function predict(payload) {
  const res = await fetch(`${API_BASE}/predict/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleJson(res);
}

export async function getMetrics() {
  const res = await fetch(`${API_BASE}/metrics/`);
  return handleJson(res); 
}

export async function getHistory(limit = 200) {
  const res = await fetch(`${API_BASE}/prediction-history/?limit=${limit}`);
  return handleJson(res); // { items: [...] }
}
