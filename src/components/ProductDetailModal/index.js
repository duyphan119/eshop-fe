import { Box, Chip, Modal, Typography } from "@mui/material";
import { getURL } from "../../utils";

const ProductDetailModal = ({ open, handleClose, item }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          maxWidth: 1200,
          transform: "translate(-50%, -50%)",
          bgcolor: "#fff",
          boxShadow: 24,
          p: 2,
          outline: "none",

          overflowX: "hidden",
        }}
      >
        <Typography variant="h6">
          <b>Chi tiết sản phẩm</b>
        </Typography>
        <ul style={{ fontSize: "14px" }}>
          <li style={{ display: "flex", marginTop: "8px" }}>
            <div style={{ width: "108px" }}>Danh mục: </div>
            <div style={{ flex: "1" }}>{item?.category?.name}</div>
          </li>
          <li style={{ display: "flex", marginTop: "8px" }}>
            <div style={{ width: "108px" }}>Tên Sản phẩm: </div>
            <div style={{ flex: "1" }}>{item?.name}</div>
          </li>
          <li style={{ display: "flex", marginTop: "8px" }}>
            <div style={{ width: "108px" }}>Giá bán: </div>
            <div style={{ flex: "1" }}>
              {item?.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} ₫
            </div>
          </li>
        </ul>
        <Typography
          variant="body2"
          textAlign="center"
          mt={1}
          mb={1}
          fontWeight="bold"
        >
          Màu sắc
        </Typography>
        <ul
          style={{ fontSize: "14px", maxHeight: "424px", overflowY: "auto" }}
          className="custom-scrollbar"
        >
          {item?.colors?.map((color) => (
            <li
              key={color + Math.random()}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "12px",
              }}
            >
              <img
                src={getURL(
                  color.images.find((image) => image.color_id === color.id).url
                )}
                alt=""
                style={{ width: "108px", height: "136px" }}
              />
              <div
                style={{
                  marginBlock: "4px",
                }}
              >
                {color.value}
              </div>
              <div>
                {color.sizes &&
                  color.sizes.map((size) => (
                    <Chip
                      key={size.id + Math.random()}
                      label={`${size.value} (${size.amount})`}
                      color={size.amount === 0 ? "error" : "primary"}
                      variant="contained"
                      sx={{ marginInline: "4px" }}
                    />
                  ))}
              </div>
            </li>
          ))}
        </ul>
      </Box>
    </Modal>
  );
};

export default ProductDetailModal;
