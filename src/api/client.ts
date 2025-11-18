import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://hahow-recruit.herokuapp.com',
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export type ApiError = {
  status?: number;
  message: string;
};

export const toApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    return {
      status: error.response?.status,
      message:
        error.response?.data?.message || error.message || 'Unexpected error',
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: 'Unexpected error' };
};
