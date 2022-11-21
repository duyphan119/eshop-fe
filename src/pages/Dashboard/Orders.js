import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import * as React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { TitlePaper } from "../../components/Title";
import config from "../../config";
import { formatDateTimeVN } from "../../utils";
export default function Orders() {
  const orders = useSelector((state) => state.order.recentOrders);

  return (
    <React.Fragment>
      <TitlePaper>Đơn hàng gần đây</TitlePaper>
      <Box>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell>Họ tên</TableCell>
              <TableCell>Điện thoại</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>Tổng cộng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.orderStatus.name}</TableCell>
                <TableCell>{formatDateTimeVN(item.createdAt)}</TableCell>
                <TableCell>{item.fullName}</TableCell>
                <TableCell>{item.telephone}</TableCell>
                <TableCell>
                  {item.address} {item.ward}, {item.district}, {item.city}
                </TableCell>
                <TableCell>{item.totalPrice}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Link
        to={config.routes.orderManagement}
        style={{
          marginTop: "24px",
          color: "var(--main-color)",
          textDecoration: "underline",
          fontSize: "14px",
        }}
      >
        Xem tất cả đơn hàng
      </Link>
    </React.Fragment>
  );
}
