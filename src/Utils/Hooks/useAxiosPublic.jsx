import axios from "axios";

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_BASEURL,

  withCredentials: true,
});
export default function useAxiosPublic() {
  return axiosPublic;
}
