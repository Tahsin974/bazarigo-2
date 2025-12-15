import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://api.bazarigo.com",
  withCredentials: true,
});
export default function useAxiosPublic() {
  return axiosPublic;
}
