import { Box, Grid } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { useSelector } from "react-redux";
import { MyModal } from "../../Modal";
import "../ModalAddUpdate.css";

const ModalProductImage = (props) => {
  const { handleOk, ...others } = props;

  const products = useSelector((state) => state.product.list);

  const [files, setFiles] = useState();
  const [indexProduct, setIndexProduct] = useState(-1);

  return (
    <MyModal
      {...others}
      handleOk={() => {
        handleOk({
          files,
          productId: products[indexProduct].id,
          product: products[indexProduct],
        });
      }}
    >
      <Box p={1}>
        <Grid container>
          <Grid item xs={12}>
            <div className="form-group">
              <label htmlFor="product">Chọn sản phẩm</label>
              <select
                id="product"
                value={indexProduct}
                onChange={(e) => setIndexProduct(e.target.value)}
              >
                <option value={-1}>Chọn sản phẩm</option>
                {products.map((item, index) => (
                  <option key={index} value={index}>
                    {item.id} - {item.name}
                  </option>
                ))}
              </select>
            </div>
          </Grid>
          <Grid item xs={12}>
            <input
              type="file"
              className="mt-1"
              multiple
              files={files}
              onChange={(e) => setFiles(e.target.files)}
            />
          </Grid>
        </Grid>
      </Box>
    </MyModal>
  );
};

ModalProductImage.propTypes = {
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

export default ModalProductImage;
