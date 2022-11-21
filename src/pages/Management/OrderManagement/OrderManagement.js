import { Box, IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import {
  API_ORDER_STATUS_URL,
  API_ORDER_URL,
  LIMIT_ROW_ORDER,
  PDF_WIDTH_LANDSCAPE,
} from "../../../constants";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import {
  calHeightDataGrid,
  formatDateTimeVN,
  getNewPrice,
} from "../../../utils";
import { useEffect } from "react";
import { axiosRes, axiosToken } from "../../../config/configAxios";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteOrder,
  getAllOrders,
  getCurrentOrder,
  updateOrder,
} from "../../../redux/orderSlice";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ModalOrderDetail from "../../../components/ModalOrderDetail";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { showToast } from "../../../redux/toastSlice";
import { ModalOrder } from "../../../components/ModalAddUpdate";
import { getAllOrderStatuses } from "../../../redux/orderStatusSlice";
import "../Management.css";
const OrderManagement = () => {
  const columns = [
    {
      field: "actions",
      headerName: "",
      width: 120,
      renderCell: (params) => (
        <>
          <Tooltip title="Xem hoá đơn">
            <IconButton
              color="success"
              size="small"
              onClick={() => handleViewOrderDetail(params.row)}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sửa hoá đơn">
            <IconButton
              color="secondary"
              size="small"
              onClick={() => {
                dispatch(getCurrentOrder(params.row));
                setOpenModal(true);
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xoá hoá đơn">
            <IconButton
              color="error"
              size="small"
              onClick={() => {
                dispatch(getCurrentOrder(params.row));
                setOpenDialog(true);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
    {
      field: "id",
      headerName: "ID",
      width: 80,
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 120,
      valueGetter: (params) => params.row.orderStatus.name,
    },
    {
      field: "tempPrice",
      headerName: "Tiền tạm tính",
    },
    {
      field: "deliveryPrice",
      headerName: "Tiền vận chuyển",
      width: 120,
    },
    {
      field: "coupon.percent",
      headerName: "Giảm giá",
      width: 100,
      valueGetter: (params) => params.row.coupon.percent,
      valueFormatter: (params) => params.value + "%",
    },
    {
      field: "totalPrice",
      headerName: "Tổng cộng",
    },

    {
      field: "fullName",
      headerName: "Họ tên",
      width: 180,
    },
    {
      field: "telephone",
      headerName: "Số điện thoại",
      width: 110,
    },
    {
      field: "address",
      headerName: "Địa chỉ",
      width: 540,
      valueGetter: (params) =>
        `${params.row.address} ${params.row.ward}, ${params.row.district}, ${params.row.city}`,
    },
    {
      field: "description",
      headerName: "Mô tả",
      width: 540,
    },
  ];

  const orders = useSelector((state) => state.order.list);
  const current = useSelector((state) => state.order.current);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [openDetail, setOpenDetail] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const promises = [];
    promises.push(axiosRes().get(`${API_ORDER_URL}`));
    promises.push(axiosRes().get(`${API_ORDER_STATUS_URL}`));
    Promise.allSettled(promises)
      .then((listRes) => {
        if (listRes[0].status === "fulfilled") {
          dispatch(getAllOrders(listRes[0].value.items));
        }
        if (listRes[1].status === "fulfilled") {
          dispatch(getAllOrderStatuses(listRes[1].value.items));
        }
      })
      .catch((err) => {});
  }, [dispatch]);

  async function handleViewOrderDetail(data) {
    const res = await axiosToken(token?.accessToken, dispatch, navigate).get(
      `${API_ORDER_URL}/${data.id}`
    );
    dispatch(getCurrentOrder(res.item));
    setOpenDetail(true);
  }
  function handleExport() {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const ws = XLSX.utils.json_to_sheet(
      orders.map((item) => ({
        "Đơn số": item.id,
        "Khách hàng": item.fullName,
        "Địa chỉ": `${item.address} ${item.ward}, ${item.district}, ${item.city}`,
        "Số điện thoại": item.telephone,
        "Trạng thái": item.orderStatus.name,
        "Giảm giá": getNewPrice(
          item.tempPrice - item.deliveryPrice,
          100 - item.coupon.percent
        ),
        "Ngày tạo": formatDateTimeVN(item.createdAt),
        "Tổng tiền": item.totalPrice,
      }))
    );
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(
      data,
      "Order " + formatDateTimeVN(new Date()) + fileExtension
    );
  }

  async function handleOk(data) {
    try {
      if (current) {
        await axiosToken(token?.accessToken, dispatch, navigate).put(
          `${API_ORDER_URL}/${current.id}`,
          data
        );
        dispatch(updateOrder({ ...current, ...data }));
      }
    } catch (error) {}
  }

  async function handleDelete() {
    try {
      if (current) {
        await axiosToken(token?.accessToken, dispatch, navigate).delete(
          `${API_ORDER_URL}/${current.id}`
        );
        dispatch(
          showToast({
            isOpen: true,
            text: "Xoá thành công",
            type: "success",
          })
        );
        dispatch(deleteOrder(current.id));
      }
    } catch (error) {
      console.log(error);
      dispatch(
        showToast({
          isOpen: true,
          text: "Xoá thất bại",
          type: "error",
        })
      );
    }
  }
  return (
    <>
      <Box bgcolor="#fff" p={1}>
        <button
          className="management-btn management-btn-add"
          onClick={() => {
            handleExport();
            // dispatch(getCurrentGroupProduct(null));
            // setOpenModal(true);
          }}
        >
          <DownloadIcon />
          Xuất file Excel
        </button>
        <Box height={calHeightDataGrid(LIMIT_ROW_ORDER)}>
          <DataGrid
            columns={columns}
            rows={orders}
            pageSize={LIMIT_ROW_ORDER}
            rowsPerPageOptions={[
              LIMIT_ROW_ORDER,
              LIMIT_ROW_ORDER * 5,
              LIMIT_ROW_ORDER * 10,
              LIMIT_ROW_ORDER * 20,
              LIMIT_ROW_ORDER * 50,
            ]}
          />
        </Box>
      </Box>
      {openDetail && (
        <ModalOrderDetail
          open={openDetail}
          width={PDF_WIDTH_LANDSCAPE}
          height="90vh"
          handleClose={() => setOpenDetail(false)}
          title={`Chi tiết đơn hàng ${current.id}`}
          labelOk="Xuất PDF"
          isCloseAfterOk={true}
        />
      )}
      {openModal && (
        <ModalOrder
          open={openModal}
          height="90vh"
          handleClose={() => setOpenModal(false)}
          title="Sửa đơn hàng"
          labelOk="Sửa"
          isCloseAfterOk={true}
          handleOk={handleOk}
        />
      )}
      {openDialog && (
        <ConfirmDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          title="Xác nhận"
          text="Bạn có chắc chắn muốn xoá đơn hàng này ?"
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default OrderManagement;
