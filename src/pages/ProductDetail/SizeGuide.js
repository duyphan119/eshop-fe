import { Box, Button, Slider, Typography } from "@mui/material";
import { useMemo, useState } from "react";
const MIN_HEIGHT = 80;
const MAX_HEIGHT = 200;
const MIN_WEIGHT = 10;
const MAX_WEIGHT = 120;
const NOT_FOUND = "Chưa có size phù hợp";
const SizeGuide = ({ handleClose, guides }) => {
  const [height, setHeight] = useState(MIN_HEIGHT);
  const [weight, setWeight] = useState(MIN_WEIGHT);
  const showSizeResult = useMemo(() => {
    if (weight === MIN_WEIGHT || height === MIN_HEIGHT) {
      return NOT_FOUND;
    }

    let indexHeight = -1;
    let indexWeight = -1;
    guides.forEach((item, index) => {
      if (
        (item.min_height === 0 && height <= item.max_height) ||
        (item.max_height === 0 && height >= item.min_height) ||
        (height >= item.min_height && height <= item.max_height)
      ) {
        indexHeight = index;
      }
      if (
        (item.min_weight === 0 && weight <= item.max_weight) ||
        (item.max_weight === 0 && weight >= item.min_weight) ||
        (weight >= item.min_weight && weight <= item.max_weight)
      ) {
        indexWeight = index;
      }
    });
    if (indexHeight === -1 || indexHeight === -1) {
      return NOT_FOUND;
    } else {
      return guides[indexHeight >= indexWeight ? indexHeight : indexWeight].size
        .value;
    }
  }, [height, weight, guides]);
  return (
    <Box
      sx={{
        border: "3px dashed var(--main-color)",
        borderRadius: "5px",
        py: 2,
        px: 3,
        my: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography>Chiều cao</Typography>
        <Typography>{height}cm</Typography>
      </Box>
      <Slider
        value={height}
        min={MIN_HEIGHT}
        max={MAX_HEIGHT}
        onChange={(e, value) => setHeight(value)}
        valueLabelDisplay="auto"
        aria-label="Default"
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography>Cân nặng</Typography>
        <Typography>{weight}kg</Typography>
      </Box>
      <Slider
        value={weight}
        min={MIN_WEIGHT}
        max={MAX_WEIGHT}
        onChange={(e, value) => setWeight(value)}
        valueLabelDisplay="auto"
        aria-label="Default"
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {showSizeResult === NOT_FOUND ? (
          NOT_FOUND
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "5px",
              bgcolor: "var(--main-color)",
              color: "#fff",
              minWidth: 50,
              minHeight: 50,
              p: 1,
            }}
          >
            {showSizeResult}
          </Box>
        )}
        <Button sx={{ mt: 1 }} onClick={handleClose}>
          Đóng
        </Button>
      </Box>
    </Box>
  );
};

export default SizeGuide;
