import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  username: string;
  role: string;
  nom: string;
  email: string;
  telephone: string;
  actif: boolean;
  dateCreation: string;
}

export interface UserCreateRequest {
  username: string;
  password: string;
  role: string;
  nom: string;
  email: string;
  telephone?: string;
}

export interface UserUpdateRequest {
  nom?: string;
  email?: string;
  telephone?: string;
  role?: string;
  actif?: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserService {

  // URL backend
  private apiUrl = 'http://localhost:8081/api/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(data: UserCreateRequest): Observable<User> {
    return this.http.post<User>(this.apiUrl, data);
  }

  updateUser(id: number, data: UserUpdateRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, data);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  activerUser(id: number): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}/activer`, {});
  }

  desactiverUser(id: number): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}/desactiver`, {});
  }

  updateCurrentUser(data: { nom: string; email: string; telephone: string }): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/me`, data);
  }

  changePassword(oldPassword: string, newPassword: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/me/password`, {
      oldPassword,
      newPassword
    });
  }
}