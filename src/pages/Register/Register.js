import Box from "@mui/material/Box";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import top_banner from "../../assets/imgs/hannah-morgan-39891.webp";
import Breadcrumbs from "../../components/Breadcrumbs";
import config from "../../config";
import { API_AUTH_URL } from "../../constants";
import { setAccessToken } from "../../redux/authSlice";
import { showToast } from "../../redux/toastSlice";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [error, setError] = useState();

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      await axios.post(`${API_AUTH_URL}/register`, data);
      const res = await axios.post(`${API_AUTH_URL}/login`, data);
      dispatch(setAccessToken(res.item));
      dispatch(
        showToast({
          isOpen: true,
          text: "Đăng ký thành công",
          type: "success",
        })
      );
      // navigate(config.routes.login);
    } catch (er) {
      const msg = er?.response?.data?.message;
      let obj = {};
      if (msg.toLowerCase().includes("email")) {
        obj = { ...obj, email: { message: "Email không hợp lệ" } };
      }
      if (msg.toLowerCase().includes("telephone")) {
        obj = {
          ...obj,
          telephone: { message: "Số điện thoại đã có người sử dụng" },
        };
      }
      setError(obj);
    }
  };
  const password = useRef({});
  password.current = watch("password", "");
  useEffect(() => {
    document.title = "Đăng kí";
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
        <div style={{ fontSize: 36 }}>Đăng ký</div>
        <Breadcrumbs
          sx={{ textTransform: "uppercase", mt: 2, fontSize: 12 }}
          items={[
            {
              text: "Trang chủ",
              to: "/",
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
            {...register("fullName", {
              required: "Trường này không được để trống",
            })}
            className="register-input"
            placeholder="Họ tên"
          />
          <div style={{ width: "100%" }}>
            {errors.fullName && (
              <span style={{ fontSize: 12, color: "red", textAlign: "left" }}>
                {errors.fullName.message}
              </span>
            )}
          </div>
          <input
            {...register("email", {
              required: "Trường này không được để trống",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Địa chỉ email không hợp lệ",
              },
            })}
            className="register-input"
            placeholder="Địa chỉ email"
          />
          <div style={{ width: "100%" }}>
            {errors.email && (
              <span style={{ fontSize: 12, color: "red", textAlign: "left" }}>
                {errors.email.message}
              </span>
            )}
            {error?.email && (
              <span style={{ fontSize: 12, color: "red", textAlign: "left" }}>
                {error.email.message}
              </span>
            )}
          </div>
          <input
            {...register("password", {
              required: "Trường này không được để trống",
              minLength: { value: 6, message: "Mật khẩu ít nhất 6 kí tự" },
            })}
            fullWidth
            type="password"
            placeholder="Mật khẩu"
            className="register-input"
          />
          <div style={{ width: "100%" }}>
            {errors.password && (
              <span style={{ fontSize: 12, color: "red", textAlign: "left" }}>
                {errors.password.message}
              </span>
            )}
          </div>
          <input
            {...register("confirmPassword", {
              required: "Trường này không được để trống",
              validate: (value) =>
                value === password.current ||
                "Nhập lại mật khẩu không chính xác",
            })}
            fullWidth
            type="password"
            placeholder="Nhập lại mật khẩu"
            className="register-input"
          />
          <div style={{ width: "100%" }}>
            {errors.confirmPassword && (
              <span style={{ fontSize: 12, color: "red", textAlign: "left" }}>
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
          <input
            {...register("telephone", {
              required: "Trường này không được để trống",
              pattern: {
                value: /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
                message: "Số điện thoại không hợp lệ",
              },
            })}
            className="register-input"
            placeholder="Số điện thoại"
          />
          <div style={{ width: "100%" }}>
            {errors.telephone && (
              <span style={{ fontSize: 12, color: "red", textAlign: "left" }}>
                {errors.telephone.message}
              </span>
            )}
            {error?.telephone && (
              <span style={{ fontSize: 12, color: "red", textAlign: "left" }}>
                {error.telephone.message}
              </span>
            )}
          </div>

          <div className="register-btn-submit">
            <button type="submit">Đăng ký</button>
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
            className="hover-color-main-color register-action-link"
          >
            Về trang chủ
          </Link>
          <Link
            to={config.routes.login}
            className="hover-color-main-color register-action-link"
          >
            Đăng nhập
          </Link>
        </Box>
      </Box>
    </>
  );
}
