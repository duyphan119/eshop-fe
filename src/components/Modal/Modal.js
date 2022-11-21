import { Box, Button, Typography } from "@mui/material";
import MuiModal from "@mui/material/Modal";

const Modal = ({
  open,
  handleClose,
  title,
  children,
  handleOk,
  labelOk,
  isCloseAfterOk,
  width,
  height,
  sx,
  disableScrollLock,
}) => {
  const X = (
    <Box
      sx={{
        width: width ? width : 500,
        maxHeight: height ? height : 500,
        bgcolor: "#fff",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        p: 2,
        overflowY: "auto",
        overflowX: "hidden",
        outline: "none !important",
        ...sx,
      }}
    >
      {title && (
        <Typography variant="h5" mb={1}>
          {title}
        </Typography>
      )}
      {children}
      {handleOk && (
        <Box display="flex" justifyContent="flex-end" mt={1}>
          <Button
            sx={{
              px: 3,
              bgcolor: "lightgray",
              color: "#000",
              border: "1px solid lightgray",
              "&:hover": {
                bgcolor: "lightgray",
                color: "#000",
              },
              mr: 1,
            }}
            onClick={handleClose}
          >
            Đóng
          </Button>
          <Button
            size="small"
            type="submit"
            sx={{
              px: 3,
              bgcolor: "var(--main-color)",
              color: "#fff",
              border: "1px solid var(--main-color)",
              "&:hover": {
                color: "var(--main-color)",
                bgcolor: "#fff",
              },
            }}
          >
            {labelOk}
          </Button>
        </Box>
      )}
    </Box>
  );
  return (
    <MuiModal
      open={open}
      onClose={handleClose}
      disableScrollLock={disableScrollLock}
    >
      {handleOk ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleOk();
            if (isCloseAfterOk) {
              handleClose();
            }
          }}
        >
          {X}
        </form>
      ) : (
        X
      )}
    </MuiModal>
  );
};

export default Modal;
