export async function getCurrentUser(): Promise<string | null> {
  const res = await fetch("/api/me");
  if (!res.ok) return null;
  const data = await res.json();
  return data.user;
}

export async function logout() {
  await fetch("/api/logout", { method: "POST" });
  window.location.href = "/";
}
