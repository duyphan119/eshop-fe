import { Box, Grid } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { useSelector } from "react-redux";
import { MyModal } from "../../Modal";

import "../ModalAddUpdate.css";
const ModalRole = (props) => {
  const { handleOk, ...others } = props;

  const current = useSelector((state) => state.role.current);

  const [role, setRole] = useState(current ? current.role : "");

  return (
    <MyModal
      {...others}
      handleOk={() => {
        handleOk({
          role,
        });
      }}
    >
      <Box p={1}>
        <Grid container>
          <Grid item xs={12}>
            <div className="form-group">
              <label htmlFor="role">Quyền</label>
              <input
                required
                placeholder="Nhập quyền"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
          </Grid>
        </Grid>
      </Box>
    </MyModal>
  );
};

ModalRole.propTypes = {
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

export default ModalRole;
