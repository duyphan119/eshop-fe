import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { API_PRODUCT_URL, LIMIT_PRODUCT_SEARCH_RESULT } from "../../constants";
import { axiosToken } from "../../config/configAxios";
import Product from "../../components/Product";
import Breadcrumbs from "../../components/Breadcrumbs";
import pageHeaderImg from "../../assets/imgs/search/bg-page-header.webp";
import config from "../../config";

const ProductSearchResult = () => {
  const token = useSelector((state) => state.auth.token);

  const dispatch = useDispatch();

  const [queryParams] = useSearchParams();
  const q = queryParams.get("q");

  const [product, setProduct] = useState([]);
  const [limit, setLimit] = useState(LIMIT_PRODUCT_SEARCH_RESULT);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = `Kết quả tìm kiếm từ khoá ${q}`;
  }, [q]);

  useEffect(() => {
    (async function () {
      const data = await axiosToken(token?.accessToken, dispatch, navigate).get(
        `${API_PRODUCT_URL}/search?q=${q}`
      );
      setProduct(data);
    })();
  }, [q, token, dispatch, navigate]);

  return (
    <Box>
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
        <div style={{ fontSize: 40, marginBottom: 8 }}>TÌM KIẾM VỚI: "{q}"</div>
        <Box pl={2}>
          <Breadcrumbs
            sx={{ fontSize: 10 }}
            items={[
              {
                text: "TRANG CHỦ",
                to: config.routes.home,
              },
              {
                text: "TÌM KIẾM",
              },
            ]}
          />
        </Box>
      </div>

      <Box p={4}>
        <Box fontWeight="600" fontSize={30} pb={2}>
          KẾT QUẢ TÌM KIẾM TỪ KHOÁ VỚI: "{q}"
        </Box>
        <Box p={2}>
          <Grid container spacing={4}>
            {product && product.items && product.items.length === 0 && (
              <Grid item xs={12}>
                <div className="no-result">Không tìm thấy kết quả</div>
              </Grid>
            )}
            {product &&
              product.items &&
              product.items.length !== 0 &&
              [...product.items].splice(0, limit).map((product) => {
                return (
                  <Grid key={product.slug} item xs={6} sm={4} md={3}>
                    <Product product={product} />
                  </Grid>
                );
              })}
          </Grid>
          <Box textAlign="center" mt={2}>
            {limit < product?.items?.length && (
              <button
                className="btn-load-more"
                onClick={() => setLimit(limit + LIMIT_PRODUCT_SEARCH_RESULT)}
              >
                Xem thêm
              </button>
            )}
            {limit > LIMIT_PRODUCT_SEARCH_RESULT &&
              limit >= product?.items?.length && (
                <button
                  className="btn-collapse"
                  onClick={() => setLimit(LIMIT_PRODUCT_SEARCH_RESULT)}
                >
                  Thu gọn
                </button>
              )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductSearchResult;
