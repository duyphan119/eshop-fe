import { Button } from "@mui/material";
import { Link } from "react-router-dom";
export function isShowLoadMore(obj, limit, onClick) {
  if (obj && obj.items && obj.items.length > 0) {
    if (obj.items.length >= limit && obj.total_page > 1) {
      return (
        <MyButton variant="contained" onClick={onClick}>
          Xem thêm
        </MyButton>
      );
    }
  }
  return <></>;
}

export function isShowCollapse(obj, limit, onClick) {
  if (obj && obj.items && obj.items.length > 0) {
    if (obj.total_page === 1 && obj.items.length > limit) {
      return (
        <MyButton variant="contained" onClick={onClick}>
          Thu gọn
        </MyButton>
      );
    }
  }
  return <></>;
}
export const ButtonLink = ({ link, label }) => {
  return (
    <Link to={link}>
      <MyButton variant="contained">{label} </MyButton>
    </Link>
  );
};

export const MyButton = (props) => {
  return (
    <Button
      {...props}
      sx={{
        backgroundColor: "#000",
        "&:hover": { backgroundColor: "#fff", color: "#000" },
        px: 4,
        ...props.sx,
      }}
    >
      {props.children}
    </Button>
  );
};
