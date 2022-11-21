import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";

export function TitlePaper(props) {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {props.children}
    </Typography>
  );
}

export function TitleAccount({ leftLabel, rightLabel }) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={2}
      borderBottom="1px solid black"
    >
      {leftLabel && (
        <Typography color="var(--main-color)">{leftLabel}</Typography>
      )}
      {rightLabel && <Typography>{rightLabel}</Typography>}
    </Box>
  );
}

export function TitlePage({ children }) {
  return <Typography variant="h4">{children}</Typography>;
}
export function TitleControl({ children }) {
  return (
    <Typography variant="body1" sx={{ fontWeight: 600 }}>
      {children}
    </Typography>
  );
}

export function TitleCenter(props) {
  return (
    <Typography
      component="h2"
      variant="h6"
      color="#000"
      gutterBottom
      textAlign="center"
      textTransform="uppercase"
      my={2}
    >
      {props.children}
    </Typography>
  );
}
