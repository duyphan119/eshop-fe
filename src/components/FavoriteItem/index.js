import { Box, Button } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { configAxiosAll } from "../../config/configAxios";
import { API_PRODUCT_USER_URL, API_CART_ITEM_URL } from "../../constants";
import { showToast } from "../../redux/toastSlice";
import { removeWishlistItem } from "../../redux/wishlistSlice";
import { addToCart } from "../../redux/cartSlice";
import { formatThousandDigits, getURL } from "../../utils";

const FavoriteItem = ({ item }) => {
  const user = useSelector((state) => state.auth.currentUser);

  const dispatch = useDispatch();

  const [indexColor, setIndexColor] = useState(0);
  const [indexSize, setIndexSize] = useState(
    item?.colors[0].sizes?.findIndex((el) => el.amount > 0)
  );

  async function handleDelete() {
    configAxiosAll(user, dispatch)
      .delete(`${API_PRODUCT_USER_URL}/${item.product_users[0].id}`)
      .then(() => {
        dispatch(removeWishlistItem(item.id));
        dispatch(
          showToast({
            isOpen: true,
            text: "Đã xoá khỏi danh sách yêu thích",
            type: "success",
          })
        );
      })
      .catch((err) => () => {});
  }

  async function handleAddToCart() {
    if (1 > item.colors[indexColor].sizes[indexSize].amount) {
      dispatch(
        showToast({
          text: "Số lượng không hợp lệ",
          type: "info",
          isOpen: true,
        })
      );
    } else {
      configAxiosAll(user, dispatch)
        .post(`${API_CART_ITEM_URL}`, {
          cart_id: user.cart.id,
          product_detail_id: item.colors[indexColor].sizes[indexSize].detail_id,
          quantity: 1,
        })
        .then((data) => {
          dispatch(addToCart(data));
          dispatch(
            showToast({
              isOpen: true,
              text: "Thêm vào giỏ hàng thành công",
              type: "success",
            })
          );
        })
        .catch((err) => {
          if (err?.response?.data?.message === "stuck") {
            dispatch(
              showToast({
                text: "Sản phẩm đã hết",
                type: "info",
                isOpen: true,
              })
            );
          }
        });
    }
  }

  if (!item || !item.colors || item.colors.length === 0) return "";

  return (
    <Box display="flex" justifyContent="space-between" width="100%" p={1}>
      <Box display="flex">
        <Link to={`/${item.slug}`} className="" style={{ marginRight: "8px" }}>
          <img
            src={
              item.colors[indexColor].images &&
              item.colors[indexColor].images.length > 0 &&
              getURL(item.colors[indexColor].images[0].url)
            }
            alt=""
            style={{ width: "100px", height: "130px", objectFit: "cover" }}
          />
        </Link>
        <Box className="">
          <Link
            to={`/${item.slug}`}
            className="hover-color-main-color three-dot three-dot-1"
          >
            {item.name}
          </Link>
          <Box
            className=""
            mt={1}
            style={{ color: "var(--main-color)", fontSize: "14px" }}
          >
            {formatThousandDigits(item.price)} ₫
          </Box>
          <Box className="" display="flex" mt={1}>
            {item.colors.map((color, index) => (
              <div
                alt=""
                style={{
                  width: "30px",
                  height: "30px",
                  border: `1px solid ${
                    index === indexColor ? "var(--main-color)" : "transparent"
                  }`,
                  borderRadius: "50%",
                  cursor: "pointer",
                  backgroundImage: `url('${getURL(color.images[0].url)}')`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundClip: "content-box",
                  padding: "1px",
                  marginRight: "4px",
                }}
                key={index}
                onClick={() => {
                  setIndexSize(
                    item?.colors[index].sizes?.findIndex((el) => el.amount > 0)
                  );
                  setIndexColor(index);
                }}
              ></div>
            ))}
          </Box>
          <Box className="" display="flex" mt={1}>
            {item.colors[indexColor].sizes.map((size, index) => (
              <div
                alt=""
                style={{
                  width: "24px",
                  height: "24px",
                  border: `1px solid ${
                    index === indexSize ? "var(--main-color)" : "#000"
                  }`,
                  backgroundColor:
                    index === indexSize ? "var(--main-color)" : "transparent",
                  borderRadius: "2px",
                  cursor: "pointer",
                  marginRight: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  fontWeight: "bold",
                }}
                className={`${size.amount === 0 ? "size-stuck" : ""}`}
                key={index}
                onClick={() => {
                  if (size.amount > 0) {
                    setIndexSize(index);
                  }
                }}
              >
                {size.value}
              </div>
            ))}
          </Box>
        </Box>
      </Box>
      <Box className="">
        <Button
          variant="outlined"
          size="small"
          style={{ marginRight: "4px" }}
          onClick={handleDelete}
        >
          Xoá
        </Button>
        <Button variant="contained" size="small" onClick={handleAddToCart}>
          Thêm vào giỏ hàng
        </Button>
      </Box>
    </Box>
  );
};

export default FavoriteItem;
