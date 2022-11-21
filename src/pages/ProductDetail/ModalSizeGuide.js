import { Box, Grid, Typography } from "@mui/material";
import Modal from "../../components/Modal";
import { formatHeightGuide, formatWeightGuide } from "../../utils";

const ModalSizeGuide = ({ open, handleClose, category }) => {
  return (
    <Modal open={open} handleClose={handleClose}>
      <Box sx={{ p: 3 }}>
        <Typography
          sx={{ textTransform: "uppercase" }}
          variant="h5"
          color="var(--main-color)"
          textAlign="center"
        >
          HƯỚNG DẪN CHỌN SIZE
        </Typography>
        <Typography
          sx={{ textTransform: "capitalize" }}
          variant="h6"
          textAlign="center"
          fontWeight={600}
          py={2}
        >
          {category.name}
        </Typography>
        <Box sx={{ border: "0.5px solid lightgray" }}>
          <Grid container>
            <Grid xs={2} item>
              <div className="cell cell-bold">Size</div>
            </Grid>
            <Grid xs={5} item>
              <div className="cell cell-bold">Chiều Cao</div>
            </Grid>
            <Grid xs={5} item>
              <div className="cell cell-bold">Cân Nặng</div>
            </Grid>
          </Grid>
          {category.guides.map((item, index) => (
            <Grid container key={index}>
              <Grid xs={2} item>
                <div className="cell cell-bold">{item.size.value}</div>
              </Grid>
              <Grid xs={5} item>
                <div className="cell">
                  {formatHeightGuide(item.min_height, item.max_height)}
                </div>
              </Grid>
              <Grid xs={5} item>
                <div className="cell">
                  {formatWeightGuide(item.min_weight, item.max_weight)}
                </div>
              </Grid>
            </Grid>
          ))}
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalSizeGuide;
