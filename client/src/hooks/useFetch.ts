// useApi.tsx

import { useState, useCallback } from "react";
import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";

interface UseApiProps {
  baseurl?: string;
}

const useApi = ({ baseurl = "http://localhost:5000" }: UseApiProps = {}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const makeRequest = useCallback(
    async <T>(
      method: "get" | "post" | "put" | "delete",
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<T> => {
      setLoading(true);

      try {
        const response: AxiosResponse<T> = await axios[method](
          `${baseurl}${url}`,
          data,
          config
        );

        setLoading(false);
        return response.data;
      } catch (error) {
        setLoading(false);
        setError(error.response);
        throw error.response;
      }
    },
    [baseurl]
  );

  const get = useCallback(
    <T>(url: string, config?: AxiosRequestConfig) =>
      makeRequest<T>("get", url, undefined, config),
    [makeRequest]
  );

  const post = useCallback(
    <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      makeRequest<T>("post", url, data, config),
    [makeRequest]
  );

  const put = useCallback(
    <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      makeRequest<T>("put", url, data, config),
    [makeRequest]
  );

  const del = useCallback(
    <T>(url: string, config?: AxiosRequestConfig) =>
      makeRequest<T>("delete", url, undefined, config),
    [makeRequest]
  );

  return { loading, error, get, post, put, del };
};

export default useApi;
