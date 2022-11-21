import { Box, Button, Grid } from "@mui/material";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { API_USER_URL } from "../../constants";
import { axiosToken } from "../../config/configAxios";
import config from "../../config";
import pageHeaderImg from "../../assets/imgs/search/bg-page-header.webp";
import Breadcrumbs from "../../components/Breadcrumbs";
import { showToast } from "../../redux/toastSlice";
const items = [
  {
    text: "Trang thông tin cá nhân",
    to: config.routes.profile,
  },
  {
    text: "Trang sửa thông tin tài khoản",
    to: config.routes.profileEdit,
  },
  {
    text: "Trang đổi mật khẩu",
    to: config.routes.changePassword,
  },
  {
    text: "Trang đơn hàng của tôi",
    to: config.routes.profileOrder,
  },
];
const ChangePassword = () => {
  const { register, handleSubmit, watch } = useForm();

  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);
  const currentUser = useSelector((state) => state.auth.currentUser);

  const dispatch = useDispatch();

  const newPassword = useRef({});
  newPassword.current = watch("newPassword", "");

  useEffect(() => {
    document.title = "Đổi mật khẩu";
  }, []);

  const onSubmit = (data) => {
    axiosToken(token?.accessToken, dispatch, navigate)
      .put(`${API_USER_URL}/change-password/${currentUser.id}`, data)
      .then(() => {
        dispatch(
          showToast({
            isOpen: true,
            text: "Đổi mật khẩu thành công",
            type: "success",
          })
        );
      })
      .catch((err) => {});
  };
  const password = useRef({});
  password.current = watch("newPassword", "");
  return (
    <Box>
      <div
        style={{
          backgroundImage: `url('${pageHeaderImg}')`,
          width: "100%",
          height: 260,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          paddingInline: 32,
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 8 }}>Đổi mật khẩu</div>
        <Box pl={2}>
          <Breadcrumbs
            sx={{ fontSize: 10 }}
            items={[
              {
                text: "TRANG CHỦ",
                to: config.routes.home,
              },
              {
                text: "ĐỔI MẬT KHẨU",
              },
            ]}
          />
        </Box>
      </div>
      <Box p={8}>
        <Grid container>
          <Grid item xs={6} sx={{ fontSize: 16 }} pr={4}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ fontSize: 26 }}>Đổi mật khẩu tài khoản cá nhân</Box>
              <Box display="flex" alignItems="center" pr={6} my={1}>
                <Box
                  sx={{ flex: 2, fontWeight: 600, cursor: "pointer" }}
                  component="label"
                  htmlFor="oldPassword"
                >
                  Mật khẩu cũ:
                </Box>
                <Box sx={{ flex: 1 }}>
                  <input
                    {...register("oldPassword", {
                      required: "Trường này không được để trống",
                      minLength: {
                        value: 6,
                        message: "Mật khẩu ít nhất 6 kí tự",
                      },
                    })}
                    type="password"
                    id="oldPassword"
                    style={{
                      borderRadius: "0",
                      fontSize: 16,
                      outline: "none",
                      border: "1px solid gray",
                    }}
                  />
                </Box>
              </Box>
              <Box display="flex" alignItems="center" pr={6} my={1}>
                <Box
                  sx={{ flex: 2, fontWeight: 600, cursor: "pointer" }}
                  component="label"
                  htmlFor="newPassword"
                >
                  Mật khẩu mới:
                </Box>
                <Box sx={{ flex: 1 }}>
                  <input
                    {...register("newPassword", {
                      required: "Trường này không được để trống",
                      minLength: {
                        value: 6,
                        message: "Mật khẩu ít nhất 6 kí tự",
                      },
                    })}
                    type="password"
                    id="newPassword"
                    style={{
                      borderRadius: "0",
                      fontSize: 16,
                      outline: "none",
                      border: "1px solid gray",
                    }}
                  />
                </Box>
              </Box>
              <Box display="flex" alignItems="center" pr={6} my={1}>
                <Box
                  sx={{ flex: 2, fontWeight: 600, cursor: "pointer" }}
                  component="label"
                  htmlFor="reNewPassword"
                >
                  Nhập lại mật khẩu mới:
                </Box>
                <Box sx={{ flex: 1 }}>
                  <input
                    {...register("reNewPassword", {
                      required: "Trường này không được để trống",
                      minLength: {
                        value: 6,
                        message: "Mật khẩu ít nhất 6 kí tự",
                      },
                      validate: (value) =>
                        value === password.current ||
                        "Nhập lại mật khẩu không chính xác",
                    })}
                    type="password"
                    id="reNewPassword"
                    style={{
                      borderRadius: "0",
                      fontSize: 16,
                      outline: "none",
                      border: "1px solid gray",
                    }}
                  />
                </Box>
              </Box>
              <Box pr={6} my={1}>
                <Button
                  type="submit"
                  size="small"
                  sx={{
                    bgcolor: "var(--main-color)",
                    textTransform: "initial",
                    color: "#fff",
                    px: 2,
                    fontSize: 16,
                    "&:hover": {
                      bgcolor: "var(--main-color) !important",
                      color: "#fff !important",
                    },
                  }}
                >
                  Xác nhận
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ fontSize: 26 }}>Quản lý cá nhân</Box>
            <ul>
              {items.map((item, index) => (
                <li key={index} style={{ marginBlock: 2 }}>
                  <Link className="link-default" to={item.to}>
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ChangePassword;
