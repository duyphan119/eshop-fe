import { Box, Tab, Tabs } from "@mui/material";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import React, { useState } from "react";
import TabPanel from "../../components/TabPanel";
import CouponTabPanel from "./CouponTabPanel";
import OrderTabPanel from "./OrderTabPanel";

const OrderManagement = () => {
  const [tab, setTab] = useState(0);

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#fff" }}>
        <Tabs value={tab} onChange={(e, value) => setTab(value)}>
          <Tab label="Hoá đơn" />
          <Tab label="Giảm giá" />
        </Tabs>
      </Box>
      <TabPanel index={0} value={tab}>
        <OrderTabPanel />
      </TabPanel>
      <TabPanel index={1} value={tab}>
        <CouponTabPanel />
      </TabPanel>
    </>
  );
};
export default OrderManagement;
