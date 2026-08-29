export type Role = 'BUYER' | 'SELLER' | 'ADMIN';

export interface LoginInput {
  universityEmail: string;
  password: string;
}

export interface RegisterInput {
  universityEmail: string;
  password: string;
  fullName: string;
  role?: Role;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface RegisterResponse {
  id: number;
  universityEmail: string;
  fullName: string;
  role: Role;
}

export interface AuthUser {
  id: number;
  universityEmail: string;
  fullName: string;
  role: Role;
}