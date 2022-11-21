import { Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import Stars from "../Stars";
import RepliedComment from "../RepliedComment";
import { fromNow } from "../../utils";
import { configAxiosAll } from "../../config/configAxios";
import {
  API_COMMENT_PRODUCT_URL,
  API_REPLIED_COMMENT_URL,
} from "../../constants";
import { deleteComment, newRepliedComment } from "../../redux/commentSlice";
import ConfirmDialog from "../ConfirmDialog";

const Comment = ({ comment }) => {
  const user = useSelector((state) => state.auth.currentUser);

  const dispatch = useDispatch();

  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  async function handleOk(data) {
    const { content } = data;
    try {
      const res = await configAxiosAll(user, dispatch).post(
        `${API_REPLIED_COMMENT_URL}`,
        {
          comment_id: comment.id,
          content,
          user_id: user.id,
        }
      );
      dispatch(newRepliedComment({ ...res, user }));
      if (!showReplyForm) setShowReplyForm(true);
    } catch (error) {}
  }

  async function handleDelete() {
    try {
      await configAxiosAll(user, dispatch).delete(
        `${API_COMMENT_PRODUCT_URL}/${comment.id}`
      );
      dispatch(deleteComment(comment.id));
    } catch (error) {}
  }

  return (
    <Box fullWidth id={`comment${comment.id}`} className="comment">
      <Box display="flex" mt={1}>
        {/* <Box sx={{ width: 60 }}>
          <Avatar
            alt="avatar"
            src={comment.user?.avatar}
            sx={{ width: 48, height: 48 }}
            variant="square"
          />
        </Box> */}
        <Box flex={1}>
          <Box display="flex" alignItems="center">
            <Typography fontSize={16} mr={1}>
              {comment.user && comment.user.full_name}
            </Typography>
            <Stars fontSize="20px" rate={comment.rate} />
          </Box>

          <Box
            fontSize={12}
            fullWidth
            bgcolor="#f1f4f0"
            padding="8px"
            borderRadius="5px"
            marginTop="4px"
          >
            <span className="three-dot three-dot-3">{comment.content}</span>
          </Box>
          <Box>
            <Box display="flex">
              <Typography
                fontSize={12}
                sx={{ cursor: "pointer" }}
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                Phản hồi
              </Typography>
              <Typography ml={1} fontSize={12}>
                {fromNow(comment.createdAt)}
              </Typography>
              <Typography ml={1} fontSize={12} color="gray">
                {comment.createdAt !== comment.updatedAt ? "Đã chỉnh sửa" : ""}
              </Typography>
              <div
                className="hover-color-main-color"
                style={{
                  fontSize: 12,
                  marginLeft: 8,
                  color: "gray",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
                onClick={() => setShowDialog(true)}
              >
                Xoá
              </div>
            </Box>
            {comment.replied_comments &&
              comment.replied_comments.map((item, index) => {
                return <RepliedComment comment={item} key={index} />;
              })}

            {showDialog && (
              <ConfirmDialog
                open={showDialog}
                title="Xác nhận"
                text={`Bạn có chắc chắn muốn xoá bình luận "${
                  comment.content.length > 10
                    ? comment.content.substring(0, 10) + "..."
                    : comment.content
                }" này không?`}
                onConfirm={handleDelete}
                onClose={() => setShowDialog(false)}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Comment;
