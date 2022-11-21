import { useEffect, useRef, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { useTheme } from "@mui/material/styles";
import { Box, Grid, useMediaQuery } from "@mui/material";
import Sidebar from "./Sidebar";

const DefaultLayout = ({ children }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("lg"));

  const headerRef = useRef();
  const [style, setStyle] = useState({});
  useEffect(() => {
    setStyle({
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      width: "100%",
      overflowX: "hidden",
      paddingTop: `${
        headerRef.current
          ? headerRef.current.getBoundingClientRect().height
          : 60
      }px`,
    });
  }, []);
  return matches ? (
    <Box overflowX="hidden">
      <Sidebar />
      <Box
        sx={{
          width: "100%",
          paddingLeft: "20%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {children}
        <Footer />
      </Box>
    </Box>
  ) : (
    <div style={style}>
      <Header headerRef={headerRef} />
      {children}
      <Footer />
    </div>
  );
};

export default DefaultLayout;
