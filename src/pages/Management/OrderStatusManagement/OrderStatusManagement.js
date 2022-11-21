import {
  Box,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { API_ORDER_STATUS_URL } from "../../../constants";
import { useEffect, useState } from "react";
import { axiosToken } from "../../../config/configAxios";
import { useDispatch, useSelector } from "react-redux";
import { ModalOrderStatus } from "../../../components/ModalAddUpdate";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../../../components/ConfirmDialog";
import {
  addOrderStatus,
  deleteOrderStatus,
  getAllOrderStatuses,
  getCurrentOrderStatus,
  updateOrderStatus,
} from "../../../redux/orderStatusSlice";
import "../Management.css";
const OrderStatusManagement = () => {
  const orderStatuses = useSelector((state) => state.orderStatus.all);
  const token = useSelector((state) => state.auth.token);
  const current = useSelector((state) => state.orderStatus.current);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const promises = [];
    promises.push(
      axiosToken(token?.accessToken, dispatch, navigate).get(
        `${API_ORDER_STATUS_URL}`
      )
    );
    Promise.allSettled(promises)
      .then((listRes) => {
        if (listRes[0].status === "fulfilled") {
          dispatch(getAllOrderStatuses(listRes[0].value.items));
        }
      })
      .catch((err) => {});
  }, [dispatch, navigate, token]);

  async function handleOk(data) {
    try {
      if (current) {
        await axiosToken(token?.accessToken, dispatch, navigate).put(
          `${API_ORDER_STATUS_URL}/${current.id}`,
          data
        );
        dispatch(updateOrderStatus({ ...current, ...data }));
      } else {
        const res = await axiosToken(
          token?.accessToken,
          dispatch,
          navigate
        ).post(`${API_ORDER_STATUS_URL}`, data);
        dispatch(addOrderStatus(res.item));
      }
    } catch (error) {}
  }

  async function handleDelete() {
    try {
      await axiosToken(token?.accessToken, dispatch, navigate).delete(
        `${API_ORDER_STATUS_URL}/${current.id}`
      );
      dispatch(deleteOrderStatus(current.id));
    } catch (error) {}
  }

  return (
    <>
      <Box bgcolor="#fff" p={1}>
        <button
          className="management-btn management-btn-add"
          onClick={() => {
            dispatch(getCurrentOrderStatus(null));
            setOpenModal(true);
          }}
        >
          <AddIcon />
          Thêm trạng thái đơn hàng
        </button>
        <Box>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Trạng thái</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Kiểu</TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  Cho phép huỷ đơn hàng
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderStatuses.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Chip label={item.name} color={item.type} />
                  </TableCell>
                  <TableCell
                    sx={{ textAlign: "center", textTransform: "capitalize" }}
                  >
                    {item.type}
                  </TableCell>{" "}
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.userIsAllowedDelete ? (
                      <CheckBoxIcon color="success" />
                    ) : (
                      <RemoveCircleIcon color="error" />
                    )}
                  </TableCell>
                  <TableCell sx={{ textAlign: "right" }}>
                    <Tooltip title="Sửa trạng thái đơn hàng">
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={() => {
                          dispatch(getCurrentOrderStatus(item));
                          setOpenModal(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xoá trạng thái đơn hàng">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          dispatch(getCurrentOrderStatus(item));
                          setOpenDialog(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
      {openModal && (
        <ModalOrderStatus
          open={openModal}
          handleClose={() => setOpenModal(false)}
          handleOk={handleOk}
          title={
            current ? "Sửa trạng thái đơn hàng" : "Thêm trạng thái đơn hàng"
          }
          labelOk={current ? "Sửa" : "Thêm"}
        />
      )}

      {openDialog && (
        <ConfirmDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          title="Xác nhận"
          text="Bạn có chắc chắn xoá trạng thái đơn hàng này?"
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default OrderStatusManagement;
