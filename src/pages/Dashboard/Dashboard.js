import { Grid, Paper } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import InventoryIcon from "@mui/icons-material/Inventory";
import Widget from "../../components/Widget";
import { axiosToken } from "../../config/configAxios";
import {
  API_ORDER_URL,
  API_STATISTICS_URL,
  LIMIT_RECENT_ORDERS,
  LIMIT_ROW_BEST_SELLER,
} from "../../constants";
import Chart from "./Chart";
import Deposits from "./Deposits";
import Orders from "./Orders";
import BestSellers from "./BestSellers";
import { getRecentOrders } from "../../redux/orderSlice";
// import { getBestSellersDashboard } from "../../redux/productSlice";
import { Navigate, useNavigate } from "react-router-dom";
import config from "../../config";
import { getBestSellerList } from "../../redux/productDetailSlice";
import GroupCategoryRating from "./GroupCategoryRating";

const Dashboard = () => {
  const token = useSelector((state) => state.auth.token);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [revenueHoursInDay, setRevenueHoursInDay] = useState([]);
  const [countOrder, setCountOrder] = useState([]);
  const [countUser, setCountUser] = useState([]);
  const [revenueCurrentMonth, setRevenueCurrentMonth] = useState([]);
  const [countComment, setCountComment] = useState([]);
  const [countProduct, setCountProduct] = useState([]);
  const [groupCategoryRating, setGroupCategoryRating] = useState([]);

  useEffect(() => {
    document.title = "Bảng điều khiển";
  }, []);

  const heightRef = useRef();

  useEffect(() => {
    if (token) {
      const promises = [];

      promises.push(
        axiosToken(token?.accessToken, dispatch, navigate).get(
          `${API_STATISTICS_URL}/order?type=countCurrentMonth`
        )
      );

      promises.push(
        axiosToken(token?.accessToken, dispatch, navigate).get(
          `${API_STATISTICS_URL}/user?type=countCurrentMonth`
        )
      );
      promises.push(
        axiosToken(token?.accessToken, dispatch, navigate).get(
          `${API_STATISTICS_URL}/revenue?type=sumCurrentMonth`
        )
      );
      promises.push(
        axiosToken(token?.accessToken, dispatch, navigate).get(
          `${API_STATISTICS_URL}/comment-product?type=countCurrentMonth`
        )
      );
      promises.push(
        axiosToken(token?.accessToken, dispatch, navigate).get(
          `${API_STATISTICS_URL}/product?type=countCurrentMonth`
        )
      );
      promises.push(
        axiosToken(token?.accessToken, dispatch, navigate).get(
          `${API_STATISTICS_URL}/revenue?type=hoursInDay`
        )
      );
      promises.push(
        axiosToken(token?.accessToken, dispatch, navigate).get(
          `${API_ORDER_URL}?limit=${LIMIT_RECENT_ORDERS}&sortBy=id&sortType=desc`
        )
      );
      promises.push(
        axiosToken(token?.accessToken, dispatch, navigate).get(
          `${API_STATISTICS_URL}/order-item?type=best-seller&limit=${LIMIT_ROW_BEST_SELLER}`
        )
      );
      promises.push(
        axiosToken(token?.accessToken, dispatch, navigate).get(
          `${API_STATISTICS_URL}/order-item?type=group-category-rating`
        )
      );

      Promise.allSettled(promises)
        .then((listRes) => {
          if (listRes[0].status === "fulfilled") {
            setCountOrder(listRes[0].value.item);
          }
          if (listRes[1].status === "fulfilled") {
            setCountUser(listRes[1].value.item);
          }
          if (listRes[2].status === "fulfilled") {
            setRevenueCurrentMonth(listRes[2].value.item);
          }
          if (listRes[3].status === "fulfilled") {
            setCountComment(listRes[3].value.item);
          }
          if (listRes[4].status === "fulfilled") {
            setCountProduct(listRes[4].value.item);
          }
          if (listRes[5].status === "fulfilled") {
            setRevenueHoursInDay(
              listRes[5].value.items.map((item) => ({
                ...item,
                total: parseInt(item.total) / 1000,
              }))
            );
          }
          if (listRes[6].status === "fulfilled") {
            dispatch(getRecentOrders(listRes[6].value.items));
          }
          if (listRes[7].status === "fulfilled") {
            dispatch(getBestSellerList(listRes[7].value.items));
          }
          if (listRes[8].status === "fulfilled") {
            setGroupCategoryRating(listRes[8].value.items);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [token, dispatch, navigate]);
  if (!token) {
    return <Navigate to={config.routes.login} />;
  }
  return (
    <Grid container spacing={1}>
      <Grid
        item
        xs={12}
        lg={3}
        md={6}
        sx={{
          maxWidth: {
            lg: "20%",
            md: "50%",
          },
          flexBasis: {
            lg: "20%",
            md: "50%",
          },
        }}
      >
        <Widget
          icon={<PersonAddAltIcon sx={{ fontSize: 40 }} />}
          title="Người dùng"
          value={countUser?.current}
          comparedValue={countUser?.prev}
        />
      </Grid>
      <Grid
        item
        xs={12}
        lg={3}
        md={6}
        sx={{
          maxWidth: {
            lg: "20%",
            md: "50%",
          },
          flexBasis: {
            lg: "20%",
            md: "50%",
          },
        }}
      >
        <Widget
          icon={<ReceiptLongIcon sx={{ fontSize: 40 }} />}
          title="Hoá đơn"
          value={countOrder?.current}
          comparedValue={countOrder?.prev}
        />
      </Grid>
      <Grid
        item
        xs={12}
        lg={3}
        md={6}
        sx={{
          maxWidth: {
            lg: "20%",
            md: "50%",
          },
          flexBasis: {
            lg: "20%",
            md: "50%",
          },
        }}
      >
        <Widget
          icon={<AttachMoneyIcon sx={{ fontSize: 40 }} />}
          title="Doanh thu"
          value={revenueCurrentMonth?.current}
          comparedValue={revenueCurrentMonth?.prev}
        />
      </Grid>
      <Grid
        item
        xs={12}
        lg={3}
        md={6}
        sx={{
          maxWidth: {
            lg: "20%",
            md: "50%",
          },
          flexBasis: {
            lg: "20%",
            md: "50%",
          },
        }}
      >
        <Widget
          icon={<ChatBubbleOutlineIcon sx={{ fontSize: 40 }} />}
          title="Đánh giá"
          value={countComment?.current}
          comparedValue={countComment?.prev}
        />
      </Grid>
      <Grid
        item
        xs={12}
        lg={3}
        md={6}
        sx={{
          maxWidth: {
            lg: "20%",
            md: "100%",
          },
          flexBasis: {
            lg: "20%",
            md: "100%",
          },
        }}
      >
        <Widget
          icon={<InventoryIcon sx={{ fontSize: 40 }} />}
          title="Sản phẩm"
          value={countProduct?.current}
          comparedValue={countProduct?.prev}
        />
      </Grid>
      {/* Chart */}
      <Grid item xs={12} md={8} lg={9}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 240,
            overflowX: "overlay",
            overflowY: "hidden",
          }}
          className="custom-scrollbar-horizontal"
        >
          <Chart data={revenueHoursInDay} />
        </Paper>
      </Grid>
      {/* Recent Deposits */}
      <Grid item xs={12} md={4} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 240,
          }}
        >
          <Deposits
            total={revenueHoursInDay.reduce((prev, cur) => {
              return prev + parseInt(cur.total);
            }, 0)}
          />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <Orders />
        </Paper>
      </Grid>
      <Grid item xs={8} sx={{ flex: 2 }}>
        <Paper
          sx={{ p: 2, display: "flex", flexDirection: "column" }}
          ref={heightRef}
        >
          <BestSellers />
        </Paper>
      </Grid>
      <Grid item xs={4} sx={{ flex: 1 }}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <GroupCategoryRating
            height={
              heightRef.current
                ? heightRef.current.getBoundingClientRect().height - 32
                : 0
            }
            data={groupCategoryRating}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
