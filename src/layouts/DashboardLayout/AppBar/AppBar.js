import MenuIcon from "@mui/icons-material/Menu";
import {
  Avatar,
  Box,
  ClickAwayListener,
  Divider,
  useMediaQuery,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import { styled, useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { API_AUTH_URL, DRAWER_WIDTH } from "../../../constants";
// import NotificationIcon from "./NotificationIcon";
import "./AppBar.css";
import config from "../../../config";
import { getURL } from "../../../utils";
import { axiosRes } from "../../../config/configAxios";
import { logout } from "../../../redux/authSlice";

const StyledAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open, marginleft, width, bgcolor }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: marginleft,
    width,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const AppBar = ({ open, toggleDrawer }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("lg"));

  const currentUser = useSelector((state) => state.auth.currentUser);

  const [title, setTitle] = React.useState("");
  const [openAccountNotify, setOpenAccountNotify] = React.useState(false);

  const location = useLocation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  React.useEffect(() => {
    let _title;
    if (location.pathname === config.routes.orderManagement) {
      _title = "Quản lý đơn hàng";
    } else if (location.pathname === config.routes.productManagement) {
      _title = "Quản lý sản phẩm";
    } else if (location.pathname === config.routes.userManagement) {
      _title = "Quản lý người dùng";
    } else if (location.pathname === config.routes.CommentProductManagement) {
      _title = "Quản lý bình luận";
    } else if (location.pathname === config.routes.statistics) {
      _title = "Báo cáo, thống kê";
    } else if (location.pathname === config.routes.categoryManagement) {
      _title = "Quản lý danh mục";
    } else if (location.pathname === config.routes.websiteManagement) {
      _title = "Quản lý website";
    } else if (location.pathname === config.routes.dashboard) {
      _title = "Bảng điều khiển";
    } else if (location.pathname === config.routes.groupCategoryManagement) {
      _title = "Quản lý nhóm danh mục";
    } else if (location.pathname === config.routes.groupProductManagement) {
      _title = "Quản lý nhóm sản phẩm";
    } else if (location.pathname === config.routes.colorManagement) {
      _title = "Quản lý màu sắc";
    } else if (location.pathname === config.routes.sizeManagement) {
      _title = "Quản lý kích cỡ";
    } else if (location.pathname === config.routes.discountManagement) {
      _title = "Quản lý giảm giá";
    } else if (location.pathname === config.routes.roleManagement) {
      _title = "Quản lý quyền";
    } else if (location.pathname === config.routes.couponManagement) {
      _title = "Quản lý ưu đãi";
    } else if (location.pathname === config.routes.productDetailManagement) {
      _title = "Quản lý chi tiết sản phẩm";
    } else if (location.pathname === config.routes.orderStatusManagement) {
      _title = "Quản lý trạng thái đơn hàng";
    } else if (location.pathname === config.routes.productAdd) {
      _title = "Thêm sản phẩm";
    } else if (location.pathname === config.routes.productEdit) {
      _title = "Sửa sản phẩm";
    } else if (location.pathname === config.routes.productImageManagement) {
      _title = "Quản lý hình ảnh sản phẩm";
    }
    document.title = _title;
    setTitle(_title);
  }, [location.pathname]);

  const handleLogout = () => {
    axiosRes()
      .post(`${API_AUTH_URL}/logout`)
      .then(() => {
        dispatch(logout());
        navigate(config.routes.login);
      })
      .catch((err) => {});
  };

  return (
    <StyledAppBar
      position="absolute"
      open={open}
      marginleft={!matches ? "0" : `${DRAWER_WIDTH}px`}
      width={!matches ? "100%" : `calc(100% - ${DRAWER_WIDTH}px)`}
    >
      <Box bgcolor="var(--main-color)" color="#000">
        <Toolbar
          sx={{
            pr: "24px", // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            {title}
          </Typography>
          {/* <NotificationIcon /> */}
          <Box position="relative" sx={{ cursor: "pointer" }}>
            <Avatar
              src={getURL(currentUser?.avatar)}
              onClick={() => setOpenAccountNotify(!openAccountNotify)}
              alt="Phan Khánh Duy"
            />
            {openAccountNotify && (
              <ClickAwayListener
                onClickAway={() => setOpenAccountNotify(false)}
              >
                <Box
                  position="absolute"
                  bgcolor="#fff"
                  right={0}
                  top="100%"
                  mt={1}
                  border="1px solid lightgray"
                  width={120}
                  sx={{
                    ".app-bar-account-notify-item:hover": {
                      textDecoration: "underline",
                      color: "var(--main-color)",
                    },
                    ".app-bar-account-notify-item": {
                      p: 1,
                      fontSize: 14,
                      a: {
                        display: "block",
                      },
                    },
                  }}
                >
                  <Box
                    className="app-bar-account-notify-item"
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    <Link to={config.routes.profile}>Tài khoản</Link>
                  </Box>
                  <Divider />
                  <Box
                    className="app-bar-account-notify-item"
                    sx={{ whiteSpace: "nowrap" }}
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </Box>
                </Box>
              </ClickAwayListener>
            )}
          </Box>
        </Toolbar>
      </Box>
    </StyledAppBar>
  );
};

export default React.memo(AppBar);
