export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    nom: string;
    prenom: string;
    role: string;
  };
}