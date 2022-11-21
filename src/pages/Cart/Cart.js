import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import CartItem from "./CartItem";
import CartResult from "./CartResult";
import "./Cart.css";
import config from "../../config";
import { Navigate } from "react-router-dom";
const Cart = () => {
  const cart = useSelector((state) => state.cart.cart);
  const currentUser = useSelector((state) => state.auth.currentUser);

  useEffect(() => {
    document.title = "Giỏ hàng";
  }, []);

  if (!currentUser) return <Navigate to={config.routes.login} />;

  return (
    <Box px={3}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ textAlign: "center" }} colSpan={2}>
              SẢN PHẨM
            </TableCell>
            <TableCell sx={{ textAlign: "center" }}>GIÁ</TableCell>
            <TableCell sx={{ textAlign: "center" }}>SỐ LƯỢNG</TableCell>
            <TableCell sx={{ textAlign: "center" }}>TỔNG</TableCell>
            <TableCell sx={{ textAlign: "center", width: 50 }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cart.items.map((item) => {
            return <CartItem key={item.id} item={item} />;
          })}
        </TableBody>
      </Table>
      <CartResult />
    </Box>
  );
};

export default Cart;
