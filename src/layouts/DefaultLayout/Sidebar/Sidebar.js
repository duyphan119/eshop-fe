import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import YouTubeIcon from "@mui/icons-material/YouTube";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import "./Sidebar.css";
import { Badge, Box, Tooltip } from "@mui/material";
import Logo from "../../../components/Logo";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { axiosRes, axiosToken } from "../../../config/configAxios";
import {
  API_CART_URL,
  API_GROUP_CATEGORY_URL,
  API_PRODUCT_USER_URL,
  slugs,
} from "../../../constants";
import { getAllGroupCategories } from "../../../redux/groupCategorySlice";
import { getCart } from "../../../redux/cartSlice";
import config from "../../../config";
import { decodeToken } from "../../../utils";
import SearchBar from "../../../components/SearchBar/SearchBar";
import { getWishlist } from "../../../redux/wishlistSlice";
import { setCurrentUser } from "../../../redux/authSlice";
const Sidebar = () => {
  const groupCategories = useSelector((state) => state.groupCategory.all);
  const token = useSelector((state) => state.auth.token);
  const cart = useSelector((state) => state.cart.cart);
  const wishlist = useSelector((state) => state.wishlist.wishlist);

  const dispatch = useDispatch();

  const [openSearchBar, setOpenSearchBar] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const promises = [];
    promises.push(axiosRes().get(`${API_GROUP_CATEGORY_URL}`));
    if (token) {
      const user = decodeToken(token?.accessToken);
      dispatch(setCurrentUser(user));
      if (user && user.id) {
        promises.push(axiosRes().get(`${API_CART_URL}/user/${user.id}`));
        promises.push(
          axiosToken(token?.accessToken, dispatch, navigate).get(
            `${API_PRODUCT_USER_URL}/user?userId=${user.id}`
          )
        );
      }
    }
    Promise.allSettled(promises)
      .then((listRes) => {
        if (listRes[0].status === "fulfilled") {
          dispatch(getAllGroupCategories(listRes[0].value.items));
        }
        if (listRes[1] && listRes[1].status === "fulfilled") {
          dispatch(getCart(listRes[1].value.item));
        }
        if (listRes[2] && listRes[2].status === "fulfilled") {
          dispatch(getWishlist(listRes[2].value.items));
        }
      })
      .catch((err) => {});
  }, [dispatch, token, navigate]);
  return (
    <>
      <Box
        position="fixed"
        top={0}
        left={0}
        height="100vh"
        width="20%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        overflow="hidden"
        bgcolor="#fff"
      >
        <Box my={5}>
          <Logo sx={{ height: 150, display: "block" }} />
        </Box>
        <Box display="flex" my={3}>
          <Box cursor="pointer">
            <Tooltip title="Quản lý tài khoản">
              <Link to={config.routes.profile}>
                <AccountCircleOutlinedIcon
                  sx={{
                    fontSize: 24,
                    cursor: "pointer",
                    "&:hover": { color: "var(--main-color)" },
                  }}
                />
              </Link>
            </Tooltip>
          </Box>
          <Box sx={{ ml: 2 }} onClick={() => setOpenSearchBar(!openSearchBar)}>
            <Tooltip title="Tìm kiếm sản phẩm">
              <SearchOutlinedIcon
                sx={{
                  fontSize: 24,
                  cursor: "pointer",
                  "&:hover": { color: "var(--main-color)" },
                }}
              />
            </Tooltip>
          </Box>
          <Badge
            badgeContent={wishlist.length}
            sx={{
              ".MuiBadge-badge": {
                bgcolor: "#000 ",
                color: "#fff",
              },
              ml: 2,
            }}
          >
            <Link to={config.routes.profileFavorite}>
              <Tooltip title="Sản phẩm yêu thích">
                <FavoriteBorderOutlinedIcon
                  sx={{
                    fontSize: 24,
                    "&:hover": { color: "var(--main-color)" },
                  }}
                />
              </Tooltip>
            </Link>
          </Badge>
          <Badge
            badgeContent={cart ? cart.count : 0}
            sx={{
              ".MuiBadge-badge": {
                bgcolor: "#000 ",
                color: "#fff",
              },
              ml: 2,
            }}
          >
            <Link to={config.routes.cart}>
              <Tooltip title="Giỏ hàng của bạn">
                <LocalMallOutlinedIcon
                  sx={{
                    fontSize: 24,
                    "&:hover": { color: "var(--main-color)" },
                  }}
                />
              </Tooltip>
            </Link>
          </Badge>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          width="100%"
        >
          <Box
            textAlign="center"
            width="100%"
            cursor="pointer"
            sx={{
              "&:hover a": {
                color: "var(--main-color)",
                textDecoration: "underline",
              },
              "&:hover": {
                bgcolor: "rgb(248,248,248)",
              },
            }}
          >
            <Link
              style={{
                width: "100%",
                display: "block",
                textTransform: "uppercase",
                padding: 16,
                fontSize: 14,
              }}
              to={`/${slugs.NEWEST}`}
            >
              Mới nhất
            </Link>
          </Box>
          {groupCategories.map((item, index) => {
            return (
              <Box
                key={index}
                textAlign="center"
                width="100%"
                cursor="pointer"
                sx={{
                  "&:hover a": {
                    color: "var(--main-color)",
                    textDecoration: "underline",
                  },
                  "&:hover": {
                    bgcolor: "rgb(248,248,248)",
                  },
                }}
              >
                <Link
                  style={{
                    width: "100%",
                    display: "block",
                    padding: 16,
                    fontSize: 14,
                    textTransform: "uppercase",
                  }}
                  to={`/${item.slug}`}
                >
                  {item.name}
                </Link>
              </Box>
            );
          })}
        </Box>
        <Box display="flex" my={3} marginTop="auto">
          <Box>
            <FacebookIcon
              sx={{
                fontSize: 20,
                cursor: "pointer",
                "&:hover": { color: "var(--main-color)" },
              }}
            />
          </Box>
          <Box sx={{ ml: 2 }}>
            <Link to={`/`}>
              <InstagramIcon
                sx={{ fontSize: 20, "&:hover": { color: "var(--main-color)" } }}
              />
            </Link>
          </Box>
          <Box sx={{ ml: 2 }}>
            <Link to={`/`}>
              <YouTubeIcon
                sx={{ fontSize: 20, "&:hover": { color: "var(--main-color)" } }}
              />
            </Link>
          </Box>
        </Box>
      </Box>
      <SearchBar open={openSearchBar} onClose={() => setOpenSearchBar(false)} />
    </>
  );
};

Sidebar.propTypes = {};

export default Sidebar;
