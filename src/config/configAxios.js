import axios from "axios";
import jwtDecode from "jwt-decode";
import { API_AUTH_URL } from "../constants";
import { logout, refreshToken } from "../redux/authSlice";
import config from "../config";
export const axiosRes = () => {
  const instance = axios.create({
    withCredentials: true,
  });
  instance.interceptors.response.use((res) => {
    return res.data;
  });
  return instance;
};

export const configAxiosAll = (user, dispatch) => {
  const instance = axios.create({
    withCredentials: true,
  });
  instance.interceptors.request.use(
    async (config) => {
      if (user) {
        if (user.access_token) {
          const decodeToken = jwtDecode(user.access_token).exp * 1000;

          if (isNaN(decodeToken) || decodeToken < new Date().getTime()) {
            const data = {};
            if (data.access_token) {
              dispatch(refreshToken(data.access_token));
              config.headers["authorization"] = `Bearer ${data.access_token}`;
            }
          } else {
            config.headers["authorization"] = `Bearer ${user.access_token}`;
          }
        }
        // else {
        //   dispatch(logout());
        // }
      }
      return config;
    },
    (err) => {}
  );
  instance.interceptors.response.use((res) => {
    return res.data;
  });
  return instance;
};

export const axiosToken = (accessToken, dispatch, navigate) => {
  const instance = axios.create({
    withCredentials: true,
  });
  instance.interceptors.request.use(
    async (configInstance) => {
      try {
        if (accessToken) {
          const decodeToken = jwtDecode(accessToken).exp * 1000;
          if (isNaN(decodeToken) || decodeToken < new Date().getTime()) {
            const res = await axios.post(
              `${API_AUTH_URL}/refresh`,
              {},
              { withCredentials: true }
            );
            const newAccessToken = res.data.item.accessToken;
            if (newAccessToken) {
              dispatch(refreshToken(newAccessToken));
              configInstance.headers[
                "authorization"
              ] = `Bearer ${newAccessToken}`;
            }
          } else {
            configInstance.headers["authorization"] = `Bearer ${accessToken}`;
          }
        }
        //  else {
        //   dispatch(logout());
        // }
        return configInstance;
      } catch (error) {
        console.log(error?.response);
        if (error?.response?.status === 403) {
          navigate(config.routes.login);
        }
      }
    },
    (err) => {}
  );
  instance.interceptors.response.use((res) => {
    return res.data;
  });
  return instance;
};
