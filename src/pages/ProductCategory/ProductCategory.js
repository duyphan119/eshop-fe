import { Box, Divider, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import Product from "../../components/Product";
import Pagination from "../../components/Pagination";
import Filter from "./Filter";
import {
  API_COLOR_URL,
  API_SIZE_URL,
  PRODUCTS_PER_PAGE,
} from "../../constants";
import { axiosRes, axiosToken } from "../../config/configAxios";
import Sort from "./Sort";
import "./ProductCategory.css";
const ProductsCategory = ({
  category,
  groupCategory,
  query,
  title,
  groupProduct,
  subTitle,
}) => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const location = useLocation();
  console.log({ location });

  const [queryParams] = useSearchParams();
  const p = queryParams.get("p");
  const color = queryParams.get("color");
  const size = queryParams.get("size");
  const price = queryParams.get("price");
  const sortBy = queryParams.get("sortBy");
  const sortType = queryParams.get("sortType");

  const [product, setProduct] = useState();
  const [colorFilters, setColorFilters] = useState([]);
  const [sizeFilters, setSizeFilters] = useState([]);
  const [page, setPage] = useState(() => {
    return initPage(p);
  });
  const [sort, setSort] = useState({ sortBy, sortType });
  const [queryString, setQueryString] = useState(queryParams.toString());
  const [filters, setFilters] = useState(() => {
    return initFilters();
  });

  function initFilters() {
    const input = { color, size, price };
    const result = {};
    for (const key in input) {
      if (input[key]) {
        const arr = input[key].split(",");
        result[key] = {
          values: arr,
        };
      } else {
        result[key] = {
          values: [],
        };
      }
    }
    return result;
  }

  function initPage(_p) {
    try {
      let __p = parseInt(_p);
      if (isNaN(__p)) {
        return 1;
      }
      return __p;
    } catch (error) {
      return 1;
    }
  }

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    setPage(1);
  }, [groupCategory, category, groupProduct]);

  useEffect(() => {
    (async function () {
      try {
        const promises = [];
        promises.push(
          new Promise((resolve, reject) => {
            resolve(axiosRes().get(`${API_COLOR_URL}`));
          })
        );
        promises.push(
          new Promise((resolve, reject) => {
            resolve(axiosRes().get(`${API_SIZE_URL}`));
          })
        );
        const listRes = await Promise.allSettled(promises);
        if (listRes[0].status === "fulfilled") {
          setColorFilters(listRes[0].value.items);
        }
        if (listRes[1].status === "fulfilled") {
          setSizeFilters(listRes[1].value.items);
        }
      } catch (error) {}
    })();
  }, []);
  useEffect(() => {
    (async function () {
      try {
        let data = await axiosToken(token?.accessToken, dispatch, navigate).get(
          `${query}?limit=${PRODUCTS_PER_PAGE}${
            filters ? "&" + queryString : ""
          }`
        );
        setProduct(data);
      } catch (error) {}
    })();
  }, [dispatch, filters, query, queryString, token, navigate]);

  useEffect(() => {
    let url;
    const otherQueryParams = {};
    if (sort && sort.sortBy && sort.sortType) {
      // objQuery.sortBy = sort.sortBy;
      // objQuery.sortType = sort.sortType;
      queryParams.set("sortBy", sort.sortBy);
      queryParams.set("sortType", sort.sortType);
      otherQueryParams.sortBy = sort.sortBy;
      otherQueryParams.sortType = sort.sortType;
      if (
        sort.sortType.toLowerCase() !== "asc" &&
        sort.sortType.toLowerCase() !== "desc"
      ) {
        otherQueryParams.sortType = "desc";
      }
    } else {
      queryParams.delete("sortBy");
      queryParams.delete("sortType");
    }

    if (page > 1) {
      queryParams.set("p", page);
      otherQueryParams.p = page;
    } else {
      queryParams.delete("p");
    }

    if (filters) {
      for (const key in filters) {
        if (filters[key] && filters[key].values.length > 0) {
          queryParams.set(key, filters[key].values.join(","));
          otherQueryParams[key] = filters[key].values.join(",");
        } else {
          queryParams.delete(key);
        }
      }
    }

    url = queryParams.toString();
    setQueryString(new URLSearchParams(otherQueryParams).toString());
    if (url === "" && !window.location.href.endsWith(location.pathname)) {
      navigate(location.pathname);
    } else if (!window.location.href.endsWith(url)) {
      navigate(location.pathname + "?" + url);
    } else if (
      url !== location.pathname + "?" + location.search &&
      window.location.href.endsWith(location.pathname + "?" + location.search)
    ) {
      navigate(location.pathname + "?" + location.search);
    }
  }, [navigate, sort, location, page, filters, queryParams]);
  return (
    <>
      <Box px={4} py={4}>
        {groupCategory && (
          <Box
            textAlign="center"
            textTransform="uppercase"
            fontSize={28}
            py={2}
          >
            {groupCategory.name}
          </Box>
        )}
        {!groupCategory && category && (
          <Box
            textAlign="center"
            textTransform="uppercase"
            fontSize={28}
            py={2}
          >
            {category.name}
          </Box>
        )}
        {!groupCategory && !category && groupProduct && (
          <Box textAlign="center" fontSize={28} py={2}>
            {groupProduct.name}
          </Box>
        )}
        {subTitle && (
          <Box textAlign="center" fontSize={28} py={2}>
            {subTitle}
          </Box>
        )}
        {(groupCategory || category) && (
          <>
            <Divider />
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              px={4}
            >
              {groupCategory &&
                groupCategory.categories.map((item, index) => {
                  return (
                    <Box
                      key={index}
                      px={1}
                      my={1}
                      borderLeft={index === 0 ? "" : "1px solid gray"}
                      position="relative"
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          ".sub-category-wrapper": {
                            display: "block",
                          },
                        },
                      }}
                    >
                      <Link
                        to={`/${item.slug}`}
                        className="category-link"
                        style={{
                          cursor: "pointer",
                          display: "block",
                          height: "100%",
                          textTransform: "uppercase",
                        }}
                      >
                        {item.name}
                      </Link>
                      {item.groupProducts.length > 0 && (
                        <Box
                          className="sub-category-wrapper"
                          sx={{
                            display: "none",
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            p: 1,
                            bgcolor: "#fff",
                            border: "1px solid lightgray",
                            zIndex: 2,
                            mt: 1,
                          }}
                        >
                          {item.groupProducts.map((element, index2) => (
                            <Box
                              key={index2}
                              whiteSpace="nowrap"
                              mt={index2 === 0 ? 0 : 1}
                            >
                              <Link
                                to={`/${element.slug}`}
                                className="category-link"
                              >
                                {element.name}
                              </Link>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  );
                })}
              {!groupCategory &&
                category &&
                category.groupProducts.map((item, index) => {
                  return (
                    <Box
                      key={index}
                      px={1}
                      my={1}
                      borderLeft={index === 0 ? "" : "1px solid gray"}
                      sx={{
                        "&:hover": {
                          textDecoration: "underline",
                          color: "var(--main-color)",
                        },
                      }}
                    >
                      <Link to={`/${item.slug}`} style={{ cursor: "pointer" }}>
                        {item.name}
                      </Link>
                    </Box>
                  );
                })}
            </Box>
            <Divider />
          </>
        )}
        <Box mt={3}>
          <Grid container>
            <Grid item xs={12}>
              <Grid container>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBlock: "10px",
                  }}
                >
                  <Filter
                    filters={filters}
                    setFilters={setFilters}
                    colorFilters={colorFilters.map((item) => item.value)}
                    sizeFilters={sizeFilters.map((item) => item.value)}
                  />
                  <Sort sortFilter={sort} setSortFilter={setSort} />
                </Grid>
              </Grid>
              <Grid container spacing={4}>
                {product && product.items && product.items.length === 0 && (
                  <Grid
                    item
                    lg={12}
                    sx={{
                      marginBottom: "8px",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#ff9e49",
                        paddingBlock: "10px",
                      }}
                    >
                      Không có mặt hàng trong danh mục này
                    </div>
                  </Grid>
                )}
                {product &&
                  product.items &&
                  product.items.length !== 0 &&
                  product.items.map((product, index) => {
                    return (
                      <Grid key={index} item xs={6} sm={4} md={3}>
                        <Product product={product} />
                      </Grid>
                    );
                  })}
                {product && product.totalPage > 1 && (
                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Pagination
                      page={page}
                      onChange={(e, value) => setPage(value)}
                      totalPage={product?.totalPage}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default ProductsCategory;
