import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://4fe6b659-1d02-4414-89a5-3d6ee1d85875.mock.pstmn.io",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
