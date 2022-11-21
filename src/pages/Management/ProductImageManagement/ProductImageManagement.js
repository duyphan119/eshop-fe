import AddIcon from "@mui/icons-material/Add";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { ModalProductImage } from "../../../components/ModalAddUpdate";
import { axiosRes, axiosToken } from "../../../config/configAxios";
import {
  API_PRODUCT_IMAGE_URL,
  API_PRODUCT_URL,
  API_UPLOAD_URL,
} from "../../../constants";
import {
  addProductImages,
  deleteProductImages,
  getAllProductImages,
} from "../../../redux/productImageSlice";
import { getAllProducts } from "../../../redux/productSlice";
import { showToast } from "../../../redux/toastSlice";
import { getURL } from "../../../utils";
import "../Management.css";
const ProductImageManagement = () => {
  const productImages = useSelector((state) => state.productImage.list);
  const token = useSelector((state) => state.auth.token);

  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [selected, setSelected] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const promises = [];
    promises.push(axiosRes().get(`${API_PRODUCT_URL}?noDetail=true`));
    promises.push(axiosRes().get(`${API_PRODUCT_IMAGE_URL}`));
    Promise.allSettled(promises)
      .then((listRes) => {
        if (listRes[0].status === "fulfilled") {
          dispatch(getAllProducts(listRes[0].value.items));
        }
        if (listRes[1].status === "fulfilled") {
          dispatch(getAllProductImages(listRes[1].value.items));
        }
      })
      .catch((err) => {});
  }, [dispatch]);

  function handleCheck(item) {
    let result = [...selected];
    let index = result.findIndex((el) => el.id === item.id);

    if (index === -1) {
      result = [item, ...result];
    } else {
      result.splice(index, 1);
    }

    setSelected(result);
  }

  async function handleDelete() {
    try {
      await axiosToken(token?.accessToken, dispatch, navigate).delete(
        `${API_UPLOAD_URL}`,
        {
          data: selected.map((item) => ({ path: item.url })),
        }
      );
      await axiosToken(token?.accessToken, dispatch, navigate).delete(
        `${API_PRODUCT_IMAGE_URL}`,
        {
          data: selected,
        }
      );
      dispatch(deleteProductImages(selected));
      setSelected([]);

      dispatch(
        showToast({ isOpen: true, type: "success", text: "Xoá thành công" })
      );
    } catch (error) {
      dispatch(
        showToast({ isOpen: true, type: "error", text: "Xoá thất bại" })
      );
    }
  }

  async function handleOk(data) {
    try {
      const { files, product, productId } = data;
      const formData = new FormData();
      let urlLists = [];
      for (const file of files) {
        formData.append("images", file);
      }
      const resUpload = await axiosRes().post(`${API_UPLOAD_URL}`, formData);
      urlLists = resUpload.items;
      const res = await axiosToken(token?.accessToken, dispatch, navigate).post(
        `${API_PRODUCT_IMAGE_URL}`,
        urlLists.map((item) => ({ productId, url: item.path }))
      );
      dispatch(
        addProductImages(res.items.map((item) => ({ ...item, product })))
      );
      dispatch(
        showToast({ isOpen: true, type: "success", text: "Upload thành công" })
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
        <Box display="flex">
          <button
            className="management-btn management-btn-add"
            onClick={() => setOpenModal(true)}
          >
            <AddIcon />
            Upload ảnh
          </button>
          <button
            className="management-btn management-btn-delete"
            style={{
              marginLeft: 8,
            }}
            onClick={() => {
              setOpenDialog(true);
            }}
          >
            <DeleteIcon />
            Xoá {selected.length !== 0 && `(${selected.length})`}
          </button>
        </Box>
        <Box display="flex" flexWrap="wrap">
          {productImages.map((item, index) => {
            const checked =
              selected.findIndex((el) => el.id === item.id) === -1;
            return (
              <div
                style={{
                  width: "25%",
                  height: 460,
                }}
                key={index}
                className="management-img-item"
              >
                <img
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                  }}
                  src={getURL(item.url)}
                  alt=""
                />
                <div
                  className="management-img-item-actions-wrapper"
                  style={{
                    display: selected.length === 0 ? "none" : "block",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => handleCheck(item)}
                    >
                      {checked ? (
                        <CheckBoxOutlineBlankIcon />
                      ) : (
                        <CheckBoxIcon />
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </Box>
      </Box>
      {openModal && (
        <ModalProductImage
          open={openModal}
          handleClose={() => setOpenModal(false)}
          handleOk={handleOk}
          title="Upload ảnh"
          isCloseAfterOk={true}
          labelOk="Upload"
          width={360}
        />
      )}
      {openDialog && (
        <ConfirmDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          title="Xác nhận"
          text="Bạn có chắc chắc muốn xoá"
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default ProductImageManagement;
