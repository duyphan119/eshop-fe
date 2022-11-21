import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { TitleControl } from "../../components/Title";
import config from "../../config";
import { axiosToken } from "../../config/configAxios";
import { API_USER_COUPON_URL } from "../../constants";
import {
  formatThousandDigits,
  getCouponPrice,
  getFinalPrice,
  getURL,
} from "../../utils";
const Result = ({
  onCheckout,
  tempPrice,
  setCoupon,
  deliveryPrice,
  coupon,
}) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("lg"));

  const cart = useSelector((state) => state.cart.cart);

  return (
    <Box
      pt={2}
      className={
        matches
          ? "order-result separate-left"
          : "order-result-tablet separate-left"
      }
    >
      <TitleControl>Thông tin giỏ hàng</TitleControl>

      <Table
        sx={{
          ".MuiTableCell-root": {
            py: 1,
            px: 0,
          },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: 12, fontWeight: 600 }}>
              Sản phẩm
            </TableCell>
            <TableCell
              sx={{ fontSize: 12, fontWeight: 600, textAlign: "center" }}
            >
              SL
            </TableCell>
            <TableCell
              sx={{ fontSize: 12, fontWeight: 600, textAlign: "center" }}
            >
              Giá
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cart?.items.map((item, index) => {
            let newPrice = 0;
            if (item?.detail?.product?.groupProduct?.discounts[0]?.percent) {
              newPrice = getFinalPrice(
                item.detail.product.initPrice,
                item.detail.product.groupProduct.discounts[0]
              );
            }
            return (
              <TableRow key={index}>
                <TableCell sx={{ fontSize: 10, textTransform: "uppercase" }}>
                  <div style={{ display: "flex" }}>
                    <img
                      alt=""
                      src={getURL(item.detail.avatar)}
                      style={{
                        objectFit: "cover",
                        width: 36,
                      }}
                    />
                    <span>
                      {item.detail.product.groupProduct.category.name}
                    </span>
                  </div>
                  <div>{item.detail.sku}</div>
                </TableCell>
                <TableCell sx={{ fontSize: 10, textAlign: "center" }}>
                  {item.quantity}
                </TableCell>
                <TableCell sx={{ fontSize: 10, textAlign: "center" }}>
                  {formatThousandDigits(
                    item.quantity * (newPrice || item.detail.product.initPrice)
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Coupon setCoupon={setCoupon} />
      <div className="order-result-separate"></div>
      <Item
        leftLabel="Tạm tính"
        rightLabel={`${formatThousandDigits(tempPrice)} VND`}
      />
      <Item
        leftLabel="Giảm giá"
        rightLabel={`${coupon ? coupon.percent : 0} %`}
      />
      <Item
        leftLabel="Vận chuyển"
        rightLabel={`${formatThousandDigits(deliveryPrice)} VND`}
      />
      <div className="order-result-separate"></div>
      <Item
        isLast={true}
        leftLabel="Tổng cộng"
        rightLabel={`${formatThousandDigits(
          getCouponPrice(
            tempPrice - deliveryPrice,
            coupon ? 100 - coupon.percent : 100
          )
        )} VND`}
      />
      <Link
        className="order-result-back-to-cart"
        style={{ marginTop: 16 }}
        to={config.routes.cart}
      >
        Tiếp tục mua hàng
      </Link>
      <button className="order-result-checkout" onClick={onCheckout}>
        Tiến hành đặt hàng
      </button>
    </Box>
  );
};

const Coupon = ({ setCoupon }) => {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });

  const token = useSelector((state) => state.auth.token);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  async function handleCheck() {
    try {
      const data = await axiosToken(token?.accessToken, dispatch, navigate).get(
        `${API_USER_COUPON_URL}?code=${code}`
      );
      console.log({ data });
      if (data && data.items.length > 0) {
        setCoupon(data.items[0].coupon);
        setMsg({ type: "", text: "Mã giảm giá hợp lệ" });
      } else {
        setMsg({ type: "error", text: "Mã giảm giá không hợp lệ" });
      }
    } catch (error) {
      console.log({ error });
    }
  }
  return (
    <>
      <label htmlFor="coupon" style={{ fontSize: 12 }}>
        Nhập mã ưu đãi
      </label>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingInline: "2px",
        }}
      >
        <input
          type="text"
          style={{ flex: 1, padding: "4px 2px", outline: "none" }}
          id="coupon"
          placeholder="Nhập vào nếu có"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setMsg({ type: "", text: "" });
          }}
        />
        <button
          style={{
            marginLeft: 8,
            width: 100,
            cursor: "pointer",
          }}
          onClick={handleCheck}
        >
          Áp dụng
        </button>
      </Box>
      {code !== "" && msg.text !== "" && (
        <span
          style={{
            paddingInline: "2px",
            fontSize: 10,
            color: msg.type === "error" ? "var(--error-color)" : "inherit",
          }}
        >
          {msg.text}
        </span>
      )}
    </>
  );
};

const Item = ({ leftLabel, rightLabel, isLast }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: "8px",
        paddingInline: "2px",
        fontSize: 12,
      }}
    >
      <div
        style={{
          flex: "1",
        }}
      >
        {leftLabel}
      </div>
      <div
        style={{
          flex: "1",
          textAlign: "right",
          color: isLast ? "#00aeef" : "#000",
        }}
      >
        {rightLabel}
      </div>
    </Box>
  );
};

export default memo(Result);
