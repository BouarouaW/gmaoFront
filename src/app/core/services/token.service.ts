import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly TOKEN_KEY = 'token';
  private readonly USER_ROLE = 'userRole';
  private readonly USER_NAME = 'userName';

  private tokenSignal = signal<string | null>(null);

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.tokenSignal.set(token);
  }

  getToken(): string | null {
    const t = localStorage.getItem(this.TOKEN_KEY);
    if (t && !this.tokenSignal()) this.tokenSignal.set(t);
    return t;
  }

  clear(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_ROLE);
    localStorage.removeItem(this.USER_NAME);
    this.tokenSignal.set(null);
  }

  isLoggedIn(): boolean {
    const t = this.getToken();
    return !!t && t !== 'undefined' && t !== 'null';
  }

  setUserInfo(username: string, role: string) {
    localStorage.setItem(this.USER_NAME, username);
    localStorage.setItem(this.USER_ROLE, role);
  }

  getUserInfo(): { username: string; role: string } | null {
    const u = localStorage.getItem(this.USER_NAME);
    const r = localStorage.getItem(this.USER_ROLE);
    if (!u || !r) return null;
    return { username: u, role: r };
  }

  getUsername(): string | null { return localStorage.getItem(this.USER_NAME); }
  getUserRole(): string | null { return localStorage.getItem(this.USER_ROLE); }
}
