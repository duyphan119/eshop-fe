import CancelPresentationRoundedIcon from "@mui/icons-material/CancelPresentationRounded";
import { Box, Button, Grid, IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ConfirmDialog from "../../components/ConfirmDialog";
import config from "../../config";
import { axiosToken } from "../../config/configAxios";
import { API_ORDER_URL, API_USER_URL } from "../../constants";
import { setCurrentUser } from "../../redux/authSlice";
import {
  deletedClientOrder,
  getClientOrder,
  getCurrentClientOrder,
} from "../../redux/orderSlice";
import {
  decodeToken,
  formatDateTimeVN,
  formatThousandDigits,
  getCouponPrice,
} from "../../utils";

const ClientOrders = () => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const token = useSelector((state) => state.auth.token);
  const order = useSelector((state) => state.order.clientOrder);
  const page = useSelector((state) => state.order.pageClient);
  const limit = useSelector((state) => state.order.limitClient);
  const current = useSelector((state) => state.order.currentClient);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const promises = [];
    const user = decodeToken(token?.accessToken);
    if (user && user.id) {
      promises.push(
        axiosToken(token?.accessToken, dispatch, navigate).get(
          `${API_USER_URL}/${user.id}`
        )
      );
      promises.push(
        axiosToken(token?.accessToken, dispatch, navigate).get(
          `${API_ORDER_URL}/user/${user.id}?limit=${limit}&page=${page}&sortBy=id&sortType=desc`
        )
      );
    }
    Promise.allSettled(promises)
      .then((listRes) => {
        console.log(listRes);
        if (listRes[0].status === "fulfilled") {
          dispatch(setCurrentUser(listRes[0].value.item));
        }
        if (listRes[1].status === "fulfilled") {
          dispatch(getClientOrder(listRes[1].value));
        }
      })
      .catch((err) => {});
  }, [dispatch, token, navigate, page, limit]);

  // useEffect(() => {
  //   document.title = "????n h??ng c???a t??i";
  //   (async function () {
  //     try {
  //       const data = await configAxiosAll(user, dispatch).get(
  //         `${API_ORDER_URL}/user/${user.id}?limit=${limit}&p=${page}`
  //       );
  //       dispatch(getClientOrder(data));
  //     } catch (error) {}
  //   })();
  // }, [user, dispatch, limit, page]);

  function handleDelete() {
    axiosToken(token?.accessToken, dispatch, navigate)
      .delete(`${API_ORDER_URL}/${current.id}`, {
        data: { userId: currentUser.id },
      })
      .then(() => {
        dispatch(deletedClientOrder(current.id));
      })
      .catch((err) => {});
  }

  return (
    <Box px={6} py={2}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Box fontSize={26} my={1}>
            ????n h??ng
          </Box>
          {order?.items?.map((item, index) => (
            <Box key={index} border="1px solid #000" mt={1} p={1}>
              <Box
                fontWeight="bold"
                mb={1}
                display="flex"
                justifyContent="space-between"
              >
                <span>????n h??ng {formatDateTimeVN(item.createdAt)}</span>
                {item.orderStatus.userIsAllowedDelete && (
                  <Tooltip title="Hu??? ????n h??ng">
                    <IconButton
                      size="small"
                      onClick={() => {
                        dispatch(getCurrentClientOrder(item));
                        setOpen(true);
                      }}
                    >
                      <CancelPresentationRoundedIcon sx={{ color: "red" }} />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
              <Box display="flex" alignItems="end">
                <Box flex={1}>
                  <Box>H??? t??n: {item.fullName}</Box>
                  <Box>S??? ??i??n tho???i: {item.telephone}</Box>
                  <Box>
                    ?????a ch???: {item.address} {item.ward}, {item.district},{" "}
                    {item.city}
                  </Box>
                  <Box>Ghi ch??: {item.description}</Box>
                  <Box>
                    Tr???ng th??i: <strong>{item.orderStatus.name}</strong>
                  </Box>
                </Box>
                <Box textAlign="right">
                  <table style={{ width: "100%" }}>
                    <tbody>
                      <tr>
                        <td style={{ textAlign: "right" }}>T???m t??nh:</td>
                        <td style={{ textAlign: "right" }}>
                          {formatThousandDigits(item.tempPrice)}&nbsp;VND
                        </td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: "right" }}>V???n chuy???n:</td>
                        <td style={{ textAlign: "right" }}>
                          {formatThousandDigits(item.deliveryPrice)}&nbsp;VND
                        </td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: "right" }}>Gi???m gi??:</td>
                        <td style={{ textAlign: "right" }}>
                          {formatThousandDigits(
                            getCouponPrice(
                              item.tempPrice - item.deliveryPrice,
                              item.coupon.percent
                            )
                          )}
                          &nbsp;VND
                        </td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: "right" }}>T???ng c???ng:</td>
                        <td
                          style={{
                            textAlign: "right",
                            color: "var(--main-color)",
                          }}
                        >
                          {formatThousandDigits(item.totalPrice)}&nbsp;VND
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Box>
              </Box>
            </Box>
          ))}
        </Grid>
        <Grid item xs={4}>
          <Box>T??i kho???n c???a t??i</Box>
          <Box mt={1}>?????a ch??? email: {currentUser?.email}</Box>
          <Box mt={1}>H??? t??n: {currentUser?.fullName}</Box>
          <Box mt={1}>S??? ??i???n tho???i: {currentUser?.telephone}</Box>
          <Box mt={1}>T???nh / Th??nh ph???: {currentUser?.city}</Box>
          <Box mt={1}>Qu???n / Huy???n: {currentUser?.district}</Box>
          <Box mt={1}>Ph?????ng / X??: {currentUser?.ward}</Box>
          <Box mt={1}>?????a ch???: {currentUser?.address}</Box>
          <Box mt={2}>
            <Link to={config.routes.profileEdit}>
              <Button
                sx={{
                  bgcolor: "var(--main-color)",
                  textTransform: "initial",
                  color: "#fff",
                  opacity: "0.9",
                  borderRadius: "0",
                  px: 4,
                  py: 1,
                  fontSize: 16,
                  "&:hover": {
                    bgcolor: "var(--main-color) !important",
                    color: "#fff !important",
                    opacity: 1,
                  },
                }}
              >
                S???a
              </Button>
            </Link>
          </Box>
        </Grid>
      </Grid>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        text="B???n c?? ch???c ch???n mu???n hu??? ????n h??ng n??y ?"
        title="X??c nh???n"
      />
    </Box>
  );
};

export default ClientOrders;
