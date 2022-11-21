import { Box, Grid } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { useSelector } from "react-redux";
import { MyModal } from "../../Modal";
import "../ModalAddUpdate.css";

const ModalColor = (props) => {
  const { handleOk, ...others } = props;

  const current = useSelector((state) => state.color.current);

  const [value, setValue] = useState(current ? current.name : "");
  const [shortValue, setShortValue] = useState(
    current ? current.shortValue : ""
  );

  return (
    <MyModal
      {...others}
      handleOk={() => {
        handleOk({
          value,
          shortValue,
        });
      }}
    >
      <Box p={1}>
        <Grid container>
          <Grid item xs={12}>
            <div className="form-group">
              <label htmlFor="value">Tên màu sắc</label>
              <input
                required
                placeholder="Nhập tên màu sắc"
                id="value"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                }}
              />
            </div>
            <div className="form-group mt-1">
              <label htmlFor="shortValue">Tên viết tắt</label>
              <input
                required
                placeholder="Nhập tên viết tắt"
                id="shortValue"
                value={shortValue}
                onChange={(e) => {
                  setShortValue(e.target.value);
                }}
              />
            </div>
          </Grid>
        </Grid>
      </Box>
    </MyModal>
  );
};

ModalColor.propTypes = {
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

export default ModalColor;
