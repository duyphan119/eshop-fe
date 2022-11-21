import { Avatar, Box, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  API_ROLE_URL,
  API_UPLOAD_URL,
  API_USER_URL,
  LIMIT_ROW_USER,
} from "../../../constants";
import { calHeightDataGrid, getURL } from "../../../utils";
import { useEffect, useState } from "react";
import { axiosRes, axiosToken } from "../../../config/configAxios";
import { useDispatch, useSelector } from "react-redux";
import {
  addUser,
  deleteUser,
  getAllUsers,
  getCurrentUser,
  updateUser,
} from "../../../redux/userSlice";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../redux/toastSlice";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { ModalUser } from "../../../components/ModalAddUpdate";
import { getAllRoles } from "../../../redux/roleSlice";
import "../Management.css";
const UserManagement = () => {
  const columns = [
    {
      field: "actions",
      headerName: "",
      width: 100,
      renderCell: (params) => (
        <>
          <Tooltip title="Sửa người dùng">
            <IconButton
              size="small"
              color="secondary"
              onClick={() => {
                dispatch(getCurrentUser(params.row));
                setOpenModal(true);
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xoá người dùng">
            <IconButton
              size="small"
              color="error"
              onClick={() => {
                dispatch(getCurrentUser(params.row));
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
      field: "fullName",
      headerName: "Họ và tên",
      width: 200,
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={getURL(params.row.avatar)}
            alt="Phan Khánh Duy"
            sx={{ height: 32, width: 32 }}
          />
          &nbsp;
          {params.row.fullName}
        </div>
      ),
    },
    {
      field: "telephone",
      headerName: "Số điện thoại",
      width: 110,
    },
    {
      field: "email",
      headerName: "Địa chỉ email",
      width: 240,
    },
    {
      field: "address",
      headerName: "Địa chỉ",
      width: 240,
    },
    {
      field: "city",
      headerName: "Tỉnh / Thành phố",
      width: 180,
    },
    {
      field: "district",
      headerName: "Quận / huyện",
      width: 180,
    },
    {
      field: "ward",
      headerName: "Phường / Xã",
      width: 160,
    },
    {
      field: "role.role",
      headerName: "Quyền",
      valueGetter: (params) => params.row.role.role,
    },
  ];

  const users = useSelector((state) => state.user.all);
  const current = useSelector((state) => state.user.current);
  const token = useSelector((state) => state.auth.token);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (token) {
      const promises = [];
      promises.push(
        axiosToken(token?.accessToken, dispatch, navigate).get(
          `${API_USER_URL}`
        )
      );
      promises.push(
        axiosToken(token?.accessToken, dispatch, navigate).get(
          `${API_ROLE_URL}`
        )
      );
      Promise.allSettled(promises)
        .then((listRes) => {
          if (listRes[0].status === "fulfilled") {
            dispatch(getAllUsers(listRes[0].value.items));
          }
          if (listRes[1].status === "fulfilled") {
            dispatch(getAllRoles(listRes[1].value.items));
          }
        })
        .catch((err) => {});
    }
  }, [dispatch, navigate, token]);
  async function handleDelete() {
    try {
      if (current) {
        await axiosToken(token?.accessToken, dispatch, navigate).delete(
          `${API_USER_URL}/${current.id}`
        );
        await axiosToken(token?.accessToken, dispatch, navigate).delete(
          API_UPLOAD_URL,
          {
            data: [{ path: current.avatar }],
          }
        );
        dispatch(
          showToast({
            isOpen: true,
            text: "Xoá thành công",
            type: "success",
          })
        );
        dispatch(deleteUser(current.id));
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

  async function handleOk(data) {
    try {
      const { file, role } = data;
      const formData = new FormData();
      let avatar;
      if (file) {
        formData.append("images", file);
        const resUpload = await axiosRes().post(API_UPLOAD_URL, formData);
        avatar = resUpload.items[0].path;
      }
      let req = data;
      if (avatar) {
        req.avatar = avatar;
      }
      if (current) {
        delete req.password;
        await axiosToken(token?.accessToken, dispatch, navigate).put(
          `${API_USER_URL}/${current.id}`,
          req
        );
        if (req.avatar) {
          await axiosToken(token?.accessToken, dispatch, navigate).delete(
            API_UPLOAD_URL,
            {
              data: [{ path: current.avatar }],
            }
          );
        }
        dispatch(updateUser({ ...current, role, ...req }));
      } else {
        const res = await axiosToken(
          token?.accessToken,
          dispatch,
          navigate
        ).post(API_USER_URL, req);
        dispatch(addUser({ ...res.item, role }));
      }
    } catch (error) {}
  }

  return (
    <>
      <Box bgcolor="#fff" p={1}>
        <button
          className="management-btn management-btn-add"
          onClick={() => {
            dispatch(getCurrentUser(null));
            setOpenModal(true);
          }}
        >
          <AddIcon />
          Thêm người dùng
        </button>
        <Box sx={{ height: calHeightDataGrid(LIMIT_ROW_USER) }}>
          <DataGrid columns={columns} rows={users} />
        </Box>
      </Box>
      {openModal && (
        <ModalUser
          width={560}
          height={560}
          open={openModal}
          handleClose={() => setOpenModal(false)}
          handleOk={handleOk}
          labelOk={current ? "Sửa" : "Thêm"}
          title={current ? "Sửa người dùng" : "Thêm người dùng"}
          isCloseAfterOk={current !== null}
        />
      )}
      {openDialog && (
        <ConfirmDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          title="Xác nhận"
          text="Bạn có chắc chắn muốn xoá người dùng này ?"
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default UserManagement;
