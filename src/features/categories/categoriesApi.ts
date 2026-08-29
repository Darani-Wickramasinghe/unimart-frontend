import { baseApi } from '../../services/baseApi';
import type { Category } from './categoryTypes';

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query<Category[], void>({
      query: () => 'categories',
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesApi;