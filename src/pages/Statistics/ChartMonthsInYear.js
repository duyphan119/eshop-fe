import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Typography } from "@mui/material";

const ChartMonthsInYear = ({ data }) => {
  console.log(data);

  return (
    <>
      <Typography
        id="title"
        component="h2"
        variant="h6"
        color="primary"
        gutterBottom
      >
        Biểu đồ doanh thu các tháng trong năm {new Date().getFullYear()}
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 0,
          }}
        >
          <XAxis dataKey="month" />
          <YAxis unit="k" />
          <Tooltip />
          <Bar dataKey="total" fill="var(--main-color)" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default ChartMonthsInYear;
