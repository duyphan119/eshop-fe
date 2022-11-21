import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  Box,
  Button,
  Grid,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import {
  API_CART_ITEM_URL,
  API_COMMENT_PRODUCT_URL,
  API_PRODUCT_USER_URL,
  API_USER_URL,
} from "../../constants";
import { axiosRes, axiosToken } from "../../config/configAxios";
import { showToast } from "../../redux/toastSlice";
import { addToCart } from "../../redux/cartSlice";
import styles from "./ProductDetail.module.css";
import Breadcrumbs from "../../components/Breadcrumbs";
import {
  decodeToken,
  formatThousandDigits,
  getFinalPrice,
  getURL,
} from "../../utils";
import { addToLatest } from "../../redux/productSlice";
// import { SocketContext } from "../../context";
import Product from "../../components/Product";
import Stars from "../../components/Stars";
import { addToWishlist, removeWishlistItem } from "../../redux/wishlistSlice";
import ModalSizeGuide from "./ModalSizeGuide";

import TabPanel from "../../components/TabPanel";
import CommentTabPanel from "./CommentTabPanel";
import {
  getProductDetailComments,
  getProductDetailMyComment,
} from "../../redux/commentSlice";
import { setCurrentUser } from "../../redux/authSlice";
import { useMemo } from "react";
import config from "../../config";
import { ModalRepCommentProduct } from "../../components/ModalAddUpdate";
const cx = classNames.bind(styles);
const ProductDetail = ({ query }) => {
  // const socket = useContext(SocketContext);

  const currentUser = useSelector((state) => state.auth.currentUser);
  const token = useSelector((state) => state.auth.token);
  const comments = useSelector((state) => state.comment.productDetail.list);
  const myComment = useSelector(
    (state) => state.comment.productDetail.myComment
  );
  const wishlist = useSelector((state) => state.wishlist.wishlist);

  const dispatch = useDispatch();

  const [product, setProduct] = useState();
  const [indexColor, setIndexColor] = useState(0);
  const [indexSize, setIndexSize] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [msgQuantity, setMsgQuantity] = useState("");
  const [productUser, setProductUser] = useState();
  const [openModalSizeGuide, setOpenModalSizeGuide] = useState(false);
  const [tab, setTab] = useState(0);

  const navigate = useNavigate();

  const { slug } = useParams();

  const newPrice = useMemo(() => {
    if (product?.groupProduct?.discounts[0]?.percent) {
      return getFinalPrice(
        product.initPrice,
        product.groupProduct.discounts[0]
      );
    }
    return 0;
  }, [product]);

  useEffect(() => {
    const promises = [];
    const user = decodeToken(token?.accessToken);
    promises.push(
      axiosToken(token?.accessToken, dispatch, navigate).get(query)
    );
    promises.push(
      axiosRes().get(`${API_COMMENT_PRODUCT_URL}/product?slug=${slug}`)
    );
    if (user) {
      promises.push(
        axiosRes(token?.accessToken, dispatch, navigate).get(
          `${API_USER_URL}/${user.id}`
        )
      );
    }
    Promise.allSettled(promises)
      .then((listRes) => {
        if (listRes[0].status === "fulfilled") {
          document.title = listRes[0].value.item.name;
          if (listRes[0].value && listRes[0].value.item) {
            setProduct(listRes[0].value.item);
            dispatch(addToLatest(listRes[0].value.item));
            setIndexSize(
              listRes[0].value.item.colors[0].sizes.findIndex(
                (item) => item.amount > 0
              )
            );
          }
        }
        if (listRes[1].status === "fulfilled") {
          const user = decodeToken(token?.accessToken);
          const index = listRes[1].value.items.findIndex(
            (item) => user && item.user.id === user.id
          );
          if (index !== -1) {
            dispatch(
              getProductDetailComments(
                listRes[1].value.items.filter(
                  (item) => item.user.id !== user.id
                )
              )
            );
            dispatch(getProductDetailMyComment(listRes[1].value.items[index]));
          } else {
            dispatch(getProductDetailComments(listRes[1].value.items));
          }
        }
        if (listRes[2] && listRes[2].status === "fulfilled") {
          dispatch(setCurrentUser(listRes[2].value.item));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch, token, navigate, query, slug]);

  useEffect(() => {
    if (product) {
      setProductUser(
        wishlist.findIndex((item) => item.id === product.id) !== -1
      );
    }
  }, [product, wishlist]);

  const handleChangeQuantity = (value) => {
    try {
      let newQuantity = parseInt(value);
      if (isNaN(newQuantity)) {
        newQuantity = 1;
      } else {
        if (newQuantity === 0) {
          newQuantity = 1;
        } else if (
          newQuantity > product.colors[indexColor].sizes[indexSize].amount
        ) {
          setMsgQuantity(
            `Mặt hàng này chỉ còn ${product.colors[indexColor].sizes[indexSize].amount}`
          );
        } else {
          setMsgQuantity("");
        }
      }
      setQuantity(newQuantity);
    } catch (error) {
      setQuantity(1);
    }
  };

  async function handleAddToCart() {
    if (currentUser) {
      if (quantity > product.colors[indexColor].sizes[indexSize].amount) {
        dispatch(
          showToast({
            text: "Số lượng không hợp lệ",
            type: "info",
            isOpen: true,
          })
        );
      } else {
        try {
          const data = await axiosToken(
            token?.accessToken,
            dispatch,
            navigate
          ).post(`${API_CART_ITEM_URL}`, {
            detailId: product.colors[indexColor].sizes[indexSize].detailId,
            quantity,
          });
          dispatch(addToCart(data.item));
          dispatch(
            showToast({
              type: "success",
              text: "Thêm thành công",
              isOpen: true,
            })
          );
        } catch (error) {}
      }
    } else {
      navigate(config.routes.login);
    }
  }

  async function handleAddToFavoriteList() {
    if (currentUser) {
      try {
        if (!productUser) {
          await axiosToken(token?.accessToken, dispatch, navigate).post(
            `${API_PRODUCT_USER_URL}`,
            {
              productId: product.id,
              userId: currentUser.id,
            }
          );
          dispatch(addToWishlist(product));
          dispatch(
            showToast({
              type: "success",
              text: "Đã thêm vào danh sách yêu thích",
              isOpen: true,
            })
          );
        } else {
          await axiosToken(token?.accessToken, dispatch, navigate).delete(
            `${API_PRODUCT_USER_URL}/product/${product.id}`
          );
          dispatch(removeWishlistItem(product.id));
          dispatch(
            showToast({
              type: "success",
              text: "Đã xoá khỏi danh sách yêu thích",
              isOpen: true,
            })
          );
        }
        setProductUser(!productUser);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function handleBuyNow() {
    try {
      if (currentUser) {
        if (quantity > product.colors[indexColor].sizes[indexSize].amount) {
          dispatch(
            showToast({
              text: "Số lượng không hợp lệ",
              type: "info",
              isOpen: true,
            })
          );
        } else {
          const data = await axiosToken(
            token?.accessToken,
            dispatch,
            navigate
          ).post(`${API_CART_ITEM_URL}`, {
            detailId: product.colors[indexColor].sizes[indexSize].detailId,
            quantity,
          });
          dispatch(addToCart(data.item));
          navigate(config.routes.cart);
        }
      } else {
        navigate(config.routes.login);
      }
    } catch (error) {}
  }

  const getAverageStar = useMemo(() => {
    let result = 0;
    let n = comments.length;

    comments.forEach((item) => {
      result += parseInt(item.rate);
    });

    return myComment
      ? (result + parseInt(myComment.rate)) / (n + 1)
      : result / n;
  }, [comments, myComment]);

  if (!product) return "";

  return (
    <Box className={cx("box")}>
      <Box mb={1} py={3} px={6} bgcolor="lightgrey">
        <Breadcrumbs
          items={[
            {
              to: "/",
              text: "Trang chủ",
            },
            {
              to: `/${product.groupProduct.category.groupCategory.slug}`,
              text: product.groupProduct.category.groupCategory.name,
            },
            {
              to: `/${product.groupProduct.category.slug}`,
              text: product.groupProduct.category.name,
            },
            {
              text: product.groupProduct.name,
            },
          ]}
        />
      </Box>
      <Box p={5}>
        <Grid container columnSpacing={3}>
          <Grid
            item
            lg={4}
            sx={{
              display: {
                xs: "none",
                lg: "flex",
              },
            }}
          >
            <Box width="100%">
              <img src={getURL(product.avatar)} alt="" width="100%" />
            </Box>
          </Grid>
          <Grid item xs={12} lg={8}>
            <div className="product-name">
              <div
                style={{
                  fontSize: 32,
                  textTransform: "uppercase",
                }}
              >
                {product.name}
              </div>
              <div
                className={cx("add-to-favorite")}
                onClick={handleAddToFavoriteList}
              >
                {productUser ? (
                  <Tooltip title="Huỷ bỏ yêu thích">
                    <FavoriteIcon
                      sx={{ fontSize: 20, color: "var(--error-color)" }}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title="Yêu thích">
                    <FavoriteBorderOutlinedIcon sx={{ fontSize: 20 }} />
                  </Tooltip>
                )}
              </div>
            </div>
            <div className={cx("rate")}>
              <Stars rate={getAverageStar} isActive={true} />
              <div className="">
                &nbsp;(
                {myComment ? comments.length + 1 : comments.length}&nbsp;đánh
                giá)
              </div>
            </div>
            <div className={cx("price-wrapper")}>
              <div
                className={`${cx("price")} ${newPrice ? cx("old-price") : ""}`}
              >
                {formatThousandDigits(product.initPrice)} ₫
              </div>
              {newPrice && (
                <div className={cx("new-price")}>
                  {formatThousandDigits(newPrice)} ₫
                </div>
              )}
            </div>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Màu sắc: {product?.colors[indexColor].value}
            </Typography>
            <div
              style={{
                display: "flex",
              }}
            >
              {product.colors.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`${cx("color-preview-item")} ${
                      index === indexColor ? cx("active") : ""
                    } ${indexSize === -1 ? cx("size-stuck") : ""}`}
                    style={{
                      backgroundImage: `url('${getURL(item.avatar)}')`,
                      backgroundSize: "contain",
                    }}
                    onClick={() => {
                      setIndexSize(
                        product.colors[index].sizes.findIndex(
                          (item) => item.amount > 0
                        )
                      );
                      setIndexColor(index);
                    }}
                  ></div>
                );
              })}
            </div>
            <Box display="flex" mt={2}>
              <Box>
                {product.colors[indexColor].sizes[indexSize].shortValue !==
                  "0" &&
                  product.colors[indexColor].sizes[indexSize].shortValue !==
                    "" && (
                    <Box>
                      <Typography variant="body1">Kích cỡ:</Typography>
                    </Box>
                  )}
                <Box
                  style={{
                    display: "flex",
                  }}
                >
                  {product.colors[indexColor].sizes.map((item, index) => {
                    if (item.shortValue === "0" || item.shortValue === "")
                      return "";
                    return (
                      <div
                        key={index}
                        style={{
                          width: "24px",
                          height: "24px",
                          cursor: item.amount === 0 ? "default" : "pointer",
                          border: `1px solid ${
                            index === indexSize ? "var(--main-color)" : "#000"
                          }`,
                          userSelect: "none",
                          marginRight: "4px",
                          padding: "3px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: ` ${
                            index === indexSize
                              ? "var(--main-color)"
                              : "transparent"
                          }`,
                          position: "relative",
                          fontSize: 10,
                        }}
                        onClick={() => {
                          if (item.amount > 0) {
                            setIndexSize(index);
                          }
                        }}
                        className={`${item.amount === 0 ? "size-stuck" : ""}`}
                      >
                        {item.value}
                      </div>
                    );
                  })}
                </Box>
              </Box>

              <Box
                ml={
                  product.colors[indexColor].sizes.length === 1 &&
                  product.colors[indexColor].sizes[0].shortValue === ""
                    ? 0
                    : 6
                }
              >
                <Box>
                  <Typography variant="body1">Số lượng:</Typography>
                </Box>
                <Box className={cx("quantity-wrapper")}>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => handleChangeQuantity(e.target.value)}
                  />
                  <div className={cx("quantity-btn-wrapper")}>
                    <button onClick={() => handleChangeQuantity(quantity + 1)}>
                      <ArrowDropUpRoundedIcon />
                    </button>

                    <button onClick={() => handleChangeQuantity(quantity - 1)}>
                      <ArrowDropDownRoundedIcon />
                    </button>
                  </div>
                </Box>
              </Box>
            </Box>
            {msgQuantity !== "" && (
              <Typography variant="body2">{msgQuantity}</Typography>
            )}
            <Box
              className={cx("btn-group")}
              sx={{
                position: {
                  xs: "fixed",
                  lg: "unset",
                },
              }}
            >
              <Button
                className={`${cx("btn")} ${cx("btn-add-to-cart")}`}
                sx={{
                  marginRight: {
                    xs: "0",
                    lg: "2px",
                  },
                }}
                onClick={handleAddToCart}
              >
                Thêm vào giỏ hàng
              </Button>
              <Button
                className={`${cx("btn")} ${cx("btn-checkout")}`}
                sx={{
                  marginLeft: {
                    xs: "0",
                    lg: "2px",
                  },
                }}
                onClick={handleBuyNow}
              >
                Mua ngay
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box px={5}>
        <Tabs
          value={tab}
          onChange={(e, value) => setTab(value)}
          sx={{
            ".MuiTab-root.Mui-selected": {
              color: "#000 ",
            },
            ".MuiTabs-indicator": {
              bgcolor: "#000",
            },
          }}
        >
          <Tab label="Mô tả" />
          <Tab label="Đánh giá" />
        </Tabs>
        <TabPanel index={0} value={tab}>
          <Box p={1}>
            {product?.images?.map((item, index) => (
              <img
                key={index}
                alt=""
                src={getURL(item.url)}
                width="100%"
                style={{
                  objectFit: "contain",
                  marginTop: index === 0 ? 0 : -4,
                }}
              />
            ))}
          </Box>
        </TabPanel>
        <TabPanel index={1} value={tab}>
          <CommentTabPanel cx={cx} product={product} />
        </TabPanel>
      </Box>
      {/* <Box mb={2}>{product && <Comments product={product} />}</Box> */}
      <Box px={5}>
        {product.groupProduct.products.length === 0 ? (
          <></>
        ) : (
          <div className={cx("same-group")}>
            <span>SẢN PHẨM CÙNG NHÓM</span>
          </div>
        )}
      </Box>

      <Box px={5} my={5}>
        <Grid container spacing={4}>
          {product.groupProduct.products.length > 0 &&
            product.groupProduct.products.map((product, index) => {
              return (
                <Grid key={index} item xs={6} sm={4} md={3}>
                  <Product product={product} />
                </Grid>
              );
            })}
        </Grid>
      </Box>
    </Box>
  );
};

export default ProductDetail;
