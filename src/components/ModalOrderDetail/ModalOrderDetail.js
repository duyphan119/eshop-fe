import React from "react";
import PropTypes from "prop-types";
import { MyModal } from "../Modal";
import { useSelector } from "react-redux";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  exportComponentToPDF,
  formatDateTimeVN,
  getNewPrice,
} from "../../utils";
import Logo from "../Logo";

const ModalOrderDetail = (props) => {
  const current = useSelector((state) => state.order.current);
  return (
    <MyModal {...props} handleOk={() => exportComponentToPDF("order-preview")}>
      <Box id="order-preview" px={2} py={1} fontSize={12}>
        <Box height={70} textAlign="center">
          <Logo
            style={{
              color: "#000",
              fontSize: 52,
              display: "inline",
            }}
            sx={{ height: 64, ml: 1 }}
            noLink={true}
          />
        </Box>
        <Box textAlign="center" fontSize={24} textTransform="uppercase">
          Đơn số {current.id}
        </Box>
        <Box textAlign="center">{formatDateTimeVN(current.createdAt)}</Box>
        <Box>
          <table>
            <tbody>
              <tr>
                <td>Họ và tên</td>
                <td>: {current?.fullName}</td>
              </tr>
              <tr>
                <td>Địa chỉ</td>
                <td>
                  : {current?.address} {current?.ward}, {current?.district},{" "}
                  {current?.city}
                </td>
              </tr>
              <tr>
                <td>Số điện thoại</td>
                <td>: {current?.telephone}</td>
              </tr>
            </tbody>
          </table>
        </Box>
        <Box>
          <Table
            sx={{
              ".MuiTableCell-root": {
                fontSize: 12,
                p: 1,
                textAlign: "center",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Sản phẩm</TableCell>
                <TableCell>Chi tiết</TableCell>
                <TableCell>SL</TableCell>
                <TableCell>Đơn giá</TableCell>
                <TableCell>Thành tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {current.items.map((item, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.detail.product.name}</TableCell>
                    <TableCell>
                      {item.detail.color.value} / {item.detail.size.value}
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.detail.product.initPrice}</TableCell>
                    <TableCell>
                      {item.detail.product.initPrice * item.quantity}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
        <Box display="flex" justifyContent="end" m={1}>
          <table>
            <tbody>
              <tr>
                <td>Tạm tính</td>
                <td>:</td>
                <td style={{ textAlign: "right" }}>{current?.tempPrice}</td>
              </tr>
              <tr>
                <td>Vận chuyển</td>
                <td>:</td>
                <td style={{ textAlign: "right" }}>{current?.deliveryPrice}</td>
              </tr>
              <tr>
                <td>Giảm giá</td>
                <td>:</td>
                <td style={{ textAlign: "right" }}>
                  {getNewPrice(
                    current?.tempPrice - current?.deliveryPrice,
                    100 - current?.coupon?.percent
                  )}
                </td>
              </tr>
              <tr>
                <td>Tổng tiền</td>
                <td>:</td>
                <td style={{ textAlign: "right" }}>{current?.totalPrice}</td>
              </tr>
            </tbody>
          </table>
        </Box>
      </Box>
    </MyModal>
  );
};

ModalOrderDetail.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleOk: PropTypes.func,
  title: PropTypes.string,
  isCloseAfterOk: PropTypes.bool,
  children: PropTypes.node,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ModalOrderDetail;
