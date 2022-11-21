import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { memo, useEffect } from "react";
import { Box, Container, Grid } from "@mui/material";
import { axiosRes } from "../../../config/configAxios";
import { API_GENDER_URL } from "../../../constants";
import { getAllGroupCategories } from "../../../redux/groupCategorySlice";
const HeaderCategoryList = () => {
  const groupCategories = useSelector((state) => state.groupCategory.all);

  const dispatch = useDispatch();

  useEffect(() => {
    (async function () {
      const data = await axiosRes().get(`${API_GENDER_URL}`);
      dispatch(getAllGroupCategories(data));
    })();
  }, [dispatch]);

  return (
    <ul className="header-category-list">
      {groupCategories.map((groupCategory) => {
        return (
          <li className="header-category-list-item" key={groupCategory.slug}>
            <Link
              className="header-category-list-item-link"
              to={`/${groupCategory.slug}`}
            >
              {groupCategory.name}
            </Link>
            <Box className="header-category-list-notify">
              <Container>
                <Grid container>
                  {groupCategory.categories.map((category) => {
                    return (
                      <Grid item sm={3} key={category.slug}>
                        <Link
                          to={`/${category.slug}`}
                          className="header-category-list-notify-group-link"
                        >
                          {
                            category.name
                              .toLowerCase()
                              .split(groupCategory.name.toLowerCase())[0]
                          }
                        </Link>
                        <ul className="header-category-list-notify-links">
                          {category.groupProducts.map((groupProduct) => {
                            return (
                              <li key={groupProduct.slug}>
                                <Link
                                  to={`/${groupProduct.slug}`}
                                  className="header-category-list-notify-link"
                                >
                                  {
                                    groupProduct.name
                                      .toLowerCase()
                                      .split(
                                        groupCategory.name.toLowerCase()
                                      )[0]
                                  }
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </Grid>
                    );
                  })}
                </Grid>
              </Container>
            </Box>
          </li>
        );
      })}
    </ul>
  );
};

export default memo(HeaderCategoryList);
