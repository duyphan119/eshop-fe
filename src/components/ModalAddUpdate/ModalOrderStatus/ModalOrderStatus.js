import { Box, Grid } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { useSelector } from "react-redux";
import { MyModal } from "../../Modal";
import "../ModalAddUpdate.css";

const ModalOrderStatus = (props) => {
  const { handleOk, ...others } = props;

  const current = useSelector((state) => state.orderStatus.current);

  const [name, setName] = useState(current ? current.name : "");
  const [type, setType] = useState(current ? current.type : "");
  const [userIsAllowedDelete, setUserIsAllowedDelete] = useState(
    current ? current.userIsAllowedDelete : ""
  );

  return (
    <MyModal
      {...others}
      handleOk={() => {
        handleOk({
          name,
          type,
          userIsAllowedDelete,
        });
      }}
    >
      <Box p={1}>
        <Grid container>
          <Grid item xs={12}>
            <div className="form-group">
              <label htmlFor="name">Tên trạng thái</label>
              <input
                required
                placeholder="Nhập tên trạng thái"
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>{" "}
            <div className="form-group">
              <label htmlFor="userIsAllowedDelete">Cho phép huỷ đơn hàng</label>
              <select
                id="userIsAllowedDelete"
                value={userIsAllowedDelete}
                onChange={(e) => setUserIsAllowedDelete(e.target.value)}
              >
                <option value={false}>Không</option>
                <option value={true}>Có</option>
              </select>
            </div>
            <div className="form-group mt-1">
              <label htmlFor="product">Kiểu trạng thái</label>
              <select
                id="product"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="default">Default</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="error">Error</option>
              </select>
            </div>
          </Grid>
        </Grid>
      </Box>
    </MyModal>
  );
};

ModalOrderStatus.propTypes = {
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

export default ModalOrderStatus;
