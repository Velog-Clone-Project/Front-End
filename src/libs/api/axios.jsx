import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://819de1c1-3530-4c16-9f07-3a06cacac0e5.mock.pstmn.io",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
