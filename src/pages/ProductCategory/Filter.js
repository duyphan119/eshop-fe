import { Badge, Box, ClickAwayListener, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import filter_icon from "../../assets/svg/svgexport-8.svg";
const priceFilters = [
  {
    text: "Dưới 100.000₫",
    value: "0:100000",
  },
  {
    text: "100.000₫ - 300.000₫",
    value: "100000:300000",
  },
  {
    text: "300.000₫ - 500.000₫",
    value: "300000:500000",
  },
  {
    text: "500.000₫ - 800.000₫",
    value: "500000:800000",
  },
  {
    text: "Trên 800.000₫",
    value: "800000",
  },
];
const Filter = ({ filters, setFilters, colorFilters, sizeFilters }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (key, value) => {
    let _filters = { ...filters };
    if (!_filters[key] || !_filters[key].values) {
      _filters = {
        ..._filters,
        [key]: {
          values: [value],
        },
      };
    } else {
      const index = _filters[key].values.findIndex((item) => item === value);
      if (index !== -1) {
        _filters[key].values.splice(index, 1);
      } else {
        _filters[key].values.push(value);
      }
    }
    setFilters(_filters);
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div className="filter-product">
        <Badge badgeContent={0} color="info" onClick={() => setOpen(!open)}>
          <img
            alt=""
            src={filter_icon}
            width="20px"
            height="20px"
            style={{ transform: "translateY(-1px)", marginRight: "8px" }}
          />
          Lọc
        </Badge>
        <Box
          width="20vw"
          p={2}
          sx={{
            overflowX: "hidden",
            overflowY: "overlay",
            transform: open ? "translateX(0)" : "translateX(-20vw)",
            transition: "transform linear 0.2s",
            cursor: "default",
          }}
          position="fixed"
          left={0}
          bgcolor="#fff"
          top={0}
          height="100vh"
          className="custom-scrollbar"
        >
          <Box textAlign="right">
            <Tooltip title="Đóng">
              <span
                style={{ cursor: "pointer" }}
                onClick={() => setOpen(false)}
              >
                <CloseIcon />
              </span>
            </Tooltip>
          </Box>
          <Box mb={3}>
            <Box borderBottom="1px solid #000" fontSize={22}>
              Giá
            </Box>
            <Box>
              {priceFilters.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      color: "var(--main-color)",
                      textDecoration: "underline",
                    },
                  }}
                  fontSize={12}
                  my={1}
                  onClick={() => handleSelect("price", item.value)}
                >
                  {item.text}
                </Box>
              ))}
            </Box>
          </Box>
          <Box mb={3}>
            <Box borderBottom="1px solid #000" mb={1} fontSize={22}>
              Màu
            </Box>
            <Box display="flex" flexWrap="wrap" justifyContent="space-between">
              {colorFilters.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      color: "var(--main-color)",
                      textDecoration: "underline",
                    },
                  }}
                  fontSize={12}
                  width="50%"
                  my={1}
                  onClick={() => handleSelect("color", item)}
                >
                  {item}
                </Box>
              ))}
            </Box>
          </Box>
          <Box>
            <Box borderBottom="1px solid #000" mb={1} fontSize={22}>
              Kích cỡ
            </Box>
            <Box display="flex" flexWrap="wrap" justifyContent="space-between">
              {sizeFilters.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      color: "var(--main-color)",
                      textDecoration: "underline",
                    },
                  }}
                  fontSize={12}
                  width="calc(100% / 3)"
                  my={1}
                  onClick={() => handleSelect("size", item)}
                >
                  {item}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </div>
    </ClickAwayListener>
  );
};

export default Filter;
