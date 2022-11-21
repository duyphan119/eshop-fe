import BarChartIcon from "@mui/icons-material/BarChart";
import CategoryIcon from "@mui/icons-material/Category";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import StraightenIcon from "@mui/icons-material/Straighten";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptIcon from "@mui/icons-material/Receipt";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import RedeemIcon from "@mui/icons-material/Redeem";
import DiscountIcon from "@mui/icons-material/Discount";
import WidgetsIcon from "@mui/icons-material/Widgets";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { Box, Tooltip, useMediaQuery } from "@mui/material";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import { styled, useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../../components/Logo";
import config from "../../../config";
import { DRAWER_WIDTH } from "../../../constants";
import detailIcon from "../../../assets/imgs/detail.png";

const StyledDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: DRAWER_WIDTH,

    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
    }),
  },
}));

const Drawer = ({ open, toggleDrawer }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("lg"));

  const location = useLocation();

  const [items, setItems] = React.useState([
    {
      text: "Bảng điều khiển",
      to: config.routes.dashboard,
      icon: <DashboardIcon sx={{ fontSize: 20 }} />,
    },
    {
      text: "Danh mục",
      icon: <CategoryIcon sx={{ fontSize: 20 }} />,
      children: [
        {
          text: "Nhóm danh mục",
          to: config.routes.groupCategoryManagement,
          icon: <WidgetsIcon sx={{ fontSize: 20 }} />,
        },
        {
          text: "Danh mục",
          to: config.routes.categoryManagement,
          icon: <CategoryIcon sx={{ fontSize: 20 }} />,
        },
      ],
      isShowChildren:
        location.pathname === config.routes.groupCategoryManagement ||
        location.pathname === config.routes.categoryManagement,
    },
    {
      text: "Sản phẩm",
      icon: <InventoryIcon sx={{ fontSize: 20 }} />,
      children: [
        {
          text: "Màu sắc",
          to: config.routes.colorManagement,
          icon: <ColorLensIcon sx={{ fontSize: 20 }} />,
        },
        {
          text: "Kích cỡ",
          to: config.routes.sizeManagement,
          icon: <StraightenIcon sx={{ fontSize: 20 }} />,
        },
        {
          text: "Nhóm sản phẩm",
          to: config.routes.groupProductManagement,
          icon: <WidgetsIcon sx={{ fontSize: 20 }} />,
        },
        {
          text: "Sản phẩm",
          to: config.routes.productManagement,
          icon: <InventoryIcon sx={{ fontSize: 20 }} />,
        },
        {
          text: "Hình ảnh sản phẩm",
          to: config.routes.productImageManagement,
          icon: <InsertPhotoIcon sx={{ fontSize: 20 }} />,
        },
        {
          text: "Chi tiết sản phẩm",
          to: config.routes.productDetailManagement,
          icon: <img alt="" src={detailIcon} width="20" height="20" />,
        },
        {
          text: "Giảm giá",
          to: config.routes.discountManagement,
          icon: <DiscountIcon sx={{ fontSize: 20 }} />,
        },
      ],
      isShowChildren:
        location.pathname === config.routes.colorManagement ||
        location.pathname === config.routes.productManagement ||
        location.pathname === config.routes.productImageManagement ||
        location.pathname === config.routes.productDetailManagement ||
        location.pathname === config.routes.groupProductManagement ||
        location.pathname === config.routes.discountManagement ||
        location.pathname === config.routes.sizeManagement,
    },
    {
      text: "Đánh giá",
      to: config.routes.CommentProductManagement,
      icon: <ModeCommentIcon sx={{ fontSize: 20 }} />,
    },
    {
      text: "Người dùng",
      icon: <PeopleIcon sx={{ fontSize: 20 }} />,
      children: [
        {
          text: "Quyền",
          to: config.routes.roleManagement,
          icon: <PermIdentityIcon sx={{ fontSize: 20 }} />,
        },
        {
          text: "Người dùng",
          to: config.routes.userManagement,
          icon: <PeopleIcon sx={{ fontSize: 20 }} />,
        },
      ],
      isShowChildren:
        location.pathname === config.routes.roleManagement ||
        location.pathname === config.routes.userManagement,
    },
    {
      text: "Đơn hàng",
      icon: <ReceiptIcon sx={{ fontSize: 20 }} />,
      children: [
        {
          text: "Ưu đãi",
          to: config.routes.couponManagement,
          icon: <RedeemIcon sx={{ fontSize: 20 }} />,
        },
        {
          text: "Trạng thái đơn hàng",
          to: config.routes.orderStatusManagement,
          icon: <LocalShippingIcon sx={{ fontSize: 20 }} />,
        },
        {
          text: "Đơn hàng",
          to: config.routes.orderManagement,
          icon: <ReceiptIcon sx={{ fontSize: 20 }} />,
        },
      ],
      isShowChildren:
        location.pathname === config.routes.orderManagement ||
        location.pathname === config.routes.orderStatusManagement ||
        location.pathname === config.routes.couponManagement,
    },
    {
      text: "Thống kê",
      to: config.routes.statistics,
      icon: <BarChartIcon sx={{ fontSize: 20 }} />,
    },
  ]);

  const navigate = useNavigate();

  function handleClick(item, index) {
    const _items = [...items];
    _items[index].isShowChildren = !_items[index].isShowChildren;
    setItems(_items);
    if (item.to) {
      navigate(item.to);
    }
  }

  return (
    <StyledDrawer variant={matches ? "permanent" : "temporary"} open={open}>
      <Box bgcolor="#fff" height="100vh">
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: [1],
            position: "fixed",
            top: 0,
            left: 0,
            bgcolor: "#fff",
            overflow: "hidden",
            width: DRAWER_WIDTH,
          }}
        >
          <Logo
            style={{
              color: "#000",
              fontSize: 52,
            }}
            sx={{ height: 64, ml: 1 }}
          />
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Toolbar>
        <div
          style={{
            marginTop: 64,
            height: "calc(100vh - 64px)",
            overflowY: "overlay",
          }}
          className="custom-scrollbar"
        >
          <Divider />
          {items.map((item, index) => {
            return (
              <Box key={index}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    py: 1,
                    px: 2,
                    bgcolor:
                      item.to && location.pathname === item.to
                        ? "var(--main-color)"
                        : "inherit",
                    color:
                      item.to && location.pathname === item.to
                        ? "#000"
                        : "#000",
                    "&:hover": {
                      bgcolor: "lightgray",
                      color: "#000",
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => handleClick(item, index)}
                >
                  {open ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {item.icon}
                        <div style={{ marginLeft: theme.spacing(2) }}>
                          {item.text}
                        </div>
                      </div>
                      {item.children && (
                        <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
                      )}
                    </div>
                  ) : (
                    <Tooltip title={item.text} placement="right">
                      {item.icon}
                    </Tooltip>
                  )}
                </Box>
                <Box>
                  {item.children &&
                    item.isShowChildren &&
                    item.children.map((element, index) => {
                      return (
                        <Link to={element.to} key={index}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              py: 1,
                              pl: open ? 4 : 2,
                              pr: 2,
                              fontSize: 14,
                              userSelect: "none",
                              bgcolor:
                                location.pathname === element.to
                                  ? "var(--main-color)"
                                  : "inherit",
                              color:
                                location.pathname === element.to
                                  ? "#000"
                                  : "#000",
                              "&:hover": {
                                bgcolor: "lightgray",
                                color: "#000",
                              },
                            }}
                          >
                            {open ? (
                              element.icon
                            ) : (
                              <Tooltip title={element.text} placement="right">
                                {element.icon}
                              </Tooltip>
                            )}

                            <div style={{ marginLeft: theme.spacing(2) }}>
                              {open ? element.text : ""}
                            </div>
                          </Box>
                        </Link>
                      );
                    })}
                </Box>
              </Box>
            );
          })}
        </div>
      </Box>
    </StyledDrawer>
  );
};

export default Drawer;
