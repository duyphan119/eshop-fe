import { Box, Grid } from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API_PROVINCE_URL } from "../../../constants";
import { getURL } from "../../../utils";
import { MyModal } from "../../Modal";

import "../ModalAddUpdate.css";
const ModalUser = (props) => {
  const { handleOk, ...others } = props;

  const current = useSelector((state) => state.user.current);
  const roles = useSelector((state) => state.role.all);

  const [email, setEmail] = useState(current ? current.email : "");
  const [password, setPassword] = useState(current ? current.password : "");
  const [fullName, setFullName] = useState(current ? current.fullName : "");
  const [telephone, setTelephone] = useState(current ? current.telephone : "");
  const [address, setAddress] = useState(current ? current.address : "");
  const [indexRole, setIndexRole] = useState(
    current ? roles.findIndex((item) => item.id === current.roleId) : -1
  );
  const [city, setCity] = useState(current ? current.city : "");
  const [district, setDistrict] = useState(current ? current.district : "");
  const [ward, setWard] = useState(current ? current.ward : "");
  const [optionsCity, setOptionsCity] = useState([]);
  const [optionsDistrict, setOptionsDistricts] = useState([]);
  const [optionsWards, setOptionsWards] = useState([]);
  const [file, setFile] = useState();

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
          email,
          password,
          fullName,
          telephone,
          address,
          city,
          ward,
          district,
          roleId: roles[indexRole].id,
          role: roles[indexRole],
          file,
        });
      }}
    >
      <Box p={1}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <div className="form-group">
              <label htmlFor="email">?????a ch??? email</label>
              <input
                required
                placeholder="Nh???p ?????a ch??? email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className="form-group">
              <label htmlFor="password">M???t kh???u</label>
              <input
                required
                placeholder="Nh???p m???t kh???u"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className="form-group">
              <label htmlFor="fullName">H??? t??n</label>
              <input
                required
                placeholder="Nh???p h??? t??n"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className="form-group">
              <label htmlFor="telephone">S??? ??i???n tho???i</label>
              <input
                required
                placeholder="Nh???p s??? ??i???n tho???i"
                id="telephone"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
              />
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className="form-group">
              <label htmlFor="address">?????a ch???</label>
              <input
                required
                placeholder="Nh???p ?????a ch???"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </Grid>
          <Grid item xs={4}>
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
          <Grid item xs={4}>
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
          <Grid item xs={4}>
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
          <Grid item xs={4}>
            <div className="form-group">
              <label htmlFor="ward">Quy???n</label>
              <select
                value={indexRole}
                onChange={(e) => setIndexRole(e.target.value)}
              >
                <option value={-1}>Ch???n quy???n</option>{" "}
                {roles.map((item, index) => (
                  <option value={index} key={index}>
                    {item.id} - {item.role}
                  </option>
                ))}
              </select>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className="form-group mt-1">
              <label htmlFor="label">H??nh ?????i di???n</label>
              <input
                type="file"
                id="file"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />
              <label className="avatar-group-product" htmlFor="file">
                {file ? (
                  <img alt="" src={URL.createObjectURL(file)} />
                ) : current && current.avatar ? (
                  <img alt="" src={getURL(current.avatar)} />
                ) : (
                  "Ch???n h??nh ???nh ?????i di???n"
                )}
              </label>
            </div>
          </Grid>
        </Grid>
      </Box>
    </MyModal>
  );
};

ModalUser.propTypes = {
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

export default ModalUser;
