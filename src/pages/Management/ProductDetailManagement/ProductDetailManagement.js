import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, IconButton, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ModalProductDetail } from "../../../components/ModalAddUpdate";
import { axiosRes, axiosToken } from "../../../config/configAxios";
import {
  API_COLOR_URL,
  API_PRODUCT_DETAIL_URL,
  API_PRODUCT_URL,
  API_SIZE_URL,
  API_UPLOAD_URL,
  LIMIT_ROW_PRODUCT_DETAIL,
} from "../../../constants";
import { getAllColors } from "../../../redux/colorSlice";
import {
  addProductDetail,
  getAllProductDetails,
  getCurrentProductDetail,
  updateProductDetail,
} from "../../../redux/productDetailSlice";
import { getAllProducts } from "../../../redux/productSlice";
import { getAllSizes } from "../../../redux/sizeSlice";
import { showToast } from "../../../redux/toastSlice";
import { calHeightDataGrid, getURL } from "../../../utils";
import "../Management.css";
const ProductDetailManagement = () => {
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
    },
    {
      field: "product.name",
      headerName: "Sản phẩm",
      width: 320,
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={getURL(params.row.product.avatar)} height="32" alt="" />
          &nbsp;
          {params.row.product.name}
        </div>
      ),
      valueGetter: (params) => params.row.product.name,
    },
    {
      field: "color",
      headerName: "Màu sắc",
      width: 140,
      valueGetter: (params) => params.row.color.value,
    },
    {
      field: "size",
      headerName: "Kích cỡ",
      width: 100,
      valueGetter: (params) => params.row.size.value,
    },
    {
      field: "sku",
      headerName: "SKU",
      width: 180,
    },
    {
      field: "amount",
      headerName: "SL tồn",
      width: 120,
    },
    {
      field: "avatar",
      headerName: "Hình ảnh",
      width: 120,
      renderCell: (params) => (
        <img src={getURL(params.row.avatar)} height="100%" alt="" />
      ),
    },
    {
      field: "actions",
      headerName: "",
      pinned: "right",
      width: 120,
      renderCell: (params) => (
        <>
          <Tooltip title="Sửa chi tiết sản phẩm">
            <IconButton
              size="small"
              color="secondary"
              onClick={() => {
                dispatch(getCurrentProductDetail(params.row));
                setOpenModal(true);
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xoá chi tiết sản phẩm">
            <IconButton
              size="small"
              color="error"
              onClick={() => {
                dispatch(getCurrentProductDetail(params.row));
                // setOpenDialog(true);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];
  const token = useSelector((state) => state.auth.token);
  const productDetails = useSelector((state) => state.productDetail.list);
  const current = useSelector((state) => state.productDetail.current);

  const [openModal, setOpenModal] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    const promises = [];
    promises.push(axiosRes().get(`${API_PRODUCT_DETAIL_URL}`));
    promises.push(axiosRes().get(`${API_COLOR_URL}`));
    promises.push(axiosRes().get(`${API_SIZE_URL}`));
    promises.push(axiosRes().get(`${API_PRODUCT_URL}?noDetail=true`));

    Promise.allSettled(promises)
      .then((listRes) => {
        if (listRes[0].status === "fulfilled") {
          dispatch(getAllProductDetails(listRes[0].value.items));
        }
        if (listRes[1].status === "fulfilled") {
          dispatch(getAllColors(listRes[1].value.items));
        }
        if (listRes[2].status === "fulfilled") {
          dispatch(getAllSizes(listRes[2].value.items));
        }
        if (listRes[3].status === "fulfilled") {
          dispatch(getAllProducts(listRes[3].value.items));
        }
      })
      .catch((err) => {});
  }, [dispatch]);

  async function handleOk(data) {
    try {
      const { file, colorId, productId } = data;
      let listUrls = [];
      let index = productDetails.findIndex(
        (item) =>
          item.colorId === colorId &&
          item.productId === productId &&
          item.avatar !== ""
      );
      if (file) {
        if (index === -1 || (current && index !== -1)) {
          const formData = new FormData();
          formData.append("images", file);
          const res = await axiosRes().post(`${API_UPLOAD_URL}`, formData);
          listUrls = res.items;
          if (listUrls.length > 0) {
            data.avatar = listUrls[0].path;
          }
        } else {
          data.avatar = productDetails[index].avatar;
        }
      }
      if (!current) {
        const res = await axiosToken(
          token?.accessToken,
          dispatch,
          navigate
        ).post(`${API_PRODUCT_DETAIL_URL}`, data);
        dispatch(addProductDetail({ ...data, ...res.item }));
        dispatch(
          showToast({
            isOpen: true,
            text: "Thêm thành công",
            type: "success",
          })
        );
      } else {
        await axiosToken(token?.accessToken, dispatch, navigate).put(
          `${API_PRODUCT_DETAIL_URL}/${current.id}`,
          data
        );
        dispatch(updateProductDetail({ ...current, ...data }));
      }
    } catch (error) {}
  }

  return (
    <Box bgcolor="#fff" p={1}>
      <button
        className="management-btn management-btn-add"
        onClick={() => {
          dispatch(getCurrentProductDetail(null));
          setOpenModal(true);
        }}
      >
        <AddIcon />
        Thêm chi tiết sản phẩm
      </button>
      <Box height={calHeightDataGrid(LIMIT_ROW_PRODUCT_DETAIL)}>
        <DataGrid
          columns={columns}
          rows={productDetails}
          pageSize={LIMIT_ROW_PRODUCT_DETAIL}
          rowsPerPageOptions={[
            LIMIT_ROW_PRODUCT_DETAIL,
            LIMIT_ROW_PRODUCT_DETAIL * 5,
            LIMIT_ROW_PRODUCT_DETAIL * 10,
            LIMIT_ROW_PRODUCT_DETAIL * 20,
            LIMIT_ROW_PRODUCT_DETAIL * 50,
          ]}
        />
      </Box>
      {openModal && (
        <ModalProductDetail
          width={440}
          height={400}
          open={openModal}
          handleClose={() => setOpenModal(false)}
          handleOk={handleOk}
          labelOk={current ? "Sửa" : "Thêm"}
          title={current ? "Sửa chi tiết sản phẩm" : "Thêm chi tiết sản phẩm"}
          isCloseAfterOk={current !== null}
        />
      )}
    </Box>
  );
};

export default ProductDetailManagement;
