import { Box, Button, Grid, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { axiosToken } from "../../config/configAxios";
import { API_STATISTICS_URL } from "../../constants";
import { exportComponentToPDF } from "../../utils";
import ChartDaysInMonth from "./ChartDaysInMonth";
import ChartMonthsInYear from "./ChartMonthsInYear";
import ChartYears from "./ChartYears";

const Statistics = () => {
  const token = useSelector((state) => state.auth.token);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [revenuesDaysInMonth, setRevenuesDaysInMonth] = useState([]);
  const [revenuesMonthsInYear, setRevenuesMonthsInYear] = useState([]);
  const [revenuesYears, setRevenuesYears] = useState([]);

  useEffect(() => {
    const divide1000 = (items) => {
      return items.map((item) => ({
        ...item,
        total: parseInt(item.total) / 1000,
      }));
    };
    const promises = [];

    promises.push(
      axiosToken(token?.accessToken, dispatch, navigate).get(
        `${API_STATISTICS_URL}/revenue?type=years`
      )
    );
    promises.push(
      axiosToken(token?.accessToken, dispatch, navigate).get(
        `${API_STATISTICS_URL}/revenue?type=monthsInYear`
      )
    );
    promises.push(
      axiosToken(token?.accessToken, dispatch, navigate).get(
        `${API_STATISTICS_URL}/revenue?type=daysInMonth`
      )
    );
    Promise.allSettled(promises)
      .then((listRes) => {
        if (listRes[0].status === "fulfilled") {
          setRevenuesYears(divide1000(listRes[0].value.items));
        }
        if (listRes[1].status === "fulfilled") {
          setRevenuesMonthsInYear(divide1000(listRes[1].value.items));
        }
        if (listRes[2].status === "fulfilled") {
          setRevenuesDaysInMonth(divide1000(listRes[2].value.items));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, navigate, dispatch]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <Paper
          sx={{
            p: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: 300,
              width: "100%",
              overflow: "overlay",
              p: 1,
            }}
            id="chart-years"
            className="custom-scrollbar-horizontal"
          >
            <ChartYears data={revenuesYears} />
          </Box>
          <div>
            <Button
              onClick={() => exportComponentToPDF("chart-years")}
              sx={{
                bgcolor: "#000",
                color: "#fff",
                border: "1px solid #000",
                "&:hover": {
                  color: "#000",
                  bgcolor: "#fff",
                },
              }}
            >
              Xuất file PDF
            </Button>
          </div>
        </Paper>
      </Grid>
      <Grid item xs={8}>
        <Paper
          sx={{
            p: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: 300,
              width: "100%",
              overflow: "overlay",
              p: 1,
            }}
            id="chart-months-in-year"
            className="custom-scrollbar-horizontal"
          >
            <ChartMonthsInYear data={revenuesMonthsInYear} />
          </Box>
          <div>
            <Button
              onClick={() => exportComponentToPDF("chart-months-in-year")}
              sx={{
                bgcolor: "#000",
                color: "#fff",
                border: "1px solid #000",
                "&:hover": {
                  color: "#000",
                  bgcolor: "#fff",
                },
              }}
            >
              Xuất file PDF
            </Button>
          </div>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper
          sx={{
            p: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: 360,
              width: "100%",
              overflow: "overlay",
              p: 1,
            }}
            id="chart-days-in-month"
            className="custom-scrollbar-horizontal"
          >
            <ChartDaysInMonth data={revenuesDaysInMonth} />
          </Box>
          <div>
            <Button
              onClick={() => exportComponentToPDF("chart-days-in-month")}
              sx={{
                bgcolor: "#000",
                color: "#fff",
                border: "1px solid #000",
                "&:hover": {
                  color: "#000",
                  bgcolor: "#fff",
                },
              }}
            >
              Xuất file PDF
            </Button>
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Statistics;
