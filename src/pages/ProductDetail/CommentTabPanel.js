import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";
import { Box, Divider } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { memo } from "react";
import { API_COMMENT_PRODUCT_URL, EXAMPLE_STARS_ARRAY } from "../../constants";
import { axiosToken } from "../../config/configAxios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import config from "../../config";
import { getProductDetailMyComment } from "../../redux/commentSlice";
import Comment from "./Comment";
import ConfirmDialog from "../../components/ConfirmDialog";

const CommentTabPanel = (props) => {
  const { cx, product } = props;

  const token = useSelector((state) => state.auth.token);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const comments = useSelector((state) => state.comment.productDetail.list);
  const myComment = useSelector(
    (state) => state.comment.productDetail.myComment
  );

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [rate, setRate] = useState(0);
  const [open, setOpen] = useState(false);

  const textareaRef = useRef();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.value = myComment ? myComment.content : "";
    }
    setRate(myComment ? myComment.rate : 0);
  }, [myComment]);

  async function handleSubmit(e) {
    e.preventDefault();
    // axiosToken();
    try {
      if (currentUser && textareaRef.current && rate !== 0) {
        let reqData = {
          content: textareaRef.current.value,
          rate,
          userId: currentUser.id,
          productId: product.id,
        };
        if (!myComment) {
          const res = await axiosToken(
            token?.accessToken,
            dispatch,
            navigate
          ).post(`${API_COMMENT_PRODUCT_URL}`, reqData);
          dispatch(
            getProductDetailMyComment({
              ...res,
              ...reqData,
              user: currentUser,
              product,
            })
          );
        } else {
          await axiosToken(token?.accessToken, dispatch, navigate).put(
            `${API_COMMENT_PRODUCT_URL}/${myComment.id}`,
            reqData
          );
          dispatch(
            getProductDetailMyComment({
              ...myComment,
              ...reqData,
            })
          );
        }
      }
    } catch (error) {}
  }
  function handleCheck(e) {
    if (e.target.checked) {
      setRate(e.target.value);
    }
  }

  async function handleDelete() {
    try {
      await axiosToken(token?.accessToken, dispatch, navigate).delete(
        `${API_COMMENT_PRODUCT_URL}/${myComment.id}`
      );
      dispatch(getProductDetailMyComment(null));
    } catch (error) {}
  }

  return (
    <>
      <Box p={1} className={cx("comment-wrapper")}>
        <Box className={cx("comments")}>
          <Box textAlign="center">
            {myComment ? comments.length + 1 : comments.length} ????NH GI??
          </Box>
          {myComment && (
            <>
              <Box>
                <Box mx={1}>????nh gi?? c???a b???n</Box>
                <Comment
                  comment={myComment}
                  cx={cx}
                  isShowDeleteIcon={true}
                  setOpen={setOpen}
                />
              </Box>
              <Divider sx={{ mx: 1, my: 3 }} />
            </>
          )}

          <Box>
            {comments.map((item, index) => {
              return (
                <Comment
                  comment={item}
                  key={index}
                  cx={cx}
                  isShowRepIcon={currentUser !== null}
                />
              );
            })}
          </Box>
        </Box>
        <Box
          className={cx("comment-form")}
          component="form"
          p={4}
          onSubmit={handleSubmit}
        >
          <Box className={cx("comment-form-title")} mb={1}>
            {myComment ? "S???a" : "Th??m"} ????nh gi??
          </Box>
          {token ? (
            <>
              <Box mb={2}>????nh gi?? c???a b???n</Box>
              <Box mb={2} className={cx("checkbox-list")}>
                {EXAMPLE_STARS_ARRAY.map((item, index) => (
                  <label
                    htmlFor={`checkbox${index}`}
                    key={index}
                    className={cx("checkbox-item")}
                  >
                    <input
                      type="checkbox"
                      id={`checkbox${index}`}
                      checked={`${rate}` === `${item}`}
                      value={item}
                      onChange={handleCheck}
                    />
                    <div className={cx("label")}>
                      {item}
                      <StarIcon
                        sx={{ transform: "translateY(1px)", fontSize: 14 }}
                      />
                    </div>
                  </label>
                ))}
              </Box>
              <Box mb={2}>Nh???n x??t c???a b???n *</Box>
              <Box mb={2} className={cx("content")}>
                <textarea ref={textareaRef} required rows={15}></textarea>
              </Box>
              <Box className={cx("btn-submit")}>
                <button type="submit">{myComment ? "S???a" : "G???i"}</button>
              </Box>
            </>
          ) : (
            <>
              <Link className={cx("login-link")} to={config.routes.login}>
                ????ng nh???p ????? ????nh gi??
              </Link>
            </>
          )}
        </Box>
      </Box>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        title="X??c nh???n"
        text={`B???n c?? ch???c ch???n mu???n xo?? ????nh gi?? n??y?`}
      />
    </>
  );
};

CommentTabPanel.propTypes = {
  cx: PropTypes.func,
  product: PropTypes.object,
};

export default memo(CommentTabPanel);
