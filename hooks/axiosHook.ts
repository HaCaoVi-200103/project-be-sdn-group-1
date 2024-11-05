import { useCallback } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStore } from "utils/AsyncStore";

const BASE_URL = "http://10.0.2.2:8080/api/v1";

const useCreateAxios = () => {
  const createRequest = useCallback(
    async <T>(
      method: "get" | "post" | "put" | "delete",
      endpoint: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> => {
      const url = `${BASE_URL}${endpoint}`;

      const isFormData = data instanceof FormData;

      try {
        const token = await getStore("token");

        const response = await axios.request<T>({
          method,
          url,
          data,
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "Content-Type": isFormData
              ? "multipart/form-data"
              : "application/json",
          },
          ...config,
        });
        return response;
      } catch (error) {
        console.error("API Request Error:", error);
        throw error;
      }
    },
    []
  );

  return { createRequest };
};

export default useCreateAxios;