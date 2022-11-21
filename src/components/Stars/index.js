import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import { memo, useState } from "react";
import { EXAMPLE_STARS_ARRAY } from "../../constants";
const Stars = ({ fontSize, rate, setRate, isActive }) => {
  const [state, setState] = useState(rate || 0);
  return (
    <ul
      style={{
        display: "flex",
        listStyle: "none",
        color: "var(--main-color)",
        padding: 0,
        margin: 0,
      }}
    >
      {EXAMPLE_STARS_ARRAY.map((item) => {
        return (
          <li
            key={item + Math.random()}
            style={{ color: "var(--star-color)", fontSize }}
          >
            {!isActive && item <= rate && (
              <span>
                <StarIcon sx={{ transform: "translateY(1px)", fontSize }} />
              </span>
            )}
            {!isActive &&
              item > rate &&
              (rate !== 0 && Math.ceil(rate) % 5 === 0 ? (
                <span>
                  <StarHalfIcon
                    sx={{ transform: "translateY(1px)", fontSize }}
                  />
                </span>
              ) : (
                <span>
                  <StarBorderIcon
                    sx={{ transform: "translateY(1px)", fontSize }}
                  />
                </span>
              ))}
            {isActive && (
              <span
                onClick={() => {
                  setRate(item);
                }}
                onMouseEnter={() => {
                  if (item > rate) {
                    setState(item);
                  }
                }}
                onMouseLeave={() => {
                  setState(rate);
                }}
              >
                {item <= state ? (
                  <StarIcon sx={{ transform: "translateY(1px)", fontSize }} />
                ) : (
                  <StarBorderIcon
                    sx={{ transform: "translateY(1px)", fontSize }}
                  />
                )}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default memo(Stars);
