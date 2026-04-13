// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
}

interface User {
  username: string;
  role: string;
  nom?: string;
  email?: string;
  telephone?: string;
  actif?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // ✅ UTILISE L'URL ABSOLUE VERS LE BACKEND
  private apiUrl = 'http://localhost:8081/api/auth';
  private usersApiUrl = 'http://localhost:8081/api/users';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    try {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');
      const userName = localStorage.getItem('userName');
      
      if (token && userRole && userName && token !== 'undefined') {
        this.currentUserSubject.next({
          username: userName,
          role: userRole
        });
      }
    } catch (error) {
      console.error('Erreur chargement utilisateur:', error);
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('AuthService - Tentative de login avec:', credentials.email);
    console.log('URL appelée:', `${this.apiUrl}/login`);
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        console.log('AuthService - Réponse reçue:', response);
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userRole', response.role);
          localStorage.setItem('userName', response.username);
          
          this.currentUserSubject.next({
            username: response.username,
            role: response.role
          });
          
          console.log('AuthService - Token sauvegardé');
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('AuthService - Erreur HTTP:', error);
        
        let errorMessage = 'Erreur de connexion';
        
        if (error.error && typeof error.error === 'object' && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.status === 401) {
          errorMessage = 'Email ou mot de passe incorrect';
        } else if (error.status === 403) {
          errorMessage = 'Compte désactivé';
        } else if (error.status === 0) {
          errorMessage = 'Serveur indisponible. Vérifie que le backend tourne sur http://localhost:8081';
        } else if (error.status === 404) {
          errorMessage = 'Endpoint non trouvé. Vérifie que le backend est bien démarré sur le port 8081';
        }
        
        return throwError(() => ({ status: error.status, message: errorMessage }));
      })
    );
  }

  logout(): void {
    localStorage.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token && token !== 'undefined' && token !== 'null';
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined' && token !== 'null') {
      return token;
    }
    return null;
  }

  getRole(): string | null {
    return localStorage.getItem('userRole');
  }

  getUserName(): string | null {
    return localStorage.getItem('userName');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  fetchCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.usersApiUrl}/me`).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        localStorage.setItem('userName', user.username);
        localStorage.setItem('userRole', user.role);
        if (user.nom) localStorage.setItem('userNom', user.nom);
        if (user.email) localStorage.setItem('userEmail', user.email);
      })
    );
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  isTechnicien(): boolean {
    return this.getRole() === 'TECHNICIEN';
  }
}