import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DoneIcon from "@mui/icons-material/Done";
import { ClickAwayListener } from "@mui/material";
import { useState } from "react";
const sortFilters = [
  {
    text: "Mặc định",
    sortBy: null,
    sortType: null,
  },
  {
    text: "Từ A-Z",
    sortBy: "name",
    sortType: "asc",
  },
  {
    text: "Từ Z-A",
    sortBy: "name",
    sortType: "desc",
  },
  {
    text: "Rẻ nhất",
    sortBy: "price",
    sortType: "asc",
  },
  {
    text: "Giá giảm dần",
    sortBy: "price",
    sortType: "desc",
  },
  {
    text: "Mới nhất",
    sortBy: "createdAt",
    sortType: "desc",
  },
];
const Sort = ({ sortFilter, setSortFilter }) => {
  const [open, setOpen] = useState(false);

  const initFilter = sortFilters.find(
    (item) =>
      item.sortBy === sortFilter.sortBy && item.sortType === sortFilter.sortType
  );

  const handleSelectSortFilter = (item) => {
    setSortFilter(item);
    setOpen(false);
  };

  return (
    <div className="sort-product-wrapper">
      <div>Sắp xếp theo</div>
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <div className="sort-product-select">
          <div
            className="sort-product-select-value"
            onClick={() => setOpen(!open)}
          >
            {sortFilter
              ? initFilter
                ? initFilter.text
                : sortFilters[0].text
              : sortFilters[0].text}
            <ArrowDropDownIcon />
          </div>
          {open && (
            <div className="sort-product-dropdown">
              {sortFilters.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`sort-product-dropdown-item ${
                      sortFilter
                        ? item.sortBy === sortFilter.sortBy &&
                          item.sortType === sortFilter.sortType
                          ? "sort-active"
                          : ""
                        : ""
                    }`}
                    onClick={() => handleSelectSortFilter(item)}
                  >
                    {item.text}
                    <DoneIcon />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </ClickAwayListener>
    </div>
  );
};

export default Sort;
