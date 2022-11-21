import React, { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box, IconButton, Tooltip, Modal } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate } from "react-router-dom";
import { axiosRes } from "../../config/configAxios";
import { API_PRODUCT_URL } from "../../constants";
import { formatThousandDigits, getURL } from "../../utils";
const SearchBar = (props) => {
  const { open, onClose } = props;

  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setQ("");
    onClose();
    navigate(`/search?q=${q}`);
  }

  useEffect(() => {
    const timerId = setTimeout(async () => {
      if (q !== "") {
        const res = await axiosRes().get(
          `${API_PRODUCT_URL}/search?q=${q}&limit=5`
        );
        setResults(res.items);
      }
    }, [1000]);
    return () => {
      clearTimeout(timerId);
    };
  }, [q]);

  return (
    <Modal open={open} onClose={onClose} disableScrollLock>
      <Box
        width={600}
        position="fixed"
        top="50px"
        left="50%"
        sx={{
          transform: "translate(-50%, 0)",
        }}
        bgcolor="#fff"
      >
        <Box
          display="flex"
          alignItems="center"
          noValidate
          component="form"
          bgcolor="#fff"
          p={1}
          onSubmit={handleSubmit}
        >
          <Tooltip title="Tìm kiếm sản phẩm">
            <IconButton size="small">
              <SearchIcon />
            </IconButton>
          </Tooltip>
          <input
            type="search"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: 16,
            }}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            required
            placeholder="Tìm kiếm tại đây"
          />
        </Box>
        {q !== "" && results.length > 0 && (
          <>
            <Box
              py={1}
              maxHeight={396}
              sx={{
                overflowX: "hidden",
                overflowY: "auto",
              }}
              className="custom-scrollbar"
            >
              {results.map((item, index) => (
                <Link to={`/${item.slug}`} key={index} onClick={onClose}>
                  <Box py={1} px={2} display="flex" alignItems="center">
                    <Box>
                      <img
                        src={getURL(item.avatar)}
                        height="60"
                        alt={item.id}
                      />
                    </Box>
                    <Box ml={1}>
                      <Box mb={2} className="three-dot three-dot-1">
                        {item.name}
                      </Box>
                      <Box fontSize={12} color="var(--main-color)">
                        {formatThousandDigits(item.initPrice)}₫
                      </Box>
                    </Box>
                  </Box>
                </Link>
              ))}
            </Box>
            <Box px={2} textAlign="center" mb={2}>
              <Link
                to={`/search?q=${q}`}
                className="link-default"
                style={{
                  color: "var(--main-color)",
                  textDecoration: "underline",
                }}
                onClick={onClose}
              >
                Xem tất cả
              </Link>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

SearchBar.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default memo(SearchBar);
