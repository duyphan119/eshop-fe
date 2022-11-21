import { Box, Grid } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { useSelector } from "react-redux";
import { formatInputDate, getURL, validateNumber } from "../../../utils";
import { MyModal } from "../../Modal";
import "../ModalAddUpdate.css";

const ModalDiscount = (props) => {
  const { handleOk, ...others } = props;

  const groupProducts = useSelector((state) => state.groupProduct.all);
  const current = useSelector((state) => state.discount.current);

  const [indexGroupProduct, setIndexGroupProduct] = useState(
    groupProducts.findIndex((item) => current && current.categoryId === item.id)
  );
  const [percent, setPercent] = useState(current ? current.percent : "");
  const [start, setStart] = useState(
    current ? current.start : formatInputDate(new Date())
  );
  const [end, setEnd] = useState(
    current
      ? current.end
      : formatInputDate(new Date(new Date().getTime + 1000 * 60 * 60 * 24))
  );
  const [fileBanner, setFileBanner] = useState();
  const [description, setDescription] = useState(
    current ? (current.description ? current.description : "") : ""
  );

  return (
    <MyModal
      {...others}
      handleOk={() => {
        if (indexGroupProduct !== -1 && validateNumber(percent))
          handleOk({
            description,
            banner: fileBanner
              ? URL.createObjectURL(fileBanner)
              : !current
              ? null
              : current.banner,
            fileBanner,
            groupProduct: groupProducts[indexGroupProduct],
            groupProductId: groupProducts[indexGroupProduct].id,
            percent,
            start,
            end,
          });
      }}
    >
      <Box p={1}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <div className="form-group">
              <label htmlFor="group-product">Chọn nhóm sản phẩm</label>
              <select
                id="group-product"
                value={indexGroupProduct}
                onChange={(e) => setIndexGroupProduct(e.target.value)}
              >
                <option value={-1}>Chọn nhóm sản phẩm</option>
                {groupProducts.map((item, index) => (
                  <option key={index} value={index}>
                    {item.id} - {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group mt-1">
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

ModalDiscount.propTypes = {
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

export default ModalDiscount;
