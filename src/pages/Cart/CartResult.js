import { Box, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formatThousandDigits, getTotalPrice } from "../../utils";
import config from "../../config";
import { useRef } from "react";
import { LOCALSTORAGE_DESCRIPTION_CART } from "../../constants";
const CartResult = () => {
  const cart = useSelector((state) => state.cart.cart);

  const navigate = useNavigate();

  const textareaRef = useRef();

  const handleCheckOut = () => {
    if (cart.items.length > 0) {
      localStorage.setItem(
        LOCALSTORAGE_DESCRIPTION_CART,
        JSON.stringify(textareaRef.current?.value || "")
      );
      navigate(config.routes.checkout);
    }
  };
  return (
    <Box display="flex" mt={4}>
      <Box flex={1}>
        <div style={{ marginBottom: 16 }}>GHI CHÚ</div>
        <textarea
          style={{
            width: "100%",
            fontSize: 16,
            padding: 8,
            outlineColor: "var(--main-color)",
          }}
          rows={5}
          ref={textareaRef}
        ></textarea>
      </Box>
      <Box flex={1} textAlign="right">
        <div style={{ marginBottom: 16 }}>TỔNG TIỀN</div>
        <div style={{ fontSize: 26 }}>
          {formatThousandDigits(getTotalPrice(cart))} ₫
        </div>
        <div style={{ fontSize: 14 }}>
          Vận chuyển và thuế tính lúc thanh toán
        </div>
        <div style={{ height: 40, marginTop: 14 }}>
          <Button
            sx={{
              py: 1,
              px: 2,
              color: "var(--main-color)",
              bgcolor: "#fff",
              borderRadius: 0,
              border: "1px solid var(--main-color)",
              "&:hover": {
                bgcolor: "var(--main-color)",
                color: "#fff",
              },
              mr: 1,
            }}
          >
            TIẾP TỤC MUA HÀNG
          </Button>
          <Button
            sx={{
              py: 1,
              px: 2,
              bgcolor: "var(--main-color)",
              color: "#fff",
              border: "1px solid var(--main-color)",
              borderRadius: 0,
              opacity: 0.9,
              "&:hover": {
                bgcolor: "var(--main-color)",
                color: "#fff",
                opacity: 1,
              },
            }}
            onClick={handleCheckOut}
          >
            THANH TOÁN
          </Button>
        </div>
      </Box>
    </Box>
  );
};

export default CartResult;
