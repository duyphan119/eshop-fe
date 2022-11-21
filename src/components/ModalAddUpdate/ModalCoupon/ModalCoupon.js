import { Box, Grid } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { useSelector } from "react-redux";
import { formatInputDate, getURL } from "../../../utils";
import { MyModal } from "../../Modal";
import "../ModalAddUpdate.css";

const ModalCoupon = (props) => {
  const { handleOk, ...others } = props;

  const current = useSelector((state) => state.coupon.current);

  const [percent, setPercent] = useState(current ? current.percent : "");
  const [start, setStart] = useState(
    current
      ? formatInputDate(new Date(current.start))
      : formatInputDate(new Date())
  );
  const [end, setEnd] = useState(
    current
      ? formatInputDate(new Date(current.end))
      : formatInputDate(new Date(new Date().getTime + 1000 * 60 * 60 * 24))
  );
  const [fileBanner, setFileBanner] = useState();
  const [description, setDescription] = useState(
    current ? current.description || "" : ""
  );
  const [code, setCode] = useState(current ? current.code || "" : "");
  const [name, setName] = useState(current ? current.name || "" : "");

  return (
    <MyModal
      {...others}
      handleOk={() => {
        handleOk({
          description,
          banner: fileBanner
            ? URL.createObjectURL(fileBanner)
            : !current
            ? null
            : current.banner,
          fileBanner,
          percent,
          start,
          end,
          name,
          code,
        });
      }}
    >
      <Box p={1}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <div className="form-group">
              <label htmlFor="percent">Phần trăm</label>
              <input
                required
                placeholder="Nhập phần trăm"
                id="percent"
                value={percent}
                onChange={(e) => {
                  setPercent(e.target.value);
                }}
              />
            </div>
            <div className="form-group mt-1">
              <label htmlFor="percent">Mã áp dụng</label>
              <input
                required
                placeholder="Nhập mã áp dụng"
                id="code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                }}
              />
            </div>
            <div className="form-group mt-1">
              <label htmlFor="start">Bắt đầu</label>
              <input
                required
                type="date"
                placeholder="Chọn thời gian"
                id="start"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div className="form-group mt-1">
              <label htmlFor="end">Kết thúc</label>
              <input
                required
                type="date"
                placeholder="Chọn thời gian"
                id="end"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className="form-group">
              <label htmlFor="percent">Tên ưu dãi</label>
              <input
                required
                placeholder="Nhập tên ưu đãi"
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div className="form-group mt-1">
              <label htmlFor="description">Mô tả</label>
              <textarea
                placeholder="Nhập mô tả"
                id="description"
                value={description}
                rows={5}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className="form-group">
              <label htmlFor="label">Hình ảnh quảng cáo</label>
              <input
                type="file"
                id="file"
                hidden
                onChange={(e) => setFileBanner(e.target.files[0])}
              />
              <label className="banner-group-product" htmlFor="file">
                {fileBanner ? (
                  <img alt="" src={URL.createObjectURL(fileBanner)} />
                ) : current && current.banner ? (
                  <img alt="" src={getURL(current.banner)} />
                ) : (
                  "Chọn hình ảnh quảng cáo"
                )}
              </label>
            </div>
          </Grid>
        </Grid>
      </Box>
    </MyModal>
  );
};

ModalCoupon.propTypes = {
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

export default ModalCoupon;
