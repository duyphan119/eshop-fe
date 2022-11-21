import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, IconButton, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { ModalProduct } from "../../../components/ModalAddUpdate";
import { axiosRes, axiosToken } from "../../../config/configAxios";
import {
  API_GROUP_PRODUCT_URL,
  API_PRODUCT_URL,
  API_UPLOAD_URL,
  LIMIT_ROW_PRODUCT,
} from "../../../constants";
import { getAllGroupProducts } from "../../../redux/groupProductSlice";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getCurrentProduct,
  updateProduct,
} from "../../../redux/productSlice";
import { showToast } from "../../../redux/toastSlice";
import { calHeightDataGrid, getURL } from "../../../utils";
import "../Management.css";
const rowHeight = 64;
const ProductManagement = () => {
  const columns = [
    {
      field: "actions",
      headerName: "",
      width: 100,
      renderCell: (params) => (
        <>
          <Tooltip title="Sửa sản phẩm">
            <IconButton
              size="small"
              color="secondary"
              onClick={() => {
                dispatch(getCurrentProduct(params.row));
                setOpenModal(true);
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xoá sản phẩm">
            <IconButton
              size="small"
              color="error"
              onClick={() => {
                dispatch(getCurrentProduct(params.row));
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
      width: 70,
    },
    {
      field: "groupProduct.name",
      headerName: "Tên nhóm sản phẩm",
      width: 180,
      valueGetter: (params) => params.row.groupProduct.name,
    },
    {
      field: "name",
      headerName: "Tên sản phẩm",
      width: 300,
      renderCell: (params) => {
        return (
          <div
            style={{ display: "flex", alignItems: "center", height: rowHeight }}
          >
            <img src={getURL(params.row.avatar)} height="100%" alt="" />
            &nbsp;{params.row.name}
          </div>
        );
      },
    },
    {
      field: "initPrice",
      headerName: "Giá",
      width: 100,
    },
    {
      field: "newPrice",
      headerName: "Giá mới",
      width: 100,
    },
    {
      field: "slug",
      headerName: "Slug",
      width: 200,
    },
  ];

  const products = useSelector((state) => state.product.list);
  const current = useSelector((state) => state.product.current);
  const token = useSelector((state) => state.auth.token);
  const page = useSelector((state) => state.product.page);

  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const promises = [];
    promises.push(axiosRes().get(`${API_PRODUCT_URL}?noDetail=true`));
    promises.push(axiosRes().get(`${API_GROUP_PRODUCT_URL}`));
    Promise.allSettled(promises)
      .then((listRes) => {
        if (listRes[0].status === "fulfilled") {
          dispatch(getAllProducts(listRes[0].value.items));
        }
        if (listRes[1].status === "fulfilled") {
          dispatch(getAllGroupProducts(listRes[1].value.items));
        }
      })
      .catch((err) => {});
  }, [dispatch, page]);

  async function handleOk(data) {
    try {
      data.newPrice = data.newPrice === "" ? null : data.newPrice;
      const { file } = data;
      let listUrls = [];
      if (file) {
        const formData = new FormData();
        formData.append("images", file);
        const res = await axiosRes().post(`${API_UPLOAD_URL}`, formData);
        listUrls = res.items;
        if (listUrls.length > 0) {
          data.avatar = listUrls[0].path;
        }
      }
      console.log({ current, data });
      if (!current) {
        const res = await axiosToken(
          token?.accessToken,
          dispatch,
          navigate
        ).post(`${API_PRODUCT_URL}`, data);
        dispatch(addProduct({ ...data, ...res.item }));
        dispatch(
          showToast({
            isOpen: true,
            text: "Thêm thành công",
            type: "success",
          })
        );
      } else {
        await axiosToken(token?.accessToken, dispatch, navigate).put(
          `${API_PRODUCT_URL}/${current.id}`,
          data
        );
        dispatch(updateProduct({ ...current, ...data }));
      }
    } catch (error) {}
  }

  async function handleDelete() {
    try {
      await axiosToken(token?.accessToken, dispatch, navigate).delete(
        `${API_PRODUCT_URL}/${current.id}`
      );
      dispatch(deleteProduct(current.id));
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
            dispatch(getCurrentProduct(null));
            // setOpen(true);
            setOpenModal(true);
          }}
        >
          <AddIcon />
          Thêm sản phẩm
        </button>
        <Box height={calHeightDataGrid(LIMIT_ROW_PRODUCT, rowHeight)}>
          <DataGrid
            columns={columns}
            rows={products}
            pageSize={LIMIT_ROW_PRODUCT}
            rowHeight={rowHeight}
            rowsPerPageOptions={[
              LIMIT_ROW_PRODUCT,
              LIMIT_ROW_PRODUCT * 5,
              LIMIT_ROW_PRODUCT * 10,
              LIMIT_ROW_PRODUCT * 20,
              LIMIT_ROW_PRODUCT * 50,
            ]}
          />
        </Box>
      </Box>
      {openModal && (
        <ModalProduct
          width={560}
          height={560}
          open={openModal}
          handleClose={() => setOpenModal(false)}
          handleOk={handleOk}
          labelOk={current ? "Sửa" : "Thêm"}
          title={current ? "Sửa sản phẩm" : "Thêm sản phẩm"}
          isCloseAfterOk={current !== null}
        />
      )}
      {openDialog && (
        <ConfirmDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          title="Xác nhận"
          text="Bạn có chắc chắn muốn xoá sản phẩm này ?"
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default ProductManagement;
