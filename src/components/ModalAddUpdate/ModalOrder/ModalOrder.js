import { Box, Grid } from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API_PROVINCE_URL } from "../../../constants";
import { MyModal } from "../../Modal";
import "../ModalAddUpdate.css";

const ModalColor = (props) => {
  const { handleOk, ...others } = props;

  const current = useSelector((state) => state.order.current);
  const orderStatuses = useSelector((state) => state.orderStatus.all);

  const [address, setAddress] = useState(current ? current.address : "");
  const [fullName, setFullName] = useState(current ? current.fullName : "");
  const [telephone, setTelephone] = useState(current ? current.telephone : "");
  const [city, setCity] = useState(current ? current.city : "");
  const [district, setDistrict] = useState(current ? current.district : "");
  const [ward, setWard] = useState(current ? current.ward : "");
  const [tempPrice, setTempPrice] = useState(current ? current.tempPrice : 0);
  const [deliveryPrice, setDeliveryPrice] = useState(
    current ? current.deliveryPrice : 0
  );
  const [totalPrice, setTotalPrice] = useState(
    current ? current.totalPrice : 0
  );
  const [optionsCity, setOptionsCity] = useState([]);
  const [optionsDistrict, setOptionsDistricts] = useState([]);
  const [optionsWards, setOptionsWards] = useState([]);
  const [indexOrderStatus, setIndexOrderStatus] = useState(
    current
      ? orderStatuses.findIndex((item) => item.id === current.orderStatusId)
      : -1
  );

  console.log({ address });

  useEffect(() => {
    (async function () {
      const res = await axios.get(`${API_PROVINCE_URL}?depth=3`);
      setOptionsCity(res.data);
    })();
  }, []);

  useEffect(() => {
    if (optionsCity.length !== 0) {
      const _item = optionsCity.find((item) => item.name === city);
      setOptionsDistricts(_item ? _item.districts : []);
    }
  }, [city, optionsCity]);

  useEffect(() => {
    if (optionsDistrict.length !== 0) {
      const _item = optionsDistrict.find((item) => item.name === district);
      setOptionsWards(_item ? _item.wards : []);
    }
  }, [district, optionsDistrict]);

  return (
    <MyModal
      {...others}
      handleOk={() => {
        handleOk({
          city,
          ward,
          district,
          orderStatusId: orderStatuses[indexOrderStatus].id,
          orderStatus: orderStatuses[indexOrderStatus],
          telephone,
          fullName,
          tempPrice,
          deliveryPrice,
          totalPrice,
          address,
        });
      }}
    >
      <Box p={1}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <div className="form-group">
              <label htmlFor="fullName">H??? t??n</label>
              <input
                required
                placeholder="Nh???p h??? t??n"
                id="fullName"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                }}
              />
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className="form-group">
              <label htmlFor="telephone">S??? ??i???n tho???i</label>
              <input
                required
                placeholder="Nh???p s??? ??i???n tho???i"
                id="telephone"
                value={telephone}
                onChange={(e) => {
                  setTelephone(e.target.value);
                }}
              />
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className="form-group">
              <label htmlFor="address">?????a ch???</label>
              <input
                required
                placeholder="Nh???p ?????a ch???"
                id="address"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className="form-group">
              <label htmlFor="city">T???nh / Th??nh ph???</label>
              <select value={city} onChange={(e) => setCity(e.target.value)}>
                <option value={-1}>Ch???n T???nh / Th??nh ph???</option>
                {optionsCity.map((item, index) => (
                  <option value={item.name} key={index}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className="form-group">
              <label htmlFor="district">Qu???n / Huy???n</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              >
                <option value="">Qu???n / Huy???n</option>
                {optionsDistrict.map((item, index) => (
                  <option value={item.name} key={index}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className="form-group">
              <label htmlFor="ward">Ph?????ng / X??</label>
              <select value={ward} onChange={(e) => setWard(e.target.value)}>
                <option value="">Ch???n Ph?????ng / X??</option>{" "}
                {optionsWards.map((item, index) => (
                  <option value={item.name} key={index}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className="form-group">
              <label htmlFor="tempPrice">Ti???n t???m t??nh</label>
              <input
                required
                id="tempPrice"
                value={tempPrice}
                onChange={(e) => {
                  setTempPrice(e.target.value);
                }}
              />
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className="form-group">
              <label htmlFor="address">Ti???n v???n chuy???n</label>
              <input
                required
                id="deliveryPrice"
                value={deliveryPrice}
                onChange={(e) => {
                  setDeliveryPrice(e.target.value);
                }}
              />
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className="form-group">
              <label htmlFor="totalPrice">T???ng ti???n</label>
              <input
                required
                id="totalPrice"
                value={totalPrice}
                onChange={(e) => {
                  setTotalPrice(e.target.value);
                }}
              />
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className="form-group">
              <label htmlFor="order-status">Tr???ng th??i ????n h??ng</label>
              <select
                value={indexOrderStatus}
                onChange={(e) => setIndexOrderStatus(e.target.value)}
              >
                <option value={-1}>Ch???n Tr???ng th??i ????n h??ng</option>
                {orderStatuses.map((item, index) => (
                  <option value={index} key={index}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </Grid>
        </Grid>
      </Box>
    </MyModal>
  );
};

ModalColor.propTypes = {
  open: PropTypes.bool,
  handleOk: PropTypes.func,
  handleClose: PropTypes.func,
  isCloseAfterOk: PropTypes.bool,
  title: PropTypes.string,
  labelOk: PropTypes.string,
  children: PropTypes.node,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ModalColor;
