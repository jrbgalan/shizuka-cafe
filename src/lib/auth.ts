// Standalone authentication service for Shizuka Café.
// Stores credentials and active sessions in localStorage.

import type { User } from "@/types";

const AUTH_USER_KEY = "shizuka.auth.user";
const REGISTERED_USERS_KEY = "shizuka.auth.users";

export interface StoredUser extends User {
  full_name?: string;
  provider?: string;
  created_at?: string;
}

const DEFAULT_ADMIN: StoredUser = {
  id: "u-admin",
  email: "hello@shizukacafe.com",
  name: "John Romeo Galan",
  full_name: "John Romeo Galan",
  role: "admin",
  created_at: new Date().toISOString()
};

function getStoredUsers(): StoredUser[] {
  try {
    const data = localStorage.getItem(REGISTERED_USERS_KEY);
    if (!data) {
      const initial = [DEFAULT_ADMIN];
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  } catch {
    return [DEFAULT_ADMIN];
  }
}

function saveStoredUsers(users: StoredUser[]): void {
  try {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  } catch {
    /* ignore */
  }
}

export const auth = {
  async me(): Promise<StoredUser | null> {
    try {
      const raw = localStorage.getItem(AUTH_USER_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  async loginViaEmailPassword(email: string, _password?: string): Promise<StoredUser> {
    const users = getStoredUsers();
    let existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    
    if (!existing) {
      // Create user on login if not exists for a friendly dev experience
      const role = email.toLowerCase().includes("admin") || email.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase()
        ? "admin"
        : "user";
      const name = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      existing = {
        id: `u-${Date.now()}`,
        email,
        name: email.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase() ? DEFAULT_ADMIN.name : name,
        full_name: email.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase() ? DEFAULT_ADMIN.full_name : name,
        role,
        created_at: new Date().toISOString()
      };
      users.push(existing);
      saveStoredUsers(users);
    }

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(existing));
    return existing;
  },

  loginWithProvider(provider: string, returnTo = "/"): void {
    const user: StoredUser = {
      id: `u-${Date.now()}`,
      email: "user@example.com",
      name: "Guest Explorer",
      full_name: "Guest Explorer",
      role: "user",
      provider,
      created_at: new Date().toISOString()
    };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    window.location.href = returnTo;
  },

  async register({ email, password, _password }: { email: string; password?: string; _password?: string }): Promise<{ ok: boolean; email: string }> {
    const users = getStoredUsers();
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      const name = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      user = {
        id: `u-${Date.now()}`,
        email,
        name,
        full_name: name,
        role: "user",
        created_at: new Date().toISOString()
      };
      users.push(user);
      saveStoredUsers(users);
    }
    return { ok: true, email };
  },

  async verifyOtp({ email, otpCode, _otpCode }: { email: string; otpCode?: string; _otpCode?: string }): Promise<{ access_token: string; user: StoredUser }> {
    const users = getStoredUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || {
      id: `u-${Date.now()}`,
      email,
      name: email.split("@")[0],
      full_name: email.split("@")[0],
      role: "user",
      created_at: new Date().toISOString()
    };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    return { access_token: `token-${Date.now()}`, user };
  },

  setToken(_token: string): void {
    // Session token placeholder
  },

  async resendOtp(_email: string): Promise<{ ok: boolean }> {
    return { ok: true };
  },

  async resetPasswordRequest(_email: string): Promise<{ ok: boolean }> {
    return { ok: true };
  },

  async resetPassword({ resetToken, newPassword }: { resetToken?: string; newPassword?: string }): Promise<{ ok: boolean; resetToken?: string; newPassword?: string }> {
    return { ok: true, resetToken, newPassword };
  },

  logout(redirectUrl?: string | null): void {
    try {
      localStorage.removeItem(AUTH_USER_KEY);
    } catch {
      /* ignore */
    }
    if (redirectUrl) {
      window.location.href = redirectUrl;
    } else {
      window.location.reload();
    }
  },

  redirectToLogin(redirectUrl = "/"): void {
    window.location.href = `/login?returnTo=${encodeURIComponent(redirectUrl)}`;
  },

  isAuthenticated(): boolean {
    try {
      return Boolean(localStorage.getItem(AUTH_USER_KEY));
    } catch {
      return false;
    }
  },

  async getPublicSettings(): Promise<{ id: string; public_settings: { site_name: string; author: string } }> {
    return {
      id: "shizuka-cafe",
      public_settings: {
        site_name: "Shizuka Café",
        author: "John Romeo Galan"
      }
    };
  }
};
