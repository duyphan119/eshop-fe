import { Box, Button, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Comment from "../Comment";
import { SocketContext } from "../../context";
import {
  API_COMMENT_PRODUCT_URL,
  API_NOTIFICATION_URL,
  LIMIT_COMMENT,
} from "../../constants";
import { configAxiosAll, axiosRes } from "../../config/configAxios";
import { isShowCollapse, isShowLoadMore } from "../Button";
import { getComment } from "../../redux/commentSlice";

const Comments = ({ product }) => {
  const socket = useContext(SocketContext);

  const user = useSelector((state) => state.auth.currentUser);
  const comment = useSelector((state) => state.comment.comment);

  const dispatch = useDispatch();

  const [myComment, setMyComment] = useState();
  const [limit, setLimit] = useState(LIMIT_COMMENT);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async function () {
      try {
        const data1 = await axiosRes().get(
          `${API_COMMENT_PRODUCT_URL}/product/${product.id}?limit=${limit}`
        );
        dispatch(getComment(data1));
        const data2 = await axiosRes().get(
          `${API_COMMENT_PRODUCT_URL}/user/${user.id}/product/${product.id}`
        );
        setMyComment(data2);
      } catch (error) {}
    })();
  }, [dispatch, limit, user, product.id]);

  async function handleOk(data) {
    try {
      const { rate, content } = data;
      const reqComment = {
        rate,
        content,
        user_id: user.id,
        product_id: product.id,
      };
      if (myComment) {
        // Sửa comment
        const res = await configAxiosAll(user, dispatch).put(
          `${API_COMMENT_PRODUCT_URL}`,
          { ...reqComment, id: myComment.id }
        );
        setMyComment(res);
      } else {
        // Thêm comment
        const res = await configAxiosAll(user, dispatch).post(
          `${API_COMMENT_PRODUCT_URL}`,
          reqComment
        );
        setMyComment(res);
      }
      const notify = await configAxiosAll(user, dispatch).post(
        `${API_NOTIFICATION_URL}`,
        {
          title: `${user.full_name} đã đánh giá sản phẩm`,
          href: `/dashboard/comment`,
          isRead: false,
          sender_id: user.id,
          notify_type: "comment",
        }
      );
      socket.emit("send-notify", {
        roomId: "admin",
        ...notify,
      });
    } catch (error) {}
  }

  if (!user)
    return (
      <Box fullWidth display="flex" alignItems="center" flexDirection="column">
        <Box mt={1}>Đăng nhập để bình luận</Box>
        <Box mt={1} mb={1}>
          <Button variant="contained">
            <Link
              to="/login"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Đăng nhập
            </Link>
          </Button>
        </Box>
      </Box>
    );
  return (
    <Box>
      {/* {user && user.role && user.role.role === "user" && (
        <div className="my-2 text-center">
          <Button variant="contained">
            {myComment ? "Thay đổi đánh giá của bạn" : "Viết đánh giá của bạn"}
          </Button>
        </div>
      )} */}
      <Typography variant="h4" mt={1}>
        Đánh giá
      </Typography>
      {user && user.role && user.role.role !== "admin" && (
        <Box fullWidth textAlign="center" mt={2}>
          <Button variant="contained" onClick={() => setOpen(!open)}>
            {myComment ? "Sửa đánh giá của bạn" : "Viết đánh giá của bạn"}
          </Button>
        </Box>
      )}

      {/* <RenderComments product={product} /> */}
      {/* <Box fullWidth textAlign="center" mt={2}>
        <Button variant="contained">Xem thêm</Button>
      </Box> */}
      {myComment && <Comment comment={myComment} />}
      {comment &&
        comment.items &&
        comment.items.map((item, index) =>
          myComment && item.id === myComment.id ? (
            ""
          ) : (
            <Comment comment={item} key={index} />
          )
        )}
      <Box display="flex" justifyContent="center">
        {isShowLoadMore(comment, LIMIT_COMMENT, () =>
          setLimit(limit + LIMIT_COMMENT)
        )}
        {isShowCollapse(comment, LIMIT_COMMENT, () => setLimit(LIMIT_COMMENT))}
      </Box>
    </Box>
  );
};

// const RenderComments = memo(({ product }) => {
//   return (
//     <>
//       {product?.comments?.map((item) => {
//         return <Comment comment={item} key={item.id + Math.random()} />;
//       })}
//     </>
//   );
// });

export default Comments;
