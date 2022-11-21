import { Box, IconButton, Tooltip } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  API_GROUP_CATEGORY_URL,
  API_UPLOAD_URL,
  LIMIT_ROW_GROUP_CATEGORY,
} from "../../../constants";
import { calHeightDataGrid, getURL } from "../../../utils";

import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosRes, axiosToken } from "../../../config/configAxios";
import {
  addGroupCategory,
  deleteGroupCategory,
  getAllGroupCategories,
  getCurrentGroupCategory,
  updateGroupCategory,
} from "../../../redux/groupCategorySlice";
import { showToast } from "../../../redux/toastSlice";
import { ModalGroupCategory } from "../../../components/ModalAddUpdate";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../../../components/ConfirmDialog";
import "../Management.css";
const rowHeight = 80;
const GroupCategoryManagement = () => {
  const columns = [
    {
      field: "actions",
      headerName: "",
      width: 100,
      renderCell: (params) => (
        <>
          <Tooltip title="Sửa nhóm danh mục">
            <IconButton
              size="small"
              color="secondary"
              onClick={() => {
                dispatch(getCurrentGroupCategory(params.row));
                setOpenModal(true);
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xoá nhóm danh mục">
            <IconButton
              size="small"
              color="error"
              onClick={() => {
                // dispatch(getCurrentGroupCategory(params.row));
                setOpenDialog(true);
                dispatch(getCurrentGroupCategory(params.row));
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
      field: "name",
      headerName: "Tên nhóm danh mục",
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

  const groupCategories = useSelector((state) => state.groupCategory.all);
  const token = useSelector((state) => state.auth.token);
  const current = useSelector((state) => state.groupCategory.current);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const promises = [];
    promises.push(axiosRes().get(`${API_GROUP_CATEGORY_URL}`));
    Promise.allSettled(promises)
      .then((listRes) => {
        if (listRes[0].status === "fulfilled") {
          dispatch(getAllGroupCategories(listRes[0].value.items));
        }
      })
      .catch((err) => {});
  }, [dispatch]);
  async function handleOk(data) {
    try {
      data.newPrice = data.newPrice === "" ? null : data.newPrice;
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
        ).post(`${API_GROUP_CATEGORY_URL}`, data);
        dispatch(addGroupCategory({ ...data, ...res.item }));
        dispatch(
          showToast({
            isOpen: true,
            text: "Thêm thành công",
            type: "success",
          })
        );
      } else {
        await axiosToken(token?.accessToken, dispatch, navigate).put(
          `${API_GROUP_CATEGORY_URL}/${current.id}`,
          data
        );
        dispatch(updateGroupCategory({ ...current, ...data }));
      }
    } catch (error) {}
  }
  async function handleDelete() {
    try {
      if (current) {
        await axiosToken(token?.accessToken, dispatch, navigate).delete(
          `${API_GROUP_CATEGORY_URL}/${current.id}`
        );
        dispatch(
          showToast({
            isOpen: true,
            text: "Xoá thành công",
            type: "success",
          })
        );
        dispatch(deleteGroupCategory(current.id));
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
            dispatch(getCurrentGroupCategory(null));
            setOpenModal(true);
          }}
        >
          <AddIcon />
          Thêm nhóm danh mục
        </button>
        <Box height={calHeightDataGrid(LIMIT_ROW_GROUP_CATEGORY, rowHeight)}>
          <DataGrid
            columns={columns}
            rows={groupCategories}
            pageSize={LIMIT_ROW_GROUP_CATEGORY}
            rowHeight={rowHeight}
            rowsPerPageOptions={[
              LIMIT_ROW_GROUP_CATEGORY,
              LIMIT_ROW_GROUP_CATEGORY * 5,
              LIMIT_ROW_GROUP_CATEGORY * 10,
              LIMIT_ROW_GROUP_CATEGORY * 20,
              LIMIT_ROW_GROUP_CATEGORY * 50,
            ]}
          />
        </Box>
      </Box>
      {openModal && (
        <ModalGroupCategory
          width={560}
          height={640}
          open={openModal}
          handleClose={() => setOpenModal(false)}
          handleOk={handleOk}
          labelOk={current ? "Sửa" : "Thêm"}
          title={current ? "Sửa nhóm danh mục" : "Thêm nhóm danh mục"}
          isCloseAfterOk={current !== null}
        />
      )}
      {openDialog && (
        <ConfirmDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          title="Xác nhận"
          text="Bạn có chắc chắn muốn xoá nhóm danh mục này ?"
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default GroupCategoryManagement;
