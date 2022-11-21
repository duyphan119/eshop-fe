import { Box, Grid } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { useSelector } from "react-redux";
import { getSku, getURL } from "../../../utils";
import { MyModal } from "../../Modal";
import "../ModalAddUpdate.css";

const ModalProductDetail = (props) => {
  const { handleOk, ...others } = props;

  const current = useSelector((state) => state.productDetail.current);
  const products = useSelector((state) => state.product.list);
  const colors = useSelector((state) => state.color.list);
  const sizes = useSelector((state) => state.size.list);

  const [indexProduct, setIndexProduct] = useState(
    current ? products.findIndex((item) => item.id === current.productId) : -1
  );
  const [indexColor, setIndexColor] = useState(
    current ? colors.findIndex((item) => item.id === current.colorId) : -1
  );
  const [indexSize, setIndexSize] = useState(
    current ? sizes.findIndex((item) => item.id === current.sizeId) : -1
  );
  const [sku, setSku] = useState(current ? current.sku : "");
  const [amount, setAmount] = useState(current ? current.amount : "");
  const [file, setFile] = useState();

  return (
    <MyModal
      {...others}
      handleOk={() => {
        handleOk({
          colorId: colors[indexColor].id,
          sizeId: sizes[indexSize].id,
          productId: products[indexProduct].id,
          color: colors[indexColor],
          size: sizes[indexSize],
          product: products[indexProduct],
          sku,
          amount,
          file,
          avatar: file ? URL.createObjectURL(file) : current.avatar,
        });
      }}
    >
      <Box p={1}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <div className="form-group">
              <label htmlFor="product">Chọn sản phẩm</label>
              <select
                id="product"
                value={indexProduct}
                onChange={(e) => {
                  setIndexProduct(e.target.value);
                  setSku(
                    getSku(
                      products[e.target.value].groupProduct,
                      products[e.target.value],
                      colors[indexColor],
                      sizes[indexSize]
                    )
                  );
                }}
              >
                <option value={-1}>Chọn sản phẩm</option>
                {products.map((item, index) => (
                  <option key={index} value={index}>
                    {item.id} - {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group mt-1">
              <label htmlFor="color">Chọn màu sắc</label>
              <select
                id="color"
                value={indexColor}
                onChange={(e) => {
                  setIndexColor(e.target.value);
                  setSku(
                    getSku(
                      products[indexProduct].groupProduct,
                      products[indexProduct],
                      colors[e.target.value],
                      sizes[indexSize]
                    )
                  );
                }}
              >
                <option value={-1}>Chọn màu sắc</option>
                {colors.map((item, index) => (
                  <option key={index} value={index}>
                    {item.id} - {item.value}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group mt-1">
              <label htmlFor="size">Chọn kích cỡ</label>
              <select
                id="size"
                value={indexSize}
                onChange={(e) => {
                  setIndexSize(e.target.value);
                  setSku(
                    getSku(
                      products[indexProduct].groupProduct,
                      products[indexProduct],
                      colors[indexColor],
                      sizes[e.target.value]
                    )
                  );
                }}
              >
                <option value={-1}>Chọn kích cỡ</option>
                {sizes.map((item, index) => (
                  <option key={index} value={index}>
                    {item.id} - {item.value}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group mt-1">
              <label htmlFor="sku">SKU</label>
              <input
                required
                placeholder="Nhập SKU"
                id="sku"
                value={sku}
                onChange={(e) => {
                  setSku(e.target.value);
                }}
              />
            </div>
            <div className="form-group mt-1">
              <label htmlFor="amount">Số lượng tồn</label>
              <input
                required
                placeholder="Nhập số lượng tồn"
                id="amount"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
              />
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className="form-group">
              <label htmlFor="label">Hình đại diện</label>
              <input
                required={current === null}
                type="file"
                id="file"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />
              <label className="avatar-product-detail" htmlFor="file">
                {file ? (
                  <img alt="" src={URL.createObjectURL(file)} />
                ) : current ? (
                  <img alt="" src={getURL(current.avatar)} />
                ) : (
                  "Chọn hình ảnh"
                )}
              </label>
            </div>
          </Grid>
        </Grid>
      </Box>
    </MyModal>
  );
};

ModalProductDetail.propTypes = {
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

export default ModalProductDetail;
