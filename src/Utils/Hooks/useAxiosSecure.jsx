import axios from "axios";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_BASEURL,

  withCredentials: true,
});

export default function useAxiosSecure() {
  const baseUrl = import.meta.env.VITE_BASEURL;
  axiosSecure.interceptors.request.use(
    function (config) {
      // Do something before request is sent
      return config;
    },
    function (error) {
      // Do something with request error
      return console.error(error);
    },
  );
  // Response interceptor
  axiosSecure.interceptors.response.use(
    function (response) {
      return response;
    },
    async function (error) {
      const status = error.response?.status;

      // Only for 401 or 403
      if (status === 401 || status === 403) {
        try {
          // Try to refresh access token
          await axios.post(
            `${baseUrl}/token/refresh`,
            {},
            { withCredentials: true },
          );

          // Retry original request
          return axiosSecure(error.config);
        } catch (refreshError) {
          const refreshStatus = refreshError.response?.status;

          // Refresh token invalid → logout
          if (refreshStatus === 401 || refreshStatus === 403) {
            await axios.post(
              `${baseUrl}/logout`,
              {},
              { withCredentials: true },
            );
          }
        }
      }

      Promise.reject(error);
      return console.error(error);
    },
  );

  return axiosSecure;
}
