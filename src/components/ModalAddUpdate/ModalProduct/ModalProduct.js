import { Box, Grid } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { useSelector } from "react-redux";
import { getURL, toSlug, validateNumber } from "../../../utils";
import { MyModal } from "../../Modal";
import "../ModalAddUpdate.css";

const ModalProduct = (props) => {
  const { handleOk, ...others } = props;

  const groupProducts = useSelector((state) => state.groupProduct.all);
  const current = useSelector((state) => state.product.current);

  const [indexGroupProduct, setIndexGroupProduct] = useState(
    groupProducts.findIndex(
      (item) => current && current.groupProductId === item.id
    )
  );
  const [name, setName] = useState(current ? current.name : "");
  const [initPrice, setInitPrice] = useState(current ? current.initPrice : "");
  const [newPrice, setNewPrice] = useState(
    current ? (current.newPrice ? current.newPrice : "") : ""
  );
  const [file, setFile] = useState();
  const [slug, setSlug] = useState(current ? current.slug : "");

  return (
    <MyModal
      {...others}
      handleOk={() => {
        if (
          validateNumber(initPrice) &&
          (validateNumber(newPrice) || newPrice === "") &&
          indexGroupProduct !== -1
        )
          handleOk({
            name,
            initPrice,
            newPrice,
            slug,
            avatar: file ? URL.createObjectURL(file) : current.avatar,
            file,
            groupProduct: groupProducts[indexGroupProduct],
            groupProductId: groupProducts[indexGroupProduct].id,
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
                onChange={(e) => {
                  setIndexGroupProduct(e.target.value);
                  setName(groupProducts[e.target.value].name);
                }}
              >
                <option value={-1}>Chọn nhóm sản phẩm</option>
                {groupProducts.map((item, index) => (
                  <option key={index} value={index}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group mt-1">
              <label htmlFor="name">Tên sản phẩm</label>
              <input
                required
                placeholder="Nhập tên sản phẩm"
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSlug(toSlug(e.target.value));
                }}
              />
            </div>
            <div className="form-group mt-1">
              <label htmlFor="initPrice">Giá ban đầu</label>
              <input
                required
                placeholder="Nhập giá ban đầu"
                id="initPrice"
                value={initPrice}
                onChange={(e) => setInitPrice(e.target.value)}
              />
            </div>
            <div className="form-group mt-1">
              <label htmlFor="name">Giá mới</label>
              <input
                placeholder="Nhập giá mới (nếu có)"
                id="newPrice"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
              />
            </div>
            <div className="form-group mt-1">
              <label htmlFor="slug">Slug</label>
              <input
                required
                placeholder="Nhập slug"
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className="form-group">
              <label htmlFor="label">Hình đại diện</label>
              <input
                required={current === null}
                type="file"
                id="file"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />
              <label className="avatar-product" htmlFor="file">
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

ModalProduct.propTypes = {
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

export default ModalProduct;
