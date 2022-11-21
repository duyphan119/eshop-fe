import { Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LIMIT_WISHLIST } from "../../constants";
import pageHeaderImg from "../../assets/imgs/search/bg-page-header.webp";
import Breadcrumbs from "../../components/Breadcrumbs";
import Product from "../../components/Product";
import config from "../../config";
import { Navigate } from "react-router-dom";

const Favorite = () => {
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const currentUser = useSelector((state) => state.auth.currentUser);

  const [limit, setLimit] = useState(LIMIT_WISHLIST);

  useEffect(() => {
    document.title = "Sản phẩm yêu thích";
  }, []);

  if (!currentUser) return <Navigate to={config.routes.login} />;

  return (
    <>
      <div
        style={{
          backgroundImage: `url('${pageHeaderImg}')`,
          width: "100%",
          height: 260,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          paddingInline: 32,
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 8 }}>Sản phẩm yêu thích</div>
        <Box pl={2}>
          <Breadcrumbs
            sx={{ fontSize: 10 }}
            items={[
              {
                text: "TRANG CHỦ",
                to: config.routes.home,
              },
              {
                text: "SẢN PHẨM YÊU THÍCH",
              },
            ]}
          />
        </Box>
      </div>
      <Box mt={4}>
        <Grid container spacing={4} px={4}>
          {wishlist.map((product) => {
            return (
              <Grid key={product.slug} item xs={6} sm={4} md={3} mb={2}>
                <Product key={product.slug} product={product} />
              </Grid>
            );
          })}
        </Grid>
        <Box textAlign="center" mt={2}>
          {limit < wishlist.length && (
            <button
              className="btn-load-more"
              onClick={() => setLimit(limit + LIMIT_WISHLIST)}
            >
              Xem thêm
            </button>
          )}
          {limit > LIMIT_WISHLIST && limit >= wishlist.length && (
            <button
              className="btn-collapse"
              onClick={() => setLimit(LIMIT_WISHLIST)}
            >
              Thu gọn
            </button>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Favorite;
