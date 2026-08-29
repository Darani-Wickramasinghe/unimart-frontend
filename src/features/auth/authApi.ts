import { baseApi } from '../../services/baseApi';
import type {
  AuthResponse,
  AuthUser,
  LoginInput,
  RegisterInput,
  RegisterResponse,
} from './authTypes';

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthResponse, LoginInput>({
      query: (body) => ({ url: 'auth/login', method: 'POST', body }),
    }),
    register: build.mutation<RegisterResponse, RegisterInput>({
      query: (body) => ({ url: 'auth/register', method: 'POST', body }),
    }),
    getMe: build.query<AuthUser, void>({
      query: () => 'users/me',
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery } = authApi;