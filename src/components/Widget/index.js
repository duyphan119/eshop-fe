import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Paper, Typography } from "@mui/material";
import { formatThousandDigits } from "../../utils";
const Widget = ({ icon, title, value, comparedValue }) => {
  return (
    <Paper
      sx={{
        height: 120,
        display: "flex",
        p: 2,
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Typography>{title}</Typography>
        <Typography sx={{ fontWeight: 600, fontSize: 20 }}>
          {formatThousandDigits(value)}
        </Typography>
        {comparedValue > 0 && value > 0 && (
          <div
            style={{
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              color:
                value / comparedValue < 1
                  ? "var(--error-color)"
                  : value / comparedValue === 1
                  ? "#000"
                  : "var(--success-color)",
            }}
          >
            {(value / comparedValue).toFixed(2)}
            {value / comparedValue > 1 && (
              <ArrowUpwardIcon
                sx={{ fontSize: 16, transform: "translateY(-1px)" }}
              />
            )}
            {value / comparedValue < 1 && (
              <ArrowDownwardIcon
                sx={{ fontSize: 16, transform: "translateY(-1px)" }}
              />
            )}
            <span style={{ color: "#000", fontSize: 12 }}>
              &nbsp;(tháng trước)
            </span>
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {icon}
      </div>
    </Paper>
  );
};

export default Widget;
