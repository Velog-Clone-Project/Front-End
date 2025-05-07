import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://e1dfeae0-2ceb-459a-a219-b92533d1e633.mock.pstmn.io",
  headers: {
    // "Content-Type": "application/json",
  },
});

export default axiosInstance;
