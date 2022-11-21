import { Box } from "@mui/material";
import { Route, Routes, useNavigate } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";
import { useDispatch, useSelector } from "react-redux";
import { ErrorBoundary } from "react-error-boundary";
import ReactLoading from "react-loading";
import { DefaultLayout } from "./layouts";
import Toast from "./components/Toast";
import { publicRoutes, adminRoutes } from "./routes";
import "./App.css";
import NavigateScrollToTop from "./components/NavigateScrollToTop";
import ModalAddToCart from "./components/ModalAddToCart";
import { decodeToken } from "./utils";
import { Suspense, useEffect } from "react";
import { axiosToken } from "./config/configAxios";
import { API_USER_URL } from "./constants";
import { setCurrentUser } from "./redux/authSlice";
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      Đã có lỗi xảy ra.
    </div>
  );
}
function App() {
  const token = useSelector((state) => state.auth.token);
  const modal = useSelector((state) => state.cart.modal);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      const user = decodeToken(token?.accessToken);
      const promises = [];
      promises.push(
        axiosToken(token?.accessToken, dispatch, navigate).get(
          `${API_USER_URL}/${user.id}`
        )
      );
      Promise.allSettled(promises)
        .then((listRes) => {
          if (listRes[0] && listRes[0].status === "fulfilled") {
            dispatch(setCurrentUser(listRes[0].value.item));
          }
        })
        .catch((err) => {});
    }
  }, [dispatch, navigate, token]);

  function showRoutes(routes) {
    return routes.map((router, index) => {
      let Layout = DefaultLayout;
      let Page = router.component;
      if (router.layout) {
        Layout = router.layout;
      }
      return (
        <Route
          key={index}
          path={router.path}
          element={
            <Layout>
              <Page />
            </Layout>
          }
        />
      );
    });
  }
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // reset the state of your app so the error doesn't happen again
      }}
    >
      <Suspense
        fallback={
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            height="100vh"
          >
            <ReactLoading type="spokes" color="#000" />
            <br />
            <span>Đang tải</span>
          </Box>
        }
      >
        <NavigateScrollToTop />
        <Box
          sx={{
            display: {
              md: "block",
              xs: "none",
            },
          }}
        >
          <ScrollToTop smooth color="var(--main-color)" />
        </Box>
        <Routes>
          {showRoutes(publicRoutes)}
          {token &&
            decodeToken(token?.accessToken)?.role === "admin" &&
            showRoutes(adminRoutes)}
        </Routes>
        <Toast />
        {modal.open && <ModalAddToCart />}
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
