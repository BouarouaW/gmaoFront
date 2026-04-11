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