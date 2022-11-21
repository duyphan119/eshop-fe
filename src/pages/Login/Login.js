import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import top_banner from "../../assets/imgs/hannah-morgan-39891.webp";
import Breadcrumbs from "../../components/Breadcrumbs";
import config from "../../config";
import { axiosRes } from "../../config/configAxios";
import { API_AUTH_URL } from "../../constants";
import { setAccessToken } from "../../redux/authSlice";
import { showToast } from "../../redux/toastSlice";
import "./Login.css";
const Login = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [error, setError] = useState();

  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    axiosRes()
      .post(`${API_AUTH_URL}/login`, data)
      .then((res) => {
        dispatch(setAccessToken(res.item));
        dispatch(
          showToast({
            isOpen: true,
            text: "Đăng nhập thành công",
            type: "success",
          })
        );
        navigate(config.routes.home);
      })
      .catch((err) => {
        const msg = err?.response?.data?.message;
        let obj = {};
        if (
          msg.toLowerCase().includes("email") ||
          msg.toLowerCase().includes("email")
        ) {
          obj = {
            ...obj,
            emailOrPassword: { message: "Email hoặc mật khẩu không chính xác" },
          };
        }
        setError(obj);
      });
  };
  useEffect(() => {
    document.title = "Đăng nhập";
  }, []);

  return (
    <>
      <div
        style={{
          backgroundImage: `url('${top_banner}')`,
          height: 230,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div style={{ fontSize: 36 }}>Đăng nhập</div>
        <Breadcrumbs
          sx={{ textTransform: "uppercase", mt: 2, fontSize: 12 }}
          items={[
            {
              text: "Trang chủ",
              to: config.routes.home,
            },
            {
              text: "Tài khoản",
            },
          ]}
        />
      </div>
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{
            mt: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <input
            {...register("email", {
              required: "Trường này không được để trống",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Địa chỉ email không hợp lệ",
              },
            })}
            className="login-input"
            placeholder="Địa chỉ email"
          />
          <input
            {...register("password", {
              required: "Trường này không được để trống",
              minLength: { value: 6, message: "Mật khẩu ít nhất 6 kí tự" },
            })}
            style={{ marginTop: 16 }}
            type="password"
            placeholder="Mật khẩu"
            className="login-input"
          />
          <div style={{ width: "100%" }}>
            {error?.emailOrPassword && (
              <span style={{ fontSize: 12, color: "red", textAlign: "left" }}>
                {error.emailOrPassword.message}
              </span>
            )}
          </div>
          <div className="login-btn-submit">
            <button type="submit">Đăng nhập</button>
          </div>
          <div
            style={{
              height: 1,
              backgroundColor: "gray",
              width: 180,
              marginBlock: 32,
            }}
          ></div>
          <Link
            to={config.routes.home}
            className="hover-color-main-color login-action-link"
          >
            Về trang chủ
          </Link>
          <Link
            to={config.routes.register}
            className="hover-color-main-color login-action-link"
          >
            Đăng ký
          </Link>
          <Link to={`/`} className="hover-color-main-color login-action-link">
            Quên mật khẩu
          </Link>
        </Box>
      </Box>
    </>
  );
};
export default Login;
