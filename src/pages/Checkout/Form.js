import { Box, Divider, Grid } from "@mui/material";
import axios from "axios";
import { memo } from "react";
import { useEffect, useState } from "react";
import { TitleControl } from "../../components/Title";
import { API_PROVINCE_URL } from "../../constants";
const Form = ({ order, setOrder, setDeliveryPrice }) => {
  const [optionsCity, setOptionsCity] = useState([]);
  const [optionsDistrict, setOptionsDistricts] = useState([]);
  const [optionsWards, setOptionsWards] = useState([]);
  useEffect(() => {
    (async function () {
      const res = await axios.get(`${API_PROVINCE_URL}?depth=3`);
      setOptionsCity(res.data);
    })();
  }, []);

  useEffect(() => {
    if (order.city === "Thành phố Hồ Chí Minh") {
      setDeliveryPrice();
    } else {
      setDeliveryPrice(20000);
    }
  }, [order.city, setDeliveryPrice]);

  useEffect(() => {
    if (optionsCity.length !== 0) {
      const _item = optionsCity.find((item) => item.name === order.city);
      setOptionsDistricts(_item ? _item.districts : []);
    }
  }, [order.city, optionsCity]);

  useEffect(() => {
    if (optionsDistrict.length !== 0) {
      const _item = optionsDistrict.find(
        (item) => item.name === order.district
      );
      setOptionsWards(_item ? _item.wards : []);
    }
  }, [order.district, optionsDistrict]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={6} pr={2}>
        <Box p={2}>
          <TitleControl>Thông tin giao hàng</TitleControl>
          <Grid container spacing={1}>
            <Grid item xs={7}>
              <div className="form-group">
                <label htmlFor="fullName">Họ và Tên *</label>
                <input
                  value={order.fullName}
                  onChange={(e) =>
                    setOrder({ ...order, fullName: e.target.value })
                  }
                  id="fullName"
                  type="text"
                  placeholder="Họ Tên"
                />
              </div>
            </Grid>
            <Grid item xs={5}>
              <div className="form-group">
                <label htmlFor="telephone">Số điện thoại *</label>
                <input
                  id="telephone"
                  value={order.telephone}
                  onChange={(e) =>
                    setOrder({ ...order, telephone: e.target.value })
                  }
                  type="text"
                  placeholder="Số điện thoại"
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className="form-group">
                <label htmlFor="address">Địa chỉ *</label>
                <input
                  id="street"
                  value={order.address}
                  onChange={(e) =>
                    setOrder({ ...order, address: e.target.value })
                  }
                  type="text"
                  placeholder="Địa chỉ"
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className="form-group">
                <label htmlFor="city">Tỉnh / Thành phố *</label>
                <select
                  value={order.city}
                  onChange={(e) => setOrder({ ...order, city: e.target.value })}
                >
                  <option value={-1}>Chọn Tỉnh / Thành phố</option>
                  {optionsCity.map((item, index) => (
                    <option value={item.name} key={index}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className="form-group">
                <label htmlFor="district">Quận / Huyện *</label>
                <select
                  value={order.district}
                  onChange={(e) =>
                    setOrder({ ...order, district: e.target.value })
                  }
                >
                  <option value="">Quận / Huyện</option>
                  {optionsDistrict.map((item, index) => (
                    <option value={item.name} key={index}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className="form-group">
                <label htmlFor="ward">Phường / Xã *</label>
                <select
                  value={order.ward}
                  onChange={(e) => setOrder({ ...order, ward: e.target.value })}
                >
                  <option value="">Chọn Phường / Xã</option>{" "}
                  {optionsWards.map((item, index) => (
                    <option value={item.name} key={index}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className="form-group">
                <label htmlFor="address">Ghi chú</label>
                <textarea
                  value={order.description}
                  onChange={(e) =>
                    setOrder({ ...order, description: e.target.value })
                  }
                  rows={4}
                  placeholder="Ghi chú đơn hàng"
                ></textarea>
              </div>
            </Grid>
          </Grid>
        </Box>
      </Grid>

      <Grid item xs={12} md={6} sx={{ position: "relative" }}>
        <Box p={2}>
          <Divider orientation="vertical" />
          <TitleControl>Phương thức thanh toán</TitleControl>
          <div className="form-group-checkbox">
            <input
              type="checkbox"
              id="payment-method"
              checked={true}
              onChange={(e) => {}}
            />
            <label htmlFor="payment-method">
              Thanh toán tiền mặt khi nhận hàng (COD)
            </label>
          </div>
        </Box>
        <div style={{ position: "absolute", top: 0, left: 0 }}>
          <Divider orientation="vertical" />
        </div>
      </Grid>
    </Grid>
  );
};

export default memo(Form);
