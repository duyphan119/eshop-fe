import { memo, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch, useSelector } from "react-redux";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import config from "../../../config";
import axios from "axios";
import { logout } from "../../../redux/authSlice";
import { API_AUTH_URL } from "../../../constants";

const HeaderDrawer = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("lg"));

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [state, setState] = useState(false);
  const groupCategories = useSelector((state) => state.groupCategory.all);
  const [showGroupCategories, setShowGroupCategories] = useState(false);

  const toggleDrawer = (e) => {
    if (e.type === "keydown" && (e.key === "Tab" || e.key === "Shift")) {
      return;
    }
    setState(!state);
  };

  function handleLogout() {
    axios.get(`${API_AUTH_URL}/logout`);
    dispatch(logout());
    navigate(config.routes.login);
    setState(!state);
  }

  useEffect(() => {
    if (!state) {
      setShowGroupCategories(false);
    }
  }, [state]);

  return (
    <>
      <MenuIcon onClick={toggleDrawer} />

      <Drawer
        anchor="right"
        open={state}
        onClose={toggleDrawer}
        variant={matches ? "permanent" : "temporary"}
      >
        <Box sx={{ width: 250 }} onKeyDown={() => setState(!state)}>
          <List>
            <Link
              to={config.routes.account}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <ListItem button onClick={() => setState(!state)}>
                <ListItemIcon>
                  <AccountBoxOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Thông tin tài khoản" />
              </ListItem>
            </Link>
            <Link
              to={config.routes.cart}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <ListItem button onClick={() => setState(!state)}>
                <ListItemIcon>
                  <ShoppingCartOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Giỏ hàng" />
              </ListItem>
            </Link>
            <ListItem
              button
              onClick={() => setShowGroupCategories(!showGroupCategories)}
            >
              <ListItemIcon>
                <CategoryOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Danh mục" />
            </ListItem>
            {showGroupCategories &&
              groupCategories.map((genderCategory, index) => (
                <Link
                  to={`/${genderCategory.slug}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                  }}
                  key={index}
                >
                  <ListItem button>
                    <ListItemText primary={genderCategory.name} />
                  </ListItem>
                </Link>
              ))}
            <Link
              to={config.routes.accountFavorite}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <ListItem button onClick={() => setState(!state)}>
                <ListItemIcon>
                  <FavoriteBorderOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Yêu thích" />
              </ListItem>
            </Link>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Đăng xuất" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};
export default memo(HeaderDrawer);
