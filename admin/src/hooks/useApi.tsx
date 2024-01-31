import axios from "axios";
import { store } from "../store/store";

const useApi = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL,
});

useApi.interceptors.request.use((config) => {
  const state = store.getState();
  const token = localStorage.getItem("token")
    ? localStorage.getItem("token")
    : state.admin?.admin?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default useApi;
