import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Box, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => {
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
          <WarningAmberIcon
            style={{ fontSize: "160px", color: "var(--warning-color)" }}
          />
          <Typography variant="h5" sx={{ margin: "5px 0" }}>
            Lỗi 404! Trang không tìm thấy
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

export default NotFound;
