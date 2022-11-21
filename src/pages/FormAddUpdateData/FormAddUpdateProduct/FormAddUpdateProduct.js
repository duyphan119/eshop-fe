import { Box, Grid } from "@mui/material";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { axiosRes } from "../../../config/configAxios";
import { API_GROUP_PRODUCT_URL } from "../../../constants";
import { getAllGroupProducts } from "../../../redux/groupProductSlice";
import { toSlug } from "../../../utils";

const FormAddUpdateProduct = () => {
  const { id } = useParams();

  const groupProducts = useSelector((state) => state.groupProduct.all);

  console.log({ groupProducts, id });

  const dispatch = useDispatch();

  const [indexGroupProduct, setIndexGroupProduct] = useState(-1);
  const [name, setName] = useState("");
  const [initPrice, setInitPrice] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [file, setFile] = useState();
  const [slug, setSlug] = useState("");

  useEffect(() => {
    const promises = [];

    promises.push(axiosRes().get(`${API_GROUP_PRODUCT_URL}`));

    Promise.allSettled(promises).then((listRes) => {
      if (listRes[0].status === "fulfilled") {
        dispatch(getAllGroupProducts(listRes[0].value.items));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    setSlug(toSlug(name));
  }, [name]);

  return (
    <Box p={1} bgcolor="#fff">
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <div className="form-group">
            <label htmlFor="group-product">Chọn nhóm sản phẩm</label>
            <select
              id="group-product"
              value={indexGroupProduct}
              onChange={(e) => setIndexGroupProduct(e.target.value)}
            >
              <option value={-1}>Chọn nhóm sản phẩm</option>
              {groupProducts.map((item, index) => (
                <option key={index} value={index}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group mt-1">
            <label htmlFor="name">Tên sản phẩm</label>
            <input
              placeholder="Nhập tên sản phẩm"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group mt-1">
            <label htmlFor="initPrice">Giá ban đầu</label>
            <input
              placeholder="Nhập giá ban đầu"
              id="initPrice"
              value={initPrice}
              onChange={(e) => setInitPrice(e.target.value)}
            />
          </div>
          <div className="form-group mt-1">
            <label htmlFor="name">Giá mới</label>
            <input
              placeholder="Nhập giá mới"
              id="newPrice"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
            />
          </div>{" "}
          <div className="form-group mt-1">
            <label htmlFor="slug">Slug</label>
            <input
              placeholder="Nhập slug"
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="form-group">
            <label htmlFor="label">Hình đại diện</label>
            <input
              type="file"
              id="file"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label className="avatar-product" htmlFor="file">
              {file ? (
                <img alt="" src={URL.createObjectURL(file)} />
              ) : (
                "Chọn hình ảnh"
              )}
            </label>
          </div>
        </Grid>
      </Grid>
      <Box textAlign="center">
        <button>Thêm</button>
      </Box>
    </Box>
  );
};

export default FormAddUpdateProduct;
