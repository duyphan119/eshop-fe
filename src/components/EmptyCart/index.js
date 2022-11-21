import { Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import { useSelector } from "react-redux";

const EmptyCart = () => {
  const user = useSelector((state) => state.auth.currentUser);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBlock: "20px",
      }}
    >
      <AddShoppingCartOutlinedIcon style={{ fontSize: "50px" }} />
      <Typography variant="body1" sx={{ mt: "10px" }}>
        GIỎ HÀNG CỦA BẠN ĐANG TRỐNG
      </Typography>
      {!user && (
        <Link
          to={`/login`}
          style={{
            textDecoration: "none",
            color: "#000",
          }}
        >
          <Button variant="contained" sx={{ mt: "10px" }}>
            Đăng nhập
          </Button>
        </Link>
      )}
      <Link
        to={`/`}
        style={{
          textDecoration: "none",
          color: "#000",
        }}
      >
        <Button variant="outlined" size="large" sx={{ mt: "10px" }}>
          Mua ngay
        </Button>
      </Link>
    </div>
  );
};

export default EmptyCart;
