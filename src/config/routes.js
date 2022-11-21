const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  cart: "/cart",
  checkout: "/checkout",
  checkoutSuccess: "/checkout/success",
  profile: "/profile",
  profileEdit: "/profile/edit",
  profileOrder: "/profile/order",
  profileLatest: "/profile/latest",
  profileFavorite: "/profile/favorite",
  dashboard: "/dashboard",
  orderManagement: "/dashboard/order",
  CommentProductManagement: "/dashboard/comment",
  categoryManagement: "/dashboard/category",
  groupCategoryManagement: "/dashboard/group-category",
  groupProductManagement: "/dashboard/group-product",
  discountManagement: "/dashboard/discount",
  productManagement: "/dashboard/product",
  colorManagement: "/dashboard/color",
  sizeManagement: "/dashboard/size",
  userManagement: "/dashboard/user",
  productImageManagement: "/dashboard/product-image",
  roleManagement: "/dashboard/role",
  couponManagement: "/dashboard/coupon",
  websiteManagement: "/dashboard/website",
  orderStatusManagement: "/dashboard/order-status",
  productDetailManagement: "/dashboard/product-detail",
  statistics: "/dashboard/statistics",
  productCategory: "/:slug",
  search: "/search",
  changePassword: "/account/change-password",
  productAdd: "/dashboard/product/add",
  productEdit: "/dashboard/product/edit/:id",
};

export default routes;