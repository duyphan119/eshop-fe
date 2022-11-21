import React, { memo, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import ReplyIcon from "@mui/icons-material/Reply";
import PropTypes from "prop-types";
import { Avatar, Box, Tooltip } from "@mui/material";
import Stars from "../../components/Stars";
import { fromNow, getURL } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { axiosToken } from "../../config/configAxios";
import { useNavigate } from "react-router-dom";
import { API_REPLIED_COMMENT_URL } from "../../constants";
import {
  deleteRepCommentProduct,
  getCurrentRepCommentProduct,
} from "../../redux/commentProductSlice";

const Comment = (props) => {
  const {
    comment,
    cx,
    setOpen,
    isShowEditIcon,
    isShowDeleteIcon,
    isShowRepIcon,
  } = props;

  const currentUser = useSelector((state) => state.auth.currentUser);
  const currentRep = useSelector((state) => state.comment.currentRep);
  const token = useSelector((state) => state.auth.token);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [showRepForm, setShowRepForm] = useState(false);

  const textareaRef = useRef();

  console.log({ comment });

  async function handleRepComment() {
    try {
      if (textareaRef.current) {
        const reqData = {
          content: textareaRef.current.value,
          userId: currentUser.id,
          commentId: comment.id,
        };
        const res = await axiosToken(
          token?.accessToken,
          dispatch,
          navigate
        ).post(`${API_REPLIED_COMMENT_URL}`, reqData);
        console.log({ res });
      }
    } catch (err) {}
  }

  return (
    <>
      <Box
        m={1}
        p={1}
        bgcolor="rgb(245,245,245)"
        display="flex"
        borderRadius="5px"
      >
        <Box width={40} maxWidth={40}>
          <Avatar
            src={getURL(comment.user.avatar)}
            alt=""
            sx={{ width: 40, height: 40 }}
          />
        </Box>
        <Box ml={1} flex={1}>
          <Box display="flex" width="100%" justifyContent="space-between">
            <Box>
              {comment.user.fullName}
              <Box display="flex" alignItems="center">
                <Stars rate={comment.rate} fontSize={14} />
                <Box ml={1} fontSize={12}>
                  {fromNow(comment.createdAt)}
                </Box>
              </Box>
            </Box>
            <Box display="flex" className={cx("comment-action")}>
              {isShowRepIcon && (
                <span onClick={() => setShowRepForm(!showRepForm)}>
                  <Tooltip title="Phản hồi đánh giá">
                    <ReplyIcon fontSize="small" />
                  </Tooltip>
                </span>
              )}
              {isShowEditIcon && (
                <span>
                  <Tooltip title="Sửa đánh giá">
                    <EditIcon fontSize="small" />
                  </Tooltip>
                </span>
              )}
              {isShowDeleteIcon && (
                <span onClick={setOpen}>
                  <Tooltip title="Xoá đánh giá">
                    <CloseIcon fontSize="small" />
                  </Tooltip>
                </span>
              )}
            </Box>
          </Box>

          <Box mt={1} fontSize={14}>
            {comment.content}
          </Box>
        </Box>
      </Box>
      {comment.repComments.map((item, index) => (
        <Box
          m={1}
          p={1}
          ml={8}
          bgcolor="rgb(245,245,245)"
          display="flex"
          borderRadius="5px"
        >
          <Box width={40} maxWidth={40}>
            <Avatar
              src={getURL(item.user.avatar)}
              alt=""
              sx={{ width: 40, height: 40 }}
            />
          </Box>
          <Box ml={1} flex={1}>
            <Box display="flex" width="100%" justifyContent="space-between">
              <Box>
                {item.user.fullName}
                <Box fontSize={12}>{fromNow(item.createdAt)}</Box>
              </Box>
              <Box display="flex" className={cx("comment-action")}>
                {isShowEditIcon && (
                  <span>
                    <Tooltip title="Sửa đánh giá">
                      <EditIcon fontSize="small" />
                    </Tooltip>
                  </span>
                )}
                <span
                  onClick={() => {
                    console.log({ item });
                    dispatch(getCurrentRepCommentProduct(item));
                    dispatch(deleteRepCommentProduct(currentRep.id));
                  }}
                >
                  <Tooltip title="Xoá đánh giá">
                    <CloseIcon fontSize="small" />
                  </Tooltip>
                </span>
              </Box>
            </Box>

            <Box mt={1} fontSize={14}>
              {item.content}
            </Box>
          </Box>
        </Box>
      ))}
      {showRepForm && (
        <Box ml={8} pr={1}>
          <textarea
            ref={textareaRef}
            rows={3}
            className={cx("rep-textarea")}
          ></textarea>
          <button className={cx("rep-button")} onClick={handleRepComment}>
            Gửi
          </button>
        </Box>
      )}
    </>
  );
};

Comment.propTypes = {
  comment: PropTypes.object,
  cx: PropTypes.func,
  setOpen: PropTypes.func,
  isShowEditIcon: PropTypes.bool,
  isShowDeleteIcon: PropTypes.bool,
  isShowRepIcon: PropTypes.bool,
};

export default memo(Comment);
