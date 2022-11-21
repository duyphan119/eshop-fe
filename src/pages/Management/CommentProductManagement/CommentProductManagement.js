// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Avatar, Box, IconButton, Paper, Tooltip } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ConfirmDialog from "../../../components/ConfirmDialog";
import {
  ModalCommentProduct,
  ModalRepCommentProduct,
} from "../../../components/ModalAddUpdate";

import Stars from "../../../components/Stars";
import { axiosRes, axiosToken } from "../../../config/configAxios";
import {
  API_COLOR_URL,
  API_COMMENT_PRODUCT_URL,
  API_REPLIED_COMMENT_URL,
  // LIMIT_ROW_COMMENT_PRODUCT,
} from "../../../constants";
import { setCurrentUser } from "../../../redux/authSlice";

import {
  getCurrentRepCommentProduct,
  deleteCommentProduct,
  getAllCommentProducts,
  getCurrentCommentProduct,
  updateCommentProduct,
  updateRepCommentProduct,
  newRepCommentProduct,
  deleteRepCommentProduct,
  addCommentProduct,
} from "../../../redux/commentProductSlice";
import { showToast } from "../../../redux/toastSlice";
import { formatDateTimeVN, getURL } from "../../../utils";
import "../Management.css";
const CommentProductManagement = () => {
  const commentProducts = useSelector((state) => state.commentProduct.list);
  const current = useSelector((state) => state.commentProduct.current);
  const currentRep = useSelector((state) => state.commentProduct.currentRep);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const token = useSelector((state) => state.auth.token);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const textareaRef = useRef();

  const [id, setId] = useState(null);
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openDialog1, setOpenDialog1] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);

  useEffect(() => {
    const promises = [];
    promises.push(axiosRes().get(`${API_COMMENT_PRODUCT_URL}`));
    Promise.allSettled(promises)
      .then((listRes) => {
        if (listRes[0].status === "fulfilled") {
          dispatch(getAllCommentProducts(listRes[0].value.items));
        }
      })
      .catch((err) => {});
  }, [dispatch]);

  async function handleOk1(data) {
    try {
      if (current) {
        await axiosToken(token?.accessToken, dispatch, navigate).put(
          `${API_COMMENT_PRODUCT_URL}/${current.id}`,
          data
        );
        dispatch(updateCommentProduct({ ...current, ...data }));
        dispatch(
          showToast({
            isOpen: true,
            text: "Sửa thành công",
            type: "success",
          })
        );
      } else {
        await axiosToken(token?.accessToken, dispatch, navigate).post(
          `${API_COLOR_URL}/${current.id}`,
          data
        );
        dispatch(addCommentProduct({ ...current, ...data }));
      }
    } catch (error) {}
  }
  async function handleOk2(data) {
    try {
      if (currentRep) {
        await axiosToken(token?.accessToken, dispatch, navigate).put(
          `${API_REPLIED_COMMENT_URL}/${currentRep.id}`,
          data
        );

        dispatch(updateRepCommentProduct({ ...currentRep, ...data }));
        dispatch(
          showToast({
            isOpen: true,
            text: "Sửa thành công",
            type: "success",
          })
        );
      } else {
        const res = await axiosToken(
          token?.accessToken,
          dispatch,
          navigate
        ).post(`${API_REPLIED_COMMENT_URL}`, data);
        dispatch(newRepCommentProduct({ ...data, ...res.item }));
        setId(null);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDelete1() {
    try {
      if (current) {
        await axiosToken(token?.accessToken, dispatch, navigate).delete(
          `${API_COMMENT_PRODUCT_URL}/${current.id}`
        );
        dispatch(deleteCommentProduct(current.id));
      }
    } catch (error) {}
  }

  async function handleDelete2() {
    try {
      if (currentRep) {
        await axiosToken(token?.accessToken, dispatch, navigate).delete(
          `${API_REPLIED_COMMENT_URL}/${currentRep.id}`
        );
        dispatch(deleteRepCommentProduct(currentRep.id));
      }
    } catch (error) {}
  }

  return (
    <>
      <Box bgcolor="#fff" p={1}>
        <Box m={1}>
          {commentProducts.map((item, index) => (
            <Paper key={index} my={1}>
              <Box
                display="flex"
                justifyContent="space-between"
                fontSize={14}
                p={1}
              >
                <Box display="flex">
                  <Box>
                    <Avatar
                      src={getURL(item.user.avatar)}
                      alt={item.user.fullName}
                    />
                  </Box>
                  <Box ml={1}>
                    <Box>
                      {item.user.fullName} - {formatDateTimeVN(item.createdAt)}
                    </Box>
                    <Box>
                      <Stars rate={item.rate} fontSize={14} />
                    </Box>
                    <Box fontSize={12}>{item.content}</Box>
                    <Box fontSize={12} display="flex">
                      <Box
                        sx={{ textDecoration: "underline", cursor: "pointer" }}
                        onClick={() => {
                          setOpenModal1(true);
                          dispatch(getCurrentCommentProduct(item));
                        }}
                      >
                        Sửa
                      </Box>
                      <Box
                        ml={2}
                        color="red"
                        sx={{ textDecoration: "underline", cursor: "pointer" }}
                        onClick={() => {
                          setOpenDialog1(true);
                          dispatch(getCurrentCommentProduct(item));
                        }}
                      >
                        Xoá
                      </Box>
                      <Box
                        onClick={() => {
                          dispatch(getCurrentCommentProduct(item));
                          setId(id !== item.id ? item.id : null);
                        }}
                        sx={{ textDecoration: "underline", cursor: "pointer" }}
                        ml={2}
                      >
                        Phản hồi ({item?.repComments?.length})
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center">
                  <img alt="" src={getURL(item.product.avatar)} height="50" />
                  <Box mx={1}>{item.product.name}</Box>
                  <Tooltip title="Đến trang chi tiết sản phẩm">
                    <Link to={`/${item.product.slug}`}>
                      <IconButton size="small">
                        <OpenInNewIcon />
                      </IconButton>
                    </Link>
                  </Tooltip>
                </Box>
              </Box>
              {id && item.id === id && (
                <Box fontSize={14} p={1} pl={7}>
                  <textarea
                    ref={textareaRef}
                    style={{
                      width: "100%",
                      display: "block",
                      outline: "none",
                      border: "1px solid #000",
                    }}
                    rows={3}
                    placeholder="Nhập phản hồi"
                  ></textarea>
                  <button
                    style={{
                      marginTop: 8,
                      cursor: "pointer",
                      backgroundColor: "var(--main-color)",
                      border: "none",
                      color: "#fff",
                      padding: "6px 16px",
                      fontSize: 12,
                    }}
                    onClick={() =>
                      handleOk2({
                        commentId: current.id,
                        productId: current.productId,
                        content: textareaRef.current?.value || "",
                        userId: currentUser.id,
                        user: currentUser,
                      })
                    }
                  >
                    Gửi
                  </button>
                </Box>
              )}

              {item.repComments.map((element, i) => (
                <Box
                  key={i}
                  display="flex"
                  justifyContent="space-between"
                  fontSize={14}
                  p={1}
                  pl={7}
                >
                  <Box display="flex">
                    <Box>
                      <Avatar
                        src={getURL(element.user.avatar)}
                        alt={element.user.fullName}
                      />
                    </Box>
                    <Box ml={1}>
                      <Box>
                        {element.user.fullName} -{" "}
                        {formatDateTimeVN(element.createdAt)}
                      </Box>
                      <Box>
                        <Stars rate={element.rate} fontSize={14} />
                      </Box>
                      <Box fontSize={12}>{element.content}</Box>
                      <Box fontSize={12} display="flex">
                        <Box
                          onClick={() => {
                            setOpenModal2(true);
                            dispatch(getCurrentCommentProduct(item));
                            dispatch(getCurrentRepCommentProduct(element));
                          }}
                          sx={{
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                        >
                          Sửa
                        </Box>
                        <Box
                          ml={2}
                          color="red"
                          sx={{
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            dispatch(getCurrentCommentProduct(item));
                            setOpenDialog2(true);
                            dispatch(getCurrentRepCommentProduct(element));
                          }}
                        >
                          Xoá
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Paper>
          ))}
        </Box>
      </Box>
      {openModal1 && (
        <ModalCommentProduct
          open={openModal1}
          handleClose={() => setOpenModal1(false)}
          isCloseAfterOk={true}
          labelOk="Sửa"
          handleOk={handleOk1}
          title="Sửa đánh giá"
          height={560}
        />
      )}
      {openModal2 && (
        <ModalRepCommentProduct
          open={openModal2}
          handleClose={() => setOpenModal2(false)}
          isCloseAfterOk={true}
          labelOk="Sửa"
          handleOk={handleOk2}
          title="Sửa phản hồi đánh giá"
        />
      )}
      {openDialog1 && (
        <ConfirmDialog
          open={openDialog1}
          onClose={() => setOpenDialog1(false)}
          text="Bạn có chắc chắn muốn xoá ?"
          title="Xác nhận"
          onConfirm={handleDelete1}
        />
      )}
      {openDialog2 && (
        <ConfirmDialog
          open={openDialog2}
          onClose={() => setOpenDialog2(false)}
          text="Bạn có chắc chắn muốn xoá ?"
          title="Xác nhận"
          onConfirm={handleDelete2}
        />
      )}
      {/* {openModal && (
        <ModalSize
          width={360}
          open={openModal}
          handleClose={() => setOpenModal(false)}
          handleOk={handleOk}
          labelOk={current ? "Sửa" : "Thêm"}
          title={current ? "Sửa đánh giá" : "Thêm đánh giá"}
          isCloseAfterOk={current !== null}
        />
      )}
    */}
    </>
  );
};

export default CommentProductManagement;
