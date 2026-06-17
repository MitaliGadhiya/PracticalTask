import { AxiosRequestConfig } from 'axios';
import axiosInstance from './axiosInstance';
import { ApiResponse } from '../../types';

const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  const response = await axiosInstance.get<ApiResponse<T>>(url, config);
  return response.data;
};

const post = async <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> => {
  const response = await axiosInstance.post<ApiResponse<T>>(url, data, config);
  return response.data;
};

const put = async <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> => {
  const response = await axiosInstance.put<ApiResponse<T>>(url, data, config);
  return response.data;
};

const patch = async <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> => {
  const response = await axiosInstance.patch<ApiResponse<T>>(url, data, config);
  return response.data;
};

const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  const response = await axiosInstance.delete<ApiResponse<T>>(url, config);
  return response.data;
};

export const apiService = { get, post, put, patch, del };
