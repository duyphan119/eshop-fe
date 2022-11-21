import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import banner1 from "../../assets/imgs/banner/banner-1.jpg";
import banner2 from "../../assets/imgs/banner/banner-2.jpg";
import banner3 from "../../assets/imgs/banner/banner-3.jpg";
import banner4 from "../../assets/imgs/banner/banner-4.jpg";
import banner5 from "../../assets/imgs/banner/banner-5.jpg";
import ao_khoac_img from "../../assets/imgs/home/ao-khoac.jpg";
import backpack_img from "../../assets/imgs/home/backpack.jpg";
import belt_img from "../../assets/imgs/home/belt.jpg";
import cap_img from "../../assets/imgs/home/cap.jpg";
import do_nam_img from "../../assets/imgs/home/do-nam.jpg";
import do_nu_img from "../../assets/imgs/home/do-nu.jpg";
import slingbag_img from "../../assets/imgs/home/slingbag.jpg";
import BannerSlider from "../../components/BannerSlider";
import Product from "../../components/Product";
import { axiosToken } from "../../config/configAxios";
import {
  API_GROUP_CATEGORY_URL,
  API_PRODUCT_URL,
  LIMIT_NEW_PRODUCT,
} from "../../constants";
import { getURL } from "../../utils";

const Home = () => {
  const token = useSelector((state) => state.auth.token);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [newestProduct, setNewestProduct] = useState();
  const [bannerList, setBannerList] = useState([]);

  useEffect(() => {
    document.title = "Trang chủ";
  }, []);
  useEffect(() => {
    (async function () {
      try {
        const promises = [];
        promises.push(
          axiosToken(token?.accessToken, dispatch, navigate).get(
            `${API_PRODUCT_URL}?limit=${LIMIT_NEW_PRODUCT}`
          )
        );
        promises.push(
          axiosToken(token?.accessToken, dispatch, navigate).get(
            `${API_GROUP_CATEGORY_URL}`
          )
        );

        const listRes = await Promise.allSettled(promises);

        if (listRes[0].status === "fulfilled") {
          setNewestProduct(listRes[0].value);
        }
        if (listRes[1].status === "fulfilled") {
          setBannerList(listRes[1].value.items);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [token, navigate, dispatch]);
  console.log(bannerList?.filter((item) => item.banner));
  return (
    <>
      <BannerSlider
        banners={[
          { url: banner1, href: "/" },
          { url: banner2, href: "/" },
          { url: banner3, href: "/" },
          { url: banner4, href: "/" },
          { url: banner5, href: "/" },
          ...bannerList
            .filter((item) => item.url)
            .map((item) => ({ url: getURL(item.banner), href: "/" })),
        ]}
      ></BannerSlider>
      <Box mb={1}>
        <Grid container spacing={3}>
          <Grid
            item
            lg={6}
            xs={12}
            sx={{
              my: 3,
            }}
          >
            <Link to="/">
              <img src={do_nu_img} width="100%" alt="" />
            </Link>
          </Grid>
          <Grid
            item
            lg={6}
            xs={12}
            sx={{
              my: 3,
            }}
          >
            <Link to="/">
              <img src={do_nam_img} width="100%" alt="" />
            </Link>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item lg={6} xs={12}>
            <Link to="/">
              <img src={ao_khoac_img} width="100%" alt="" />
            </Link>
          </Grid>
          <Grid item lg={6} xs={12}>
            <Grid container spacing={3}>
              <Grid item lg={6} xs={12}>
                <Link to="/">
                  <img src={backpack_img} width="100%" alt="" />
                </Link>
              </Grid>
              <Grid item lg={6} xs={12}>
                <Link to="/">
                  <img src={slingbag_img} width="100%" alt="" />
                </Link>
              </Grid>
              <Grid item lg={6} xs={12}>
                <Link to="/">
                  <img src={cap_img} width="100%" alt="" />
                </Link>
              </Grid>
              <Grid item lg={6} xs={12}>
                <Link to="/">
                  <img src={belt_img} width="100%" alt="" />
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container columnSpacing={2} rowSpacing={2}>
          <Grid
            item
            md={12}
            sx={{
              textAlign: "center",
              marginBlock: "5px",
            }}
          >
            <Typography variant="h6" textTransform="uppercase" color="#000">
              Mới nhất
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={4} px={4}>
          {newestProduct?.items?.length > 0 &&
            newestProduct?.items?.map((product) => {
              return (
                <Grid key={product.slug} item xs={6} sm={4} md={3}>
                  <Product key={product.slug} product={product} />
                </Grid>
              );
            })}
        </Grid>
      </Box>
    </>
  );
};

export default Home;
