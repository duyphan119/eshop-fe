/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Button } from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { formatThousandDigits, getThumbnailProduct } from "../../../utils";
import { configAxiosAll } from "../../../config/configAxios";
import { API_PRODUCT_URL, LIMIT_SEARCH_RESULT } from "../../../constants";

const SearchBar = () => {
  const user = useSelector((state) => state.auth.currentUser);

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [searchResult, setSearchResult] = useState();
  const [showResult, setShowResult] = useState(false);

  const inputRef = useRef();

  useEffect(() => {
    const timerId = setTimeout(() => {
      (async function () {
        if (q !== "") {
          const data = await configAxiosAll(user, dispatch).get(
            `${API_PRODUCT_URL}/search?include=true&q=${q}&limit=${LIMIT_SEARCH_RESULT}`
          );
          setSearchResult(data);
        } else {
          setSearchResult();
        }
      })();
    }, 600);
    return () => {
      clearTimeout(timerId);
    };
  }, [q]);

  function handleSubmit(e) {
    e.preventDefault();
    inputRef.current = q;
    if (q !== "") {
      setQ("");
      navigate(`/search?q=${inputRef.current}`);
    }
  }

  return (
    <div className="header-search">
      <form className="header-form-search" onSubmit={handleSubmit}>
        <ClickAwayListener onClickAway={() => setShowResult(false)}>
          <>
            <input
              type="search"
              placeholder="Tìm tại đây"
              required
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => {
                setShowResult(true);
              }}
            />
            <button type="submit">
              <SearchOutlinedIcon
                style={{
                  color: "#000",
                }}
              />
            </button>
            {showResult &&
              searchResult &&
              searchResult.items &&
              searchResult.items.length > 0 && (
                <ul className="header-search-result">
                  {searchResult &&
                    searchResult.items &&
                    searchResult.items.map((item) => {
                      return (
                        <li key={item.id + Math.random()}>
                          <Link
                            to={`/${item.slug}`}
                            className="header-search-result-link"
                          >
                            <img src={getThumbnailProduct(item)} alt="" />
                            <div>
                              <div className="three-dot three-dot-2">
                                {item.name}
                              </div>
                              <div>{formatThousandDigits(item.price)} ₫</div>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  <li className="header-search-result-view-all">
                    <Button
                      onClick={() => {
                        navigate(`/search?q=${q}`);
                      }}
                      size="small"
                    >
                      Xem tất cả
                    </Button>
                  </li>
                </ul>
              )}
          </>
        </ClickAwayListener>
      </form>
    </div>
  );
};

export default memo(SearchBar);
