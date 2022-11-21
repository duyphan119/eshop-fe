import { Link } from "react-router-dom";
import MuiBreadcrumbs from "@mui/material/Breadcrumbs";
const Breadcrumbs = ({ items, sx }) => {
  return (
    <MuiBreadcrumbs sx={sx} fontSize="14px">
      {items.map((item, index) =>
        item.to ? (
          <Link to={item.to} key={index} className="hover-color-main-color">
            {item.text}
          </Link>
        ) : (
          <div key={index}>{item.text}</div>
        )
      )}
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;
