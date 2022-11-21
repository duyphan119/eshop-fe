import { Box, IconButton, Tooltip } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  API_CATEGORY_URL,
  API_GROUP_PRODUCT_URL,
  API_UPLOAD_URL,
  LIMIT_ROW_GROUP_PRODUCT,
} from "../../../constants";
import { calHeightDataGrid, getURL } from "../../../utils";

import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ModalGroupProduct } from "../../../components/ModalAddUpdate";
import { axiosRes, axiosToken } from "../../../config/configAxios";
import { getAllCategories } from "../../../redux/categorySlice";
import {
  addGroupProduct,
  getAllGroupProducts,
  getCurrentGroupProduct,
  updateGroupProduct,
  deleteGroupProduct,
} from "../../../redux/groupProductSlice";
import { showToast } from "../../../redux/toastSlice";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { useNavigate } from "react-router-dom";
import "../Management.css";
const rowHeight = 80;
const GroupProductManagement = () => {
  const columns = [
    {
      field: "actions",
      headerName: "",
      width: 100,
      renderCell: (params) => (
        <>
          <Tooltip title="Sửa nhóm sản phẩm">
            <IconButton
              size="small"
              color="secondary"
              onClick={() => {
                dispatch(getCurrentGroupProduct(params.row));
                setOpenModal(true);
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xoá nhóm sản phẩm">
            <IconButton
              size="small"
              color="error"
              onClick={() => {
                // dispatch(getCurrentCategory(params.row));
                setOpenDialog(true);
                dispatch(getCurrentGroupProduct(params.row));
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
      width: 70,
    },
    {
      field: "category.groupCategory.name",
      headerName: "Tên nhóm danh mục",
      width: 170,
      valueGetter: (params) => params.row.category.groupCategory.name,
    },
    {
      field: "category.name",
      headerName: "Tên danh mục",
      width: 150,
      valueGetter: (params) => params.row.category.name,
    },
    {
      field: "name",
      headerName: "Tên nhóm sản phẩm",
      width: 190,
    },
    {
      field: "shortName",
      headerName: "Viết tắt",
      width: 100,
    },
    {
      field: "slug",
      width: 220,
      headerName: "Slug",
    },
    {
      field: "isHot",
      width: 130,
      headerName: "Đang hot",
      valueGetter: (params) =>
        `${params.row.isHot}` === "true" ? "Hot" : "Không",
      renderCell: (params) =>
        `${params.row.isHot}` === "true" ? (
          <span className="hot">Hot</span>
        ) : (
          <span className="no-hot">Không</span>
        ),
    },
    {
      field: "avatar",
      headerName: "Hình ảnh",
      width: 140,
      renderCell: (params) => (
        <img src={getURL(params.row.avatar)} height="32" alt="" />
      ),
    },
    {
      field: "banner",
      width: 340,
      headerName: "Quảng cáo",
      renderCell: (params) => (
        <img src={getURL(params.row.banner)} height="32" alt="" />
      ),
    },
    {
      field: "description",
      headerName: "Mô tả",
      width: 220,
    },
  ];

  const groupProducts = useSelector((state) => state.groupProduct.all);
  const current = useSelector((state) => state.groupProduct.current);
  const token = useSelector((state) => state.auth.token);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const promises = [];
    promises.push(axiosRes().get(`${API_GROUP_PRODUCT_URL}`));
    promises.push(axiosRes().get(`${API_CATEGORY_URL}`));
    Promise.allSettled(promises)
      .then((listRes) => {
        if (listRes[0].status === "fulfilled") {
          dispatch(getAllGroupProducts(listRes[0].value.items));
        }
        if (listRes[1].status === "fulfilled") {
          dispatch(getAllCategories(listRes[1].value.items));
        }
      })
      .catch((err) => {});
  }, [dispatch]);
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
        ).post(`${API_GROUP_PRODUCT_URL}`, data);
        dispatch(addGroupProduct({ ...data, ...res.item }));
        dispatch(
          showToast({
            isOpen: true,
            text: "Thêm thành công",
            type: "success",
          })
        );
      } else {
        await axiosToken(token?.accessToken, dispatch, navigate).put(
          `${API_GROUP_PRODUCT_URL}/${current.id}`,
          data
        );
        dispatch(updateGroupProduct({ ...current, ...data }));
        dispatch(
          showToast({
            isOpen: true,
            text: "Cập nhật thành công",
            type: "success",
          })
        );
      }
    } catch (error) {}
  }
  async function handleDelete() {
    try {
      if (current) {
        await axiosToken(token?.accessToken, dispatch, navigate).delete(
          `${API_GROUP_PRODUCT_URL}/${current.id}`
        );
        dispatch(
          showToast({
            isOpen: true,
            text: "Xoá thành công",
            type: "success",
          })
        );
        dispatch(deleteGroupProduct(current.id));
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
            dispatch(getCurrentGroupProduct(null));
            setOpenModal(true);
          }}
        >
          <AddIcon />
          Thêm nhóm sản phẩm
        </button>
        <Box height={calHeightDataGrid(LIMIT_ROW_GROUP_PRODUCT, rowHeight)}>
          <DataGrid
            columns={columns}
            rows={groupProducts}
            pageSize={LIMIT_ROW_GROUP_PRODUCT}
            rowHeight={rowHeight}
            rowsPerPageOptions={[
              LIMIT_ROW_GROUP_PRODUCT,
              LIMIT_ROW_GROUP_PRODUCT * 5,
              LIMIT_ROW_GROUP_PRODUCT * 10,
              LIMIT_ROW_GROUP_PRODUCT * 20,
              LIMIT_ROW_GROUP_PRODUCT * 50,
            ]}
          />
        </Box>
      </Box>
      {openModal && (
        <ModalGroupProduct
          width={560}
          height={640}
          open={openModal}
          handleClose={() => setOpenModal(false)}
          handleOk={handleOk}
          labelOk={current ? "Sửa" : "Thêm"}
          title={current ? "Sửa nhóm sản phẩm" : "Thêm nhóm sản phẩm"}
          isCloseAfterOk={current !== null}
        />
      )}
      {openDialog && (
        <ConfirmDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          title="Xác nhận"
          text="Bạn có chắc chắn muốn xoá nhóm sản phẩm này ?"
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default GroupProductManagement;
