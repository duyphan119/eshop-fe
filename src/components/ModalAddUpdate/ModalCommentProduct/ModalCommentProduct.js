import { Box } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { EXAMPLE_STARS_ARRAY } from "../../../constants";
import { MyModal } from "../../Modal";
import styles from "./ModalCommentProduct.module.css";
import classNames from "classnames/bind";
import "../ModalAddUpdate.css";

const cx = classNames.bind(styles);

const ModalCommentProduct = (props) => {
  const { handleOk, ...others } = props;

  const current = useSelector((state) => state.commentProduct.current);

  const textareaRef = useRef();

  const [rate, setRate] = useState(0);

  useEffect(() => {
    textareaRef.current = current.content;
    setRate(current.rate);
  }, [current]);

  function handleCheck(e) {
    if (e.target.checked) {
      setRate(e.target.value);
    }
  }

  return (
    <MyModal
      {...others}
      handleOk={() => {
        handleOk({
          rate,
          content: textareaRef?.current?.value || "",
        });
      }}
    >
      <Box className={cx("comment-form")}>
        <Box mb={2}>Đánh giá của bạn</Box>
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
                <StarIcon sx={{ transform: "translateY(1px)", fontSize: 14 }} />
              </div>
            </label>
          ))}
        </Box>
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

ModalCommentProduct.propTypes = {
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

export default ModalCommentProduct;
