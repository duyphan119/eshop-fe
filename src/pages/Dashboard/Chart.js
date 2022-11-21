import * as React from "react";
import { useTheme } from "@mui/material/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { TitlePaper } from "../../components/Title";
import { Box } from "@mui/material";

export default function Chart({ data }) {
  const theme = useTheme();

  return (
    <React.Fragment>
      <TitlePaper>Biểu đồ doanh thu hôm nay</TitlePaper>
      {data.length !== 0 ? (
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{
              top: 16,
              right: 16,
              bottom: 0,
              left: 0,
            }}
          >
            <XAxis dataKey="hour" unit="h" />
            <YAxis unit="k" />
            <Tooltip />
            <Bar dataKey="total" fill="var(--main-color)" />
          </BarChart>
          {/* <LineChart
            data={data}
            margin={{
              top: 16,
              right: 16,
              bottom: 0,
              left: 16,
            }}
          >
            <XAxis
              dataKey="hour"
              stroke={theme.palette.text.secondary}
              style={theme.typography.body2}
              // angle={-45}
              // textAnchor="end"
            />
            <YAxis
              stroke={theme.palette.text.secondary}
              style={theme.typography.body2}
            ></YAxis>
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Line
              isAnimationActive={true}
              type="monotone"
              dataKey="total"
              stroke={theme.palette.primary.main}
              dot={false}
            />
          </LineChart> */}
        </ResponsiveContainer>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          height="100%"
          justifyContent="center"
        >
          Chưa có dữ liệu
        </Box>
      )}
    </React.Fragment>
  );
}
