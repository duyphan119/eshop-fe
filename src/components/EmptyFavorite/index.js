import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import love from "../../assets/imgs/love.png";
const EmptyFavorite = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      position="absolute"
      top="50%"
      left="50%"
      style={{
        transform: "translate(-50%, -50%)",
      }}
    >
      <img src={love} alt="" width={64} />
      <Typography my={1}>Danh sách yêu thích của bạn đang trống</Typography>
      <Button variant="contained">
        <Link to="/">Mua sắm ngay bây giờ</Link>
      </Button>
    </Box>
  );
};

export default EmptyFavorite;
