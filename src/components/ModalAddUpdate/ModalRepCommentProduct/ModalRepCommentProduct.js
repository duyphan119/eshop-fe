import { Box } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { MyModal } from "../../Modal";
import styles from "./ModalRepCommentProduct.module.css";
import classNames from "classnames/bind";

import "../ModalAddUpdate.css";

const cx = classNames.bind(styles);
const ModalRepCommentProduct = (props) => {
  const { handleOk, ...others } = props;

  const current = useSelector((state) => state.commentProduct.currentRep);

  const textareaRef = useRef();

  useEffect(() => {
    textareaRef.current = current.content;
  }, [current]);

  return (
    <MyModal
      {...others}
      handleOk={() => {
        handleOk({
          content: textareaRef?.current?.value || "",
        });
      }}
    >
      <Box className={cx("comment-form")}>
        <Box mb={2}>Nhận xét của bạn *</Box>
        <Box mb={2} className={cx("content")}>
          <textarea
            defaultValue={current?.content || ""}
            ref={textareaRef}
            required
            rows={15}
          ></textarea>
        </Box>
      </Box>
    </MyModal>
  );
};

ModalRepCommentProduct.propTypes = {
  open: PropTypes.bool,
  handleOk: PropTypes.func,
  handleClose: PropTypes.func,
  isCloseAfterOk: PropTypes.bool,
  title: PropTypes.string,
  labelOk: PropTypes.string,
  children: PropTypes.node,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ModalRepCommentProduct;
