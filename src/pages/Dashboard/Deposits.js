import Typography from "@mui/material/Typography";
import * as React from "react";
import { Link } from "react-router-dom";
import { TitlePaper } from "../../components/Title";
import config from "../../config";
import { formatThousandDigits, formatDateVN } from "../../utils";

export default function Deposits({ total }) {
  return (
    <React.Fragment>
      <TitlePaper>Doanh thu hôm nay</TitlePaper>
      <Typography component="p" variant="h4">
        {formatThousandDigits(total * 1000)} ₫
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        {formatDateVN(new Date())}
      </Typography>
      <div>
        <Link
          to={config.routes.statistics}
          style={{
            marginTop: "24px",
            color: "var(--main-color)",
            textDecoration: "underline",
            fontSize: "14px",
          }}
        >
          Xem thống kê
        </Link>
      </div>
    </React.Fragment>
  );
}
