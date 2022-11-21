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

export default function BestSellers(props) {
  const items = useSelector((state) => state.productDetail.bestSellerList);
  return (
    <Box>
      <TitlePaper>Sản phẩm bán chạy nhất</TitlePaper>
      <Box mb={2}>
        <Table
          size="small"
          sx={{
            ".MuiTableCell-root": {
              textAlign: "center",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell sx={{ textAlign: "left !important" }}>
                Sản phẩm
              </TableCell>
              <TableCell>Màu sắc</TableCell>
              <TableCell>Kích cỡ</TableCell>
              <TableCell>Số lượng bán</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell sx={{ textAlign: "left !important" }}>
                  {item.detail.product.name}
                </TableCell>
                <TableCell>{item.detail.color.value}</TableCell>
                <TableCell>
                  {item.detail.size.shortValue !== "" && item.detail.size.value}
                </TableCell>
                <TableCell>{item.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Link
        to={config.routes.productManagement}
        style={{
          color: "var(--main-color)",
          textDecoration: "underline",
          fontSize: "14px",
        }}
      >
        Xem tất cả sản phẩm
      </Link>
    </Box>
  );
}
