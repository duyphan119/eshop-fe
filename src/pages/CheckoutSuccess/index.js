import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
const CheckoutSuccess = () => {
  return (
    <Box>
      <Container>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
          }}
        >
          <CheckCircleIcon
            style={{ fontSize: "160px", color: "var(--success-color)" }}
          />
          <Typography variant="h5" sx={{ marginTop: "5px 0" }}>
            Bạn đã đặt hàng thành công
          </Typography>
          <Typography variant="body1" sx={{ margin: "5px 0" }}>
            Đơn hàng của bạn đang chờ xử lý
          </Typography>
          <Button variant="contained">
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              Quay về Trang Chủ
            </Link>
          </Button>
        </div>
      </Container>
    </Box>
  );
};

export default CheckoutSuccess;
