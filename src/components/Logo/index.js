import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import config from "../../config";
import logo from "../../assets/imgs/logo.jpg";

const Logo = ({ style, sx, noLink }) => {
  return (
    <>
      {!noLink ? (
        <Link to={config.routes.home} style={{ ...style, ...sx }}>
          <img
            src={logo}
            alt="logo"
            style={{ objectFit: "cover", height: "100%" }}
          />
        </Link>
      ) : (
        <Box style={{ ...style, ...sx }}>
          <img
            src={logo}
            alt="logo"
            style={{ objectFit: "cover", height: "100%" }}
          />
        </Box>
      )}
    </>
  );
};

export default Logo;
