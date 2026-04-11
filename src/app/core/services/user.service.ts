// src/app/core/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserCreateRequest, UserUpdateRequest } from '../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:8081/api/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> { return this.http.get<User[]>(this.apiUrl); }
  getUserById(id: number): Observable<User> { return this.http.get<User>(`${this.apiUrl}/${id}`); }
  createUser(data: UserCreateRequest): Observable<User> { return this.http.post<User>(this.apiUrl, data); }
  updateUser(id: number, data: UserUpdateRequest): Observable<User> { return this.http.put<User>(`${this.apiUrl}/${id}`, data); }
  deleteUser(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
  activerUser(id: number): Observable<User> { return this.http.patch<User>(`${this.apiUrl}/${id}/activer`, {}); }
  desactiverUser(id: number): Observable<User> { return this.http.patch<User>(`${this.apiUrl}/${id}/desactiver`, {}); }
}