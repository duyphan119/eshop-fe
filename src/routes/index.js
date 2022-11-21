import { ContentLayout, DashboardLayout } from "../layouts";
import config from "../config";

import { lazy } from "react";

const SwitchCategoryProduct = lazy(() =>
  import("../components/SwitchCategoryProduct")
);
const Home = lazy(() => import("../pages/Home"));
const ProductDetail = lazy(() => import("../pages/ProductDetail"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const ProductSearchResult = lazy(() => import("../pages/ProductSearchResult"));
const NotFound = lazy(() => import("../pages/NotFound"));
const CheckoutSuccess = lazy(() => import("../pages/CheckoutSuccess"));
const Profile = lazy(() => import("../pages/Profile"));
const ClientOrders = lazy(() => import("../pages/ClientOrders"));
const Favorite = lazy(() => import("../pages/Favorite"));
const Latest = lazy(() => import("../pages/Latest"));
const Statistics = lazy(() => import("../pages/Statistics"));
const Cart = lazy(() => import("../pages/Cart"));
const Checkout = lazy(() => import("../pages/Checkout"));
const ProfileEdit = lazy(() => import("../pages/ProfileEdit"));
const ChangePassword = lazy(() => import("../pages/ChangePassword"));
const GroupProductManagement = lazy(() =>
  import("../pages/Management/GroupProductManagement")
);
const GroupCategoryManagement = lazy(() =>
  import("../pages/Management/GroupCategoryManagement")
);
const ProductDetailManagement = lazy(() =>
  import("../pages/Management/ProductDetailManagement")
);
const CategoryManagement = lazy(() =>
  import("../pages/Management/CategoryManagement")
);
const OrderManagement = lazy(() =>
  import("../pages/Management/OrderManagement")
);
const UserManagement = lazy(() => import("../pages/Management/UserManagement"));
const CommentProductManagement = lazy(() =>
  import("../pages/Management/CommentProductManagement")
);
const ProductManagement = lazy(() =>
  import("../pages/Management/ProductManagement")
);
const ColorManagement = lazy(() =>
  import("../pages/Management/ColorManagement")
);
const SizeManagement = lazy(() => import("../pages/Management/SizeManagement"));
const RoleManagement = lazy(() => import("../pages/Management/RoleManagement"));
const CouponManagement = lazy(() =>
  import("../pages/Management/CouponManagement")
);
const DiscountManagement = lazy(() =>
  import("../pages/Management/DiscountManagement")
);
const ProductImageManagement = lazy(() =>
  import("../pages/Management/ProductImageManagement")
);
const OrderStatusManagement = lazy(() =>
  import("../pages/Management/OrderStatusManagement")
);
const Login = lazy(() => import("../pages/Login/Login"));
const Register = lazy(() => import("../pages/Register/Register"));
export const publicRoutes = [
  {
    path: config.routes.home,
    component: Home,
  },
  {
    path: config.routes.login,
    component: Login,
  },
  {
    path: config.routes.register,
    component: Register,
  },
  {
    path: config.routes.search,
    component: ProductSearchResult,
  },
  {
    path: config.routes.cart,
    component: Cart,
  },
  {
    path: config.routes.checkout,
    component: Checkout,
  },
  {
    path: config.routes.checkoutSuccess,
    component: CheckoutSuccess,
    layout: ContentLayout,
  },
  {
    path: config.routes.productDetail,
    component: ProductDetail,
  },
  {
    path: config.routes.profile,
    component: Profile,
  },
  {
    path: config.routes.profileEdit,
    component: ProfileEdit,
  },
  {
    path: config.routes.profileOrder,
    component: ClientOrders,
  },
  {
    path: config.routes.profileLatest,
    component: Latest,
  },
  {
    path: config.routes.profileFavorite,
    component: Favorite,
  },
  {
    path: config.routes.changePassword,
    component: ChangePassword,
  },
  {
    path: config.routes.productCategory,
    component: SwitchCategoryProduct,
  },
  {
    path: "*",
    component: NotFound,
  },
];

export const adminRoutes = [
  {
    path: config.routes.dashboard,
    component: Dashboard,
    layout: DashboardLayout,
  },
  {
    path: config.routes.categoryManagement,
    component: CategoryManagement,
    layout: DashboardLayout,
  },
  {
    path: config.routes.productManagement,
    component: ProductManagement,
    layout: DashboardLayout,
  },
  {
    path: config.routes.productImageManagement,
    component: ProductImageManagement,
    layout: DashboardLayout,
  },
  {
    path: config.routes.productDetailManagement,
    component: ProductDetailManagement,
    layout: DashboardLayout,
  },
  {
    path: config.routes.colorManagement,
    component: ColorManagement,
    layout: DashboardLayout,
  },
  {
    path: config.routes.sizeManagement,
    component: SizeManagement,
    layout: DashboardLayout,
  },
  {
    path: config.routes.discountManagement,
    component: DiscountManagement,
    layout: DashboardLayout,
  },
  {
    path: config.routes.orderManagement,
    component: OrderManagement,
    layout: DashboardLayout,
  },
  {
    path: config.routes.couponManagement,
    component: CouponManagement,
    layout: DashboardLayout,
  },
  {
    path: config.routes.userManagement,
    component: UserManagement,
    layout: DashboardLayout,
  },
  {
    path: config.routes.roleManagement,
    component: RoleManagement,
    layout: DashboardLayout,
  },
  {
    path: config.routes.groupProductManagement,
    component: GroupProductManagement,
    layout: DashboardLayout,
  },
  {
    path: config.routes.orderStatusManagement,
    component: OrderStatusManagement,
    layout: DashboardLayout,
  },
  {
    path: config.routes.CommentProductManagement,
    component: CommentProductManagement,
    layout: DashboardLayout,
  },
  {
    path: config.routes.statistics,
    component: Statistics,
    layout: DashboardLayout,
  },
  {
    path: config.routes.groupCategoryManagement,
    component: GroupCategoryManagement,
    layout: DashboardLayout,
  },
];
