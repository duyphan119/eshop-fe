import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, IconButton, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../../../components/ConfirmDialog";
import ModalSize from "../../../components/ModalAddUpdate/ModalSize";
import { axiosRes, axiosToken } from "../../../config/configAxios";
import { API_SIZE_URL, LIMIT_ROW_SIZE } from "../../../constants";
import {
  addSize,
  deleteSize,
  getAllSizes,
  getCurrentSize,
  updateSize,
} from "../../../redux/sizeSlice";
import { showToast } from "../../../redux/toastSlice";
import { calHeightDataGrid } from "../../../utils";
import "../Management.css";
const SizeManagement = () => {
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
    },
    {
      field: "value",
      headerName: "Tên kích cỡ",
      width: 200,
    },
    {
      field: "shortValue",
      headerName: "Viết tắt",
      width: 200,
    },
    {
      field: "actions",
      headerName: "",
      width: 100,
      renderCell: (params) => (
        <>
          <Tooltip title="Sửa kích cỡ">
            <IconButton
              color="secondary"
              onClick={() => {
                dispatch(getCurrentSize(params.row));
                setOpenModal(true);
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xoá kích cỡ">
            <IconButton
              color="error"
              onClick={() => {
                dispatch(getCurrentSize(params.row));
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

  const sizes = useSelector((state) => state.size.list);
  const current = useSelector((state) => state.size.current);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const promises = [];
    promises.push(axiosRes().get(`${API_SIZE_URL}`));
    Promise.allSettled(promises)
      .then((listRes) => {
        if (listRes[0].status === "fulfilled") {
          dispatch(getAllSizes(listRes[0].value.items));
        }
      })
      .catch((err) => {});
  }, [dispatch]);

  async function handleOk(data) {
    try {
      if (!current) {
        const res = await axiosToken(
          token?.accessToken,
          dispatch,
          navigate
        ).post(`${API_SIZE_URL}`, data);
        dispatch(addSize({ ...data, ...res.item }));
        dispatch(
          showToast({
            isOpen: true,
            text: "Thêm thành công",
            type: "success",
          })
        );
      } else {
        await axiosToken(token?.accessToken, dispatch, navigate).put(
          `${API_SIZE_URL}/${current.id}`,
          data
        );
        dispatch(updateSize({ ...current, ...data }));
      }
    } catch (error) {}
  }

  async function handleDelete() {
    try {
      await axiosToken(token?.accessToken, dispatch, navigate).delete(
        `${API_SIZE_URL}/${current.id}`
      );
      dispatch(deleteSize(current.id));
      dispatch(
        showToast({
          isOpen: true,
          text: "Xoá thành công",
          type: "success",
        })
      );
    } catch (error) {
      dispatch(
        showToast({ isOpen: true, type: "error", text: "Xoá thất bại" })
      );
    }
  }

  return (
    <>
      <Box bgcolor="#fff" p={1}>
        <button
          className="management-btn management-btn-add"
          onClick={() => {
            dispatch(getCurrentSize(null));
            setOpenModal(true);
          }}
        >
          <AddIcon />
          Thêm kích cỡ
        </button>
        <Box height={calHeightDataGrid(LIMIT_ROW_SIZE)}>
          <DataGrid
            columns={columns}
            rows={sizes}
            pageSize={LIMIT_ROW_SIZE}
            rowsPerPageOptions={[
              LIMIT_ROW_SIZE,
              LIMIT_ROW_SIZE * 5,
              LIMIT_ROW_SIZE * 10,
              LIMIT_ROW_SIZE * 20,
              LIMIT_ROW_SIZE * 50,
            ]}
          />
        </Box>
      </Box>
      {openModal && (
        <ModalSize
          width={360}
          open={openModal}
          handleClose={() => setOpenModal(false)}
          handleOk={handleOk}
          labelOk={current ? "Sửa" : "Thêm"}
          title={current ? "Sửa kích cỡ" : "Thêm kích cỡ"}
          isCloseAfterOk={current !== null}
        />
      )}
      {openDialog && (
        <ConfirmDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          title="Xác nhận"
          text="Bạn có chắc chắn muốn xoá kích cỡ này ?"
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default SizeManagement;
