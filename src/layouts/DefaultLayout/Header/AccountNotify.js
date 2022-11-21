import { Box } from "@mui/material";
import axios from "axios";
import { memo } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { API_AUTH_URL } from "../../../constants";
import { logout } from "../../../redux/authSlice";
import config from "../../../config";
const AccountNotify = () => {
  const user = useSelector((state) => state.auth.currentUser);

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const handleLogout = () => {
    axios.get(`${API_AUTH_URL}/logout`);
    dispatch(logout());
    navigate(config.routes.login);
  };
  return (
    <Box className="account-notify">
      {user ? (
        <>
          <Link to={config.routes.account} className="account-notify-item">
            Thông tin tài khoản
          </Link>
          {user && user.role && user.role.role === "admin" ? (
            <Link to={config.routes.dashboard} className="account-notify-item">
              Bảng điều khiển
            </Link>
          ) : (
            <Link
              to={config.routes.accountOrder}
              className="account-notify-item"
            >
              Đơn hàng của tôi
            </Link>
          )}
          <Link
            to={config.routes.accountLatest}
            className="account-notify-item"
          >
            Đã xem gần đây
          </Link>
          <Link
            to={config.routes.accountFavorite}
            className="account-notify-item"
          >
            Sản phẩm yêu thích
          </Link>
          <Link
            to={config.routes.changePassword}
            className="account-notify-item"
          >
            Đổi mật khẩu
          </Link>
          <div
            className="account-notify-item"
            onClick={handleLogout}
            style={{
              borderTop: "1px solid #000",
              paddingTop: "8px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <LogoutIcon fontSize="20px" style={{ marginRight: "4px" }} />
            Đăng xuất
          </div>
        </>
      ) : (
        <>
          <Link to={config.routes.login} className="account-notify-item">
            Đăng nhập
          </Link>
          <Link to={config.routes.register} className="account-notify-item">
            Đăng ký
          </Link>
        </>
      )}
    </Box>
  );
};

export default memo(AccountNotify);
