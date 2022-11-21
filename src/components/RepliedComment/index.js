import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { configAxiosAll } from "../../config/configAxios";
import { API_REPLIED_COMMENT_URL } from "../../constants";
import {
  deleteRepliedComment,
  updateRepliedComment,
} from "../../redux/commentSlice";
import { fromNow } from "../../utils";
import ConfirmDialog from "../ConfirmDialog";

const RepliedComment = ({ comment }) => {
  const user = useSelector((state) => state.auth.currentUser);

  const dispatch = useDispatch();

  const [showDialog, setShowDialog] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  async function handleDelete() {
    try {
      await configAxiosAll(user, dispatch).delete(
        `${API_REPLIED_COMMENT_URL}/${comment.id}`
      );
      dispatch(
        deleteRepliedComment({ id: comment.id, commentId: comment.comment_id })
      );
    } catch (error) {}
  }

  async function handleUpdateRepliedComment(data) {
    const { content } = data;
    try {
      const res = await configAxiosAll(user, dispatch).put(
        `${API_REPLIED_COMMENT_URL}`,
        {
          id: comment.id,
          content,
        }
      );
      dispatch(updateRepliedComment(res));
    } catch (error) {}
  }

  return (
    <Box display="flex" mt={1} marginLeft="60px">
      <Box flex={1}>
        <Box display="flex" alignItems="center">
          <Typography fontSize={16} mr={1}>
            {comment.user?.full_name}
          </Typography>
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
        <Box display="flex">
          <Typography fontSize={12}>{fromNow(comment.createdAt)}</Typography>
          <Typography ml={1} fontSize={12} color="gray">
            {comment.createdAt !== comment.updatedAt ? "Đã chỉnh sửa" : ""}
          </Typography>
          {comment.user.id === user.id && (
            <>
              <div
                className="hover-color-main-color"
                style={{
                  fontSize: 12,
                  marginLeft: 8,
                  color: "gray",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
                onClick={() => setOpenModal(true)}
              >
                Sửa
              </div>
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
            </>
          )}
        </Box>
      </Box>

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
  );
};

export default RepliedComment;
