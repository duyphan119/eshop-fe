import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import * as FileSaver from "file-saver";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import ConfirmDialog from "../../components/ConfirmDialog";
import ModalDownloadOrder from "../../components/ModalDownloadOrder";
import ModalEditOrder from "../../components/ModalEditOrder";
import Pagination from "../../components/Pagination";
import { configAxiosAll, axiosRes } from "../../config/configAxios";
import {
  API_ORDER_STATUS_URL,
  API_ORDER_URL,
  LIMIT_ROW_ORDER,
} from "../../constants";
import {
  changeLimit,
  changePage,
  deletedOrder,
  getCurrentOrder,
  getOrder,
  updateOrder,
} from "../../redux/orderSlice";
import { getAllOrderStatuses } from "../../redux/orderStatusSlice";
import {
  calHeightDataGrid,
  formatDateTimeVN,
  formatThousandDigits,
} from "../../utils";

const OrderTabPanel = () => {
  const columns = [
    {
      field: "id",
      headerName: "Đơn số",
      width: 110,
      sortable: true,
      filter: true,
      pinned: "left",
    },
    {
      field: "user.full_name",
      headerName: "Khách hàng",
      width: 200,
      sortable: true,
      filter: true,
    },
    {
      field: "createdAt",
      headerName: "Thời gian",
      width: 170,
      sortable: true,
      filter: true,
      valueFormatter: (params) => formatDateTimeVN(params.data.createdAt),
    },
    {
      field: "address",
      headerName: "Địa chỉ",
      width: 560,
      sortable: true,
      filter: true,
    },
    {
      field: "telephone",
      headerName: "Số điện thoại",
      width: 140,
      sortable: true,
      filter: true,
    },
    {
      field: "coupon.percent",
      headerName: "Giảm giá",
      width: 110,
      sortable: true,
      filter: true,
    },
    {
      field: "total",
      headerName: "Tổng tiền",
      width: 120,
      sortable: true,
      filter: true,
      valueFormatter: (params) => formatThousandDigits(params.data.total),
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 130,
      pinned: "right",
      sortable: true,
      filter: true,
      valueGetter: (params) => params.data.status.description,
    },
    {
      field: "actions",
      headerName: "",
      pinned: "right",
      width: 160,
      cellRenderer: (params) => (
        <>
          <Tooltip title="Xuất hoá đơn">
            <IconButton
              color="success"
              onClick={() => {
                dispatch(getCurrentOrder(params.data));
                setOpenDownload(true);
              }}
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sửa hoá đơn">
            <IconButton
              color="secondary"
              onClick={() => {
                dispatch(getCurrentOrder(params.data));
                setOpen(true);
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xoá hoá đơn">
            <IconButton
              color="error"
              onClick={() => {
                dispatch(getCurrentOrder(params.data));
                setOpenDialog(true);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];
  const gridRef = useRef();

  const user = useSelector((state) => state.auth.currentUser);
  const order = useSelector((state) => state.order.order);
  const page = useSelector((state) => state.order.page);
  const limit = useSelector((state) => state.order.limit);
  const currentOrder = useSelector((state) => state.order.current);
  const orderStatuses = useSelector((state) => state.orderStatus.all);

  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [openDownload, setOpenDownload] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    axiosRes()
      .get(`${API_ORDER_STATUS_URL}`)
      .then((res) => dispatch(getAllOrderStatuses(res)))
      .catch((err) => {});
  }, [dispatch]);

  useEffect(() => {
    configAxiosAll(user, dispatch)
      .get(`${API_ORDER_URL}?limit=${limit}&p=${page}`)
      .then((res) => dispatch(getOrder(res)))
      .catch((err) => {});
  }, [user, dispatch, page, limit]);

  function handleExport() {
    if (
      gridRef &&
      gridRef.current &&
      gridRef.current.api.getRenderedNodes().length > 0
    ) {
      const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const fileExtension = ".xlsx";
      const ws = XLSX.utils.json_to_sheet(
        gridRef.current.api.getRenderedNodes().map((item) => ({
          "Đơn số": item.data.id,
          "Khách hàng": item.data.user.full_name,
          "Địa chỉ": item.data.address,
          "Số điện thoại": item.data.telephone,
          "Trạng thái": item.data.status.description,
          "Giảm giá": item.data.coupon.percent + "%",
          "Ngày tạo": formatDateTimeVN(item.data.createdAt),
          "Tổng tiền": item.data.total,
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
  }

  function handleOk(data) {
    const { total, indexStatus } = data;
    configAxiosAll(user, dispatch)
      .put(`${API_ORDER_URL}`, {
        ...currentOrder,
        total,
        order_status_id: orderStatuses[indexStatus].id,
      })
      .then((res) => {
        dispatch(updateOrder(res));
      })
      .catch((err) => {});
  }

  async function onConfirm() {
    try {
      await configAxiosAll(user, dispatch).delete(
        `${API_ORDER_URL}/${currentOrder.id}`
      );
      dispatch(deletedOrder(currentOrder.id));
    } catch (error) {}
  }

  return (
    <Box p={1} bgcolor="#fff">
      <Button variant="contained" onClick={handleExport} sx={{ mb: 1 }}>
        Xuất file Excel
      </Button>
      <div
        style={{
          width: "100%",
          overflow: "hidden",
          height: calHeightDataGrid(LIMIT_ROW_ORDER) + 17,
        }}
      >
        <div
          className="ag-theme-alpine"
          style={{ width: "100%", height: "100%" }}
        >
          <AgGridReact
            rowData={order && order.items ? order.items : []}
            columnDefs={columns}
            ref={gridRef}
          ></AgGridReact>
        </div>
      </div>
      {currentOrder && open && (
        <ModalEditOrder
          open={open}
          handleClose={() => setOpen(false)}
          labelOk="Sửa"
          title={`Sửa hoá đơn ${currentOrder.id}`}
          isCloseAfterOk={true}
          order={currentOrder}
          width={600}
          orderStatuses={orderStatuses}
          handleOk={handleOk}
        />
      )}
      {currentOrder && openDownload && (
        <ModalDownloadOrder
          open={openDownload}
          handleClose={() => setOpenDownload(false)}
          labelOk="Xuất PDF"
          title={`Xuất hoá đơn ${currentOrder.id}`}
          // isCloseAfterOk={true}
          order={currentOrder}
          width={896}
          height="90vh"
          orderStatuses={orderStatuses}
          handleOk={handleOk}
        />
      )}
      {order && order.total_page && (
        <Box sx={{ display: "flex", justifyContent: "end", mt: 1 }}>
          <Pagination
            showRowsPerPage={true}
            listRowPerPage={[LIMIT_ROW_ORDER, 50, 100, 200, 500]}
            rowsPerPage={limit}
            onChangeRowsPerPage={(value) => dispatch(changeLimit(value))}
            onChange={(e, value) => {
              dispatch(changePage(value));
            }}
            page={page}
            totalPage={order.total_page}
          />
        </Box>
      )}
      {openDialog && (
        <ConfirmDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onConfirm={onConfirm}
          text={`Bạn có chắc chắn muốn xoá hoá đơn này ?`}
        />
      )}
    </Box>
  );
};

export default OrderTabPanel;
