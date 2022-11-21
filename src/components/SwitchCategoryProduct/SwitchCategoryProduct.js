import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  API_PRODUCT_URL,
  LIMIT_PRODUCT_CATEGORY,
  slugs,
} from "../../constants";
import ProductsCategory from "../../pages/ProductCategory";
import ProductDetail from "../../pages/ProductDetail";
import BannerSlider from "../BannerSlider";
import banner1 from "../../assets/imgs/banner/banner-1.jpg";
import banner2 from "../../assets/imgs/banner/banner-2.jpg";
import banner3 from "../../assets/imgs/banner/banner-3.jpg";
import banner4 from "../../assets/imgs/banner/banner-4.jpg";
import banner5 from "../../assets/imgs/banner/banner-5.jpg";
const SwitchCategoryProduct = () => {
  const { slug } = useParams();

  const groupCategories = useSelector(
    (state) => state.groupCategory.switchList
  );

  const switchPages = useMemo(() => {
    if (slug === slugs.NEWEST) {
      return (
        <ProductsCategory
          query={`${API_PRODUCT_URL}?limit=${LIMIT_PRODUCT_CATEGORY}`}
          title="Sản phẩm"
          subTitle="Sản phẩm"
        />
      );
    }

    if (groupCategories) {
      for (const groupCategory of groupCategories) {
        if (groupCategory.slug === slug) {
          return (
            <ProductsCategory
              groupCategory={groupCategory}
              query={`${API_PRODUCT_URL}/group-category/slug/${groupCategory.slug}?limit=${LIMIT_PRODUCT_CATEGORY}`}
              title={`${groupCategory.name.toUpperCase()}`}
            />
          );
        }
        for (const category of groupCategory.categories) {
          if (category.slug === slug) {
            return (
              <ProductsCategory
                category={category}
                query={`${API_PRODUCT_URL}/category/slug/${category.slug}?limit=${LIMIT_PRODUCT_CATEGORY}`}
                title={`${category.name.toUpperCase()}`}
              />
            );
          }
          for (const groupProduct of category.groupProducts) {
            if (groupProduct.slug === slug) {
              return (
                <ProductsCategory
                  groupProduct={groupProduct}
                  query={`${API_PRODUCT_URL}/group-product/slug/${groupProduct.slug}?limit=${LIMIT_PRODUCT_CATEGORY}`}
                  title={`${groupProduct.name.toUpperCase()}`}
                />
              );
            }
          }
        }
      }
    }

    if (groupCategories) {
      return <ProductDetail query={`${API_PRODUCT_URL}/slug/${slug}`} />;
    }

    return "";
  }, [slug, groupCategories]);

  return (
    <>
      <BannerSlider
        banners={[
          { url: banner1, href: "/" },
          { url: banner2, href: "/" },
          { url: banner3, href: "/" },
          { url: banner4, href: "/" },
          { url: banner5, href: "/" },
        ]}
      ></BannerSlider>
      {switchPages}
    </>
  );
};

export default SwitchCategoryProduct;
