import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, IconButton, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { ModalCoupon } from "../../../components/ModalAddUpdate";
import { axiosRes, axiosToken } from "../../../config/configAxios";
import {
  API_COUPON_URL,
  API_UPLOAD_URL,
  LIMIT_ROW_COUPON,
} from "../../../constants";
import {
  addCoupon,
  deleteCoupon,
  getAllCoupons,
  getCurrentCoupon,
  updateCoupon,
} from "../../../redux/couponSlice";

import { showToast } from "../../../redux/toastSlice";
import { calHeightDataGrid, formatDateVN, getURL } from "../../../utils";
import "../Management.css";
const DiscountManagement = () => {
  const columns = [
    {
      field: "actions",
      headerName: "",
      width: 120,
      renderCell: (params) => (
        <>
          <Tooltip title="Sửa ưu đãi">
            <IconButton
              color="secondary"
              onClick={() => {
                dispatch(getCurrentCoupon(params.row));
                setOpenModal(true);
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xoá ưu đãi">
            <IconButton
              color="error"
              onClick={() => {
                dispatch(getCurrentCoupon(params.row));
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
      field: "name",
      headerName: "Tên ưu đãi",
      width: 180,
    },
    {
      field: "percent",
      headerName: "Phần trăm",
      width: 100,
    },
    {
      field: "code",
      headerName: "Mã áp dụng",
      width: 120,
    },
    {
      field: "banner",
      headerName: "Quảng cáo",
      cellRenderer: (params) => (
        <img src={getURL(params.row.banner)} height="32" alt="" />
      ),
    },
    {
      field: "start",
      headerName: "Bắt đầu",
      valueGetter: (params) => formatDateVN(params.row.start),
    },
    {
      field: "end",
      headerName: "Kết thúc",
      valueGetter: (params) => formatDateVN(params.row.end),
    },
    {
      field: "description",
      headerName: "Mô tả",
      width: 400,
    },
  ];

  const coupons = useSelector((state) => state.coupon.list);
  const current = useSelector((state) => state.coupon.current);
  const token = useSelector((state) => state.auth.token);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const promises = [];
    promises.push(
      axiosToken(token?.accessToken, dispatch, navigate).get(
        `${API_COUPON_URL}`
      )
    );
    Promise.allSettled(promises)
      .then((listRes) => {
        if (listRes[0].status === "fulfilled") {
          dispatch(getAllCoupons(listRes[0].value.items));
        }
      })
      .catch((err) => {});
  }, [dispatch, navigate, token]);
  async function handleOk(data) {
    try {
      const { fileBanner, fileAvatar } = data;
      let listUrls = [];
      const formData = new FormData();

      if (fileBanner) {
        formData.append("images", fileBanner);
      }
      if (fileAvatar) {
        formData.append("images", fileAvatar);
      }
      if (fileAvatar || fileBanner) {
        const res = await axiosRes().post(`${API_UPLOAD_URL}`, formData);
        listUrls = res.items;
      }
      if (listUrls.length === 1) {
        data.banner = listUrls[0].path;
      }
      if (listUrls.length === 2) {
        data.avatar = listUrls[1].path;
      }
      if (!current) {
        const res = await axiosToken(
          token?.accessToken,
          dispatch,
          navigate
        ).post(`${API_COUPON_URL}`, data);
        dispatch(addCoupon({ ...data, ...res.item }));
        dispatch(
          showToast({
            isOpen: true,
            text: "Thêm thành công",
            type: "success",
          })
        );
      } else {
        await axiosToken(token?.accessToken, dispatch, navigate).put(
          `${API_COUPON_URL}/${current.id}`,
          data
        );
        dispatch(updateCoupon({ ...current, ...data }));
      }
    } catch (error) {}
  }
  async function handleDelete() {
    try {
      if (current) {
        await axiosToken(token?.accessToken, dispatch, navigate).delete(
          `${API_COUPON_URL}/${current.id}`
        );
        dispatch(
          showToast({
            isOpen: true,
            text: "Xoá thành công",
            type: "success",
          })
        );
        dispatch(deleteCoupon(current.id));
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
            dispatch(getCurrentCoupon(null));
            setOpenModal(true);
          }}
        >
          <AddIcon />
          Thêm ưu đãi
        </button>
        <Box height={calHeightDataGrid(LIMIT_ROW_COUPON)}>
          <DataGrid
            columns={columns}
            rows={coupons}
            pageSize={LIMIT_ROW_COUPON}
            rowsPerPageOptions={[
              LIMIT_ROW_COUPON,
              LIMIT_ROW_COUPON * 5,
              LIMIT_ROW_COUPON * 10,
              LIMIT_ROW_COUPON * 20,
              LIMIT_ROW_COUPON * 50,
            ]}
          />
        </Box>
      </Box>
      {openModal && (
        <ModalCoupon
          width={560}
          height={640}
          open={openModal}
          handleClose={() => setOpenModal(false)}
          handleOk={handleOk}
          labelOk={current ? "Sửa" : "Thêm"}
          title={current ? "Sửa ưu đãi" : "Thêm ưu đãi"}
          isCloseAfterOk={current !== null}
        />
      )}
      {openDialog && (
        <ConfirmDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          title="Xác nhận"
          text="Bạn có chắc chắn muốn xoá ưu đãi này ?"
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default DiscountManagement;
