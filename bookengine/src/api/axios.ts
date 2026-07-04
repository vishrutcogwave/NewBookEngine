import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});
console.log("base", import.meta.env.VITE_API_BASE_URL);

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    console.log(
      `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
      config.data
    );

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    console.log(
      `[API Response] ${response.status} ${response.config.url}`,
      response.data
    );

    return response;
  },
  (error) => {
    if (error.response) {
      console.error(
        `[API Error] ${error.response.status}`,
        error.response.data
      );
    } else if (error.request) {
      console.error("[Network Error] No response from server.");
    } else {
      console.error("[Axios Error]", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;