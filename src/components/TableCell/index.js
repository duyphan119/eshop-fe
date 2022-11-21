import { TableCell } from "@mui/material";

export function CustomTableCell({ children, align, header }) {
  return (
    <TableCell align={align} sx={{ p: header ? 1 : 0 }}>
      <span
        style={{
          fontSize: header ? "14px" : "12px",
          fontWeight: header ? "600" : "500",
        }}
      >
        {children}
      </span>
    </TableCell>
  );
}
