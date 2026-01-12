// lib/auth.ts

export function getAllowedUsers(): Record<string, string> {
  const raw = process.env.ALLOWED_USERS;
  if (!raw) return {};

  const users: Record<string, string> = {};

  raw.split(",").forEach(pair => {
    const [username, password] = pair.split(":");
    if (username && password) {
      users[username.trim()] = password.trim();
    }
  });

  return users;
}

export function validateLogin(username: string, password: string): boolean {
  const users = getAllowedUsers();
  return users[username] === password;
}
