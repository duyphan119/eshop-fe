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
import { API_COLOR_URL, LIMIT_ROW_COLOR } from "../../../constants";
import {
  addColor,
  deleteColor,
  getAllColors,
  getCurrentColor,
  updateColor,
} from "../../../redux/colorSlice";
import { showToast } from "../../../redux/toastSlice";
import { calHeightDataGrid } from "../../../utils";
import "../Management.css";
const ColorManagement = () => {
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
    },
    {
      field: "value",
      headerName: "Tên màu sắc",
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
          <Tooltip title="Sửa màu sắc">
            <IconButton
              color="secondary"
              onClick={() => {
                dispatch(getCurrentColor(params.row));
                setOpenModal(true);
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xoá màu sắc">
            <IconButton
              color="error"
              onClick={() => {
                dispatch(getCurrentColor(params.row));
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

  const colors = useSelector((state) => state.color.list);
  const current = useSelector((state) => state.color.current);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const promises = [];
    promises.push(axiosRes().get(`${API_COLOR_URL}`));
    Promise.allSettled(promises)
      .then((listRes) => {
        if (listRes[0].status === "fulfilled") {
          dispatch(getAllColors(listRes[0].value.items));
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
        ).post(`${API_COLOR_URL}`, data);
        dispatch(addColor({ ...data, ...res.item }));
        dispatch(
          showToast({
            isOpen: true,
            text: "Thêm thành công",
            type: "success",
          })
        );
      } else {
        await axiosToken(token?.accessToken, dispatch, navigate).put(
          `${API_COLOR_URL}/${current.id}`,
          data
        );
        dispatch(updateColor({ ...current, ...data }));
      }
    } catch (error) {}
  }
  async function handleDelete() {
    try {
      await axiosToken(token?.accessToken, dispatch, navigate).delete(
        `${API_COLOR_URL}/${current.id}`
      );
      dispatch(deleteColor(current.id));
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
            dispatch(getCurrentColor(null));
            setOpenModal(true);
          }}
        >
          <AddIcon />
          Thêm màu sắc
        </button>
        <Box height={calHeightDataGrid(LIMIT_ROW_COLOR)}>
          <DataGrid
            columns={columns}
            rows={colors}
            pageSize={LIMIT_ROW_COLOR}
            rowsPerPageOptions={[
              LIMIT_ROW_COLOR,
              LIMIT_ROW_COLOR * 5,
              LIMIT_ROW_COLOR * 10,
              LIMIT_ROW_COLOR * 20,
              LIMIT_ROW_COLOR * 50,
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
          title={current ? "Sửa màu sắc" : "Thêm màu sắc"}
          isCloseAfterOk={current !== null}
        />
      )}
      {openDialog && (
        <ConfirmDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          title="Xác nhận"
          text="Bạn có chắc chắn muốn xoá màu này ?"
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default ColorManagement;
