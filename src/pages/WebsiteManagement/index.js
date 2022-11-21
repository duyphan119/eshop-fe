import { Box, Tab, Tabs } from "@mui/material";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TabPanel from "../../components/TabPanel";
import { axiosRes } from "../../config/configAxios";
import { API_BANNER_URL, LIMIT_ROW_BANNER } from "../../constants";
import { getBanner } from "../../redux/bannerSlice";
import BannerTabPanel from "./BannerTabPanel";

const WebsiteManagement = () => {
  const dispatch = useDispatch();

  const [tab, setTab] = useState(0);

  useEffect(() => {
    axiosRes()
      .get(`${API_BANNER_URL}?limit=${LIMIT_ROW_BANNER}&p=${1}`)
      .then((data) => {
        dispatch(getBanner(data));
      })
      .catch((err) => {});
  }, [dispatch]);

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#fff" }}>
        <Tabs
          value={tab}
          onChange={(e, value) => setTab(value)}
          aria-label="basic tabs example"
        >
          <Tab label="Thông tin cửa hàng" />
          <Tab label="Banner" />
        </Tabs>
      </Box>
      <TabPanel value={tab} index={0}>
        <></>
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <BannerTabPanel />
      </TabPanel>
    </>
  );
};

export default WebsiteManagement;
