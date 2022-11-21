import { Box, CssBaseline, ThemeProvider, Toolbar } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useState } from "react";
import AppBar from "./AppBar";
import Drawer from "./Drawer";

const mdTheme = createTheme();

const DashboardLayout = ({ children }) => {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar open={open} toggleDrawer={toggleDrawer} />
        <Drawer toggleDrawer={toggleDrawer} open={open} />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Box sx={{ p: 1 }}>{children}</Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default DashboardLayout;
