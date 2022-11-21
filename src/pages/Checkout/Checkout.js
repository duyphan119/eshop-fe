import { Box, Grid } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import { axiosToken } from "../../config/configAxios";
import {
  API_ORDER_URL,
  API_USER_URL,
  LOCALSTORAGE_DESCRIPTION_CART,
} from "../../constants";
import { setCurrentUser } from "../../redux/authSlice";
// import { SocketContext } from "../../context";
import { getCart } from "../../redux/cartSlice";
import { showToast } from "../../redux/toastSlice";
import {
  decodeToken,
  getCouponPrice,
  getTotalPrice,
  validateTelephone,
} from "../../utils";
import "./Checkout.css";
import Form from "./Form";
import Result from "./Result";

const Checkout = () => {
  // const socket = useContext(SocketContext);

  const token = useSelector((state) => state.auth.token);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const cart = useSelector((state) => state.cart.cart);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [order, setOrder] = useState({
    address: "",
    city: "",
    ward: "",
    district: "",
    telephone: "",
    fullName: "",
    description: JSON.parse(
      localStorage.getItem(LOCALSTORAGE_DESCRIPTION_CART)
    ),
  });
  const [tempPrice, setTempPrice] = useState(0);
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [coupon, setCoupon] = useState();

  useEffect(() => {
    document.title = "Thanh toán";
  }, []);

  useEffect(() => {
    setTempPrice(getTotalPrice(cart));
  }, [cart]);

  useEffect(() => {
    (async function () {
      try {
        if (token) {
          const user = decodeToken(token?.accessToken);
          if (user && user.id) {
            const res = await axiosToken(
              token?.accessToken,
              dispatch,
              navigate
            ).get(`${API_USER_URL}/${user.id}`);
            dispatch(setCurrentUser(res.item));
            setOrder((prev) => ({ ...prev, ...res.item }));
          }
        }
      } catch (error) {}
    })();
  }, [dispatch, token, navigate]);

  const handleCheckout = useCallback(async () => {
    try {
      const {
        address,
        ward,
        city,
        district,
        telephone,
        fullName,
        description,
      } = order;
      if (
        address !== "" &&
        ward !== "" &&
        city !== "" &&
        telephone !== "" &&
        fullName !== "" &&
        validateTelephone(order.telephone)
      ) {
        const data = await axiosToken(token?.accessToken, dispatch).post(
          `${API_ORDER_URL}`,
          {
            userId: currentUser.id,
            cart,
            address,
            ward,
            city,
            district: district,
            deliveryPrice: deliveryPrice,
            tempPrice: tempPrice,
            totalPrice: getCouponPrice(
              tempPrice - deliveryPrice,
              coupon ? 100 - coupon.percent : 100
            ),
            telephone,
            fullName,
            couponId: coupon && coupon.id ? coupon.id : 1,
            description,
          }
        );
        if (data) {
          dispatch(getCart({ items: [], count: 0 }));
          navigate(config.routes.checkoutSuccess);
        }
      } else {
        dispatch(
          showToast({
            type: "error",
            text: "Thông tin đơn hàng chưa hợp lệ",
            isOpen: true,
          })
        );
      }
    } catch (error) {
      console.log(error);
      dispatch(
        showToast({
          type: "error",
          text: "Thông tin đơn hàng chưa hợp lệ",
          isOpen: true,
        })
      );
    }
  }, [
    order,
    currentUser,
    cart,
    deliveryPrice,
    tempPrice,
    coupon,
    token?.accessToken,
    dispatch,
    navigate,
  ]);

  return (
    <Box px={6} py={3}>
      <Box sx={{ borderBottom: "1px solid #000", pb: 3, fontSize: 20 }}>
        Thanh toán giỏ hàng
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <Form
            order={order}
            setOrder={setOrder}
            setDeliveryPrice={setDeliveryPrice}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <Result
            onCheckout={handleCheckout}
            tempPrice={tempPrice}
            setCoupon={setCoupon}
            coupon={coupon}
            deliveryPrice={deliveryPrice}
            setDeliveryPrice={setDeliveryPrice}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Checkout;
