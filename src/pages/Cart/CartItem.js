import { IconButton, TableCell, TableRow } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { axiosToken } from "../../config/configAxios";
import { API_CART_ITEM_URL } from "../../constants";
import { removeCartItem, updateCart } from "../../redux/cartSlice";
import { formatThousandDigits, getFinalPrice, getURL } from "../../utils";

const CartItem = ({ item }) => {
  const token = useSelector((state) => state.auth.token);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const newPrice = useMemo(() => {
    if (item?.detail?.product?.groupProduct?.discounts[0]?.percent)
      return getFinalPrice(
        item.detail.product.initPrice,
        item.detail.product.groupProduct.discounts[0]
      );
    return 0;
  }, [item]);

  async function handleUpdateCart(value) {
    try {
      let newQuantity = parseInt(value);
      if (!isNaN(newQuantity)) {
        if (newQuantity >= 0 && newQuantity <= item.detail.amount) {
          await axiosToken(token?.accessToken, dispatch, navigate).put(
            `${API_CART_ITEM_URL}/${item.id}`,
            {
              detailId: item.detail.id,
              quantity: newQuantity,
            }
          );
          if (newQuantity === 0) {
            dispatch(removeCartItem(item));
          } else {
            dispatch(
              updateCart({
                ...item,
                detailId: item.detail.id,
                quantity: newQuantity,
              })
            );
          }
        }
      }
    } catch (error) {}
  }

  async function handleDeleteItem() {
    try {
      await axiosToken(token?.accessToken, dispatch, navigate).delete(
        `${API_CART_ITEM_URL}/${item.id}`
      );
      dispatch(removeCartItem(item));
    } catch (error) {}
  }

  if (!item) return "";
  return (
    <TableRow>
      <TableCell sx={{ textAlign: "center", width: 80 }}>
        <Link to="/">
          <img
            alt=""
            src={getURL(item.detail.avatar)}
            style={{ objectFit: "cover", width: 72, height: 80 }}
          />
        </Link>
      </TableCell>
      <TableCell>
        <Link
          to="/"
          className="hover-color-main-color"
          style={{ textTransform: "uppercase" }}
        >
          {`${item.detail.product.groupProduct.category.name} ${item.detail.sku}`}
        </Link>
      </TableCell>
      <TableCell sx={{ textAlign: "center" }}>
        {formatThousandDigits(newPrice || item.detail.product.initPrice)} ₫
      </TableCell>
      <TableCell sx={{ textAlign: "center" }}>
        <IconButton
          sx={{ "&:hover": { bgcolor: "inherit" } }}
          onClick={() => handleUpdateCart(item.quantity - 1)}
        >
          <RemoveIcon />
        </IconButton>
        <input
          type="text"
          value={item.quantity}
          onChange={(e) => handleUpdateCart(e.target.value)}
          style={{
            width: 32,
            height: 32,
            textAlign: "center",
            outlineColor: "var(--main-color)",
            border: "2px solid gray",
            borderRadius: "2px",
          }}
        />
        <IconButton
          sx={{ "&:hover": { bgcolor: "inherit" } }}
          onClick={() => handleUpdateCart(item.quantity + 1)}
        >
          <AddIcon />
        </IconButton>
      </TableCell>
      <TableCell sx={{ textAlign: "center" }}>
        {formatThousandDigits(
          (newPrice || item.detail.product.initPrice) * item.quantity
        )}{" "}
        ₫
      </TableCell>
      <TableCell sx={{ textAlign: "center" }}>
        <IconButton
          sx={{ "&:hover": { bgcolor: "inherit", color: "red" } }}
          onClick={handleDeleteItem}
        >
          <ClearIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default CartItem;
