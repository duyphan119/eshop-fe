import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConfirmDialog from "../../components/ConfirmDialog";
import ModalCoupon from "../../components/ModalCoupon";
import Pagination from "../../components/Pagination";
import { configAxiosAll } from "../../config/configAxios";
import { API_COUPON_URL, LIMIT_ROW_COUPON } from "../../constants";
import {
  addCoupon,
  getCoupon,
  getCurrentCoupon,
  updateCoupon,
} from "../../redux/couponSlice";
import { calHeightDataGrid, formatDateVN } from "../../utils";

const CouponTabPanel = () => {
  const columns = [
    {
      field: "id",
      headerName: "Mã số",
      flex: 2,
      sortable: true,
      filter: true,
    },
    {
      field: "name",
      headerName: "Tên",
      flex: 10,
      sortable: true,
      filter: true,
    },
    {
      field: "percent",
      headerName: "Phần trăm",
      flex: 3,
      sortable: true,
      filter: true,
    },
    {
      field: "code",
      headerName: "Mã giảm giá",
      flex: 3,
      sortable: true,
      filter: true,
    },
    {
      field: "createdAt",
      headerName: "Bắt đầu",
      flex: 3,
      sortable: true,
      filter: true,
      valueFormatter: (params) =>
        params.data.start ? formatDateVN(params.data.start) : "",
    },
    {
      field: "finish",
      headerName: "Kết thúc",
      flex: 3,
      sortable: true,
      filter: true,
      valueFormatter: (params) =>
        params.data.finish ? formatDateVN(params.data.finish) : "",
    },
    {
      field: "actions",
      headerName: "",
      pinned: "right",
      width: 160,
      cellRenderer: (params) => (
        <>
          <Tooltip title="Sửa giảm giá">
            <IconButton
              color="secondary"
              onClick={() => {
                dispatch(getCurrentCoupon(params.data));
                setOpen(true);
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xoá giảm giá">
            <IconButton
              color="error"
              onClick={() => {
                dispatch(getCurrentCoupon(params.data));
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

  const user = useSelector((state) => state.auth.currentUser);
  const coupon = useSelector((state) => state.coupon.coupon);
  const current = useSelector((state) => state.coupon.current);

  console.log(coupon);

  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [limit, setLimit] = useState(LIMIT_ROW_COUPON);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    configAxiosAll(user, dispatch)
      .get(`${API_COUPON_URL}?limit=${limit}&p=${page}`)
      .then((res) => dispatch(getCoupon(res)))
      .catch((err) => {});
  }, [user, dispatch, page, limit]);

  async function onConfirm() {
    try {
      await configAxiosAll(user, dispatch).delete(
        `${API_COUPON_URL}/${current.id}`
      );
      const res = await configAxiosAll(user, dispatch).get(
        `${API_COUPON_URL}?limit=${limit}&p=${page}`
      );
      dispatch(getCoupon(res));
    } catch (error) {}
  }

  async function handleOk(data) {
    const { finish, start, percent, name, code, description } = data;
    let res;
    if (current) {
      res = await configAxiosAll(user, dispatch).put(`${API_COUPON_URL}`, {
        ...current,
        finish,
        start,
        percent,
        name,
        code,
        description,
      });
      dispatch(
        updateCoupon({ ...current, finish, start, percent, name, code })
      );
    } else {
      console.log({
        finish,
        start,
        percent,
        name,
        code,
      });
      res = await configAxiosAll(user, dispatch).post(`${API_COUPON_URL}`, {
        finish,
        start,
        percent,
        name,
        code,
      });
      dispatch(addCoupon(res));
    }
  }

  return (
    <Box p={1} bgcolor="#fff">
      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => {
          setOpen(true);
        }}
        startIcon={<AddIcon />}
      >
        Thêm giảm giá
      </Button>
      <div
        style={{
          width: "100%",
          overflow: "hidden",
          height: calHeightDataGrid(LIMIT_ROW_COUPON) + 17,
        }}
      >
        <div
          className="ag-theme-alpine"
          style={{ width: "100%", height: "100%" }}
        >
          <AgGridReact
            rowData={coupon && coupon.items ? coupon.items : []}
            columnDefs={columns}
          ></AgGridReact>
        </div>
      </div>
      {open && (
        <ModalCoupon
          open={open}
          handleClose={() => setOpen(false)}
          labelOk={current ? "Sửa" : "Thêm"}
          title={current ? "Sửa giảm giá" : "Thêm giảm giá"}
          isCloseAfterOk={true}
          coupon={current}
          width={600}
          handleOk={handleOk}
        />
      )}
      {coupon && coupon.total_page && (
        <Box sx={{ display: "flex", justifyContent: "end", mt: 1 }}>
          <Pagination
            showRowsPerPage={true}
            listRowPerPage={[LIMIT_ROW_COUPON, 50, 100, 200, 500]}
            rowsPerPage={limit}
            onChangeRowsPerPage={setLimit}
            onChange={(e, value) => {
              setPage(value);
            }}
            page={page}
            totalPage={coupon.total_page}
          />
        </Box>
      )}
      {openDialog && (
        <ConfirmDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onConfirm={onConfirm}
          text={`Bạn có chắc chắn muốn xoá giảm giá này ?`}
        />
      )}
    </Box>
  );
};

export default CouponTabPanel;
