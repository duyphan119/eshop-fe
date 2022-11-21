import { Box, Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import pageHeaderImg from "../../assets/imgs/search/bg-page-header.webp";
import Breadcrumbs from "../../components/Breadcrumbs";
import config from "../../config";
import { axiosRes, axiosToken } from "../../config/configAxios";
import {
  API_PROVINCE_URL,
  API_UPLOAD_URL,
  API_USER_URL,
} from "../../constants";
import { setCurrentUser } from "../../redux/authSlice";
import { showToast } from "../../redux/toastSlice";
import { decodeToken, getURL } from "../../utils";

const ProfileEdit = () => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const token = useSelector((state) => state.auth.token);
  const {
    register,
    handleSubmit,
    setValue,
    // formState: { errors },
  } = useForm();

  const [optionsCity, setOptionsCity] = useState([]);
  const [optionsDistrict, setOptionsDistricts] = useState([]);
  const [optionsWards, setOptionsWards] = useState([]);
  const [file, setFile] = useState();
  const [state, setState] = useState({
    city: currentUser?.city || "",
    address: currentUser?.address || "",
    ward: currentUser?.ward || "",
    district: currentUser?.district || "",
    avatar: currentUser?.avatar || "",
  });

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Thông tin tài khoản";
  }, []);

  useEffect(() => {
    if (currentUser) {
      setValue("fullName", currentUser.fullName);
      setValue("telephone", currentUser.telephone);
    }
  }, [currentUser, setValue]);

  useEffect(() => {
    const promises = [];
    const user = decodeToken(token?.accessToken);
    promises.push(axios.get(`${API_PROVINCE_URL}${"?depth=3"}`));
    if (user && user.id) {
      promises.push(
        axiosToken(token?.accessToken, dispatch, navigate).get(
          `${API_USER_URL}/${user.id}`
        )
      );
    }
    Promise.allSettled(promises)
      .then((listRes) => {
        if (listRes[0].status === "fulfilled") {
          setOptionsCity(listRes[0].value.data);
        }
        if (listRes[1] && listRes[1].status === "fulfilled") {
          dispatch(setCurrentUser(listRes[1].value.item));
          setState(listRes[1].value.item);
        }
      })
      .catch((err) => {});
  }, [dispatch, token, navigate]);

  useEffect(() => {
    if (optionsCity.length !== 0) {
      const _item = optionsCity.find((item) => item.name === state.city);
      setOptionsDistricts(_item ? _item.districts : []);
    }
  }, [state.city, optionsCity]);

  useEffect(() => {
    if (optionsDistrict.length !== 0) {
      const _item = optionsDistrict.find(
        (item) => item.name === state.district
      );
      setOptionsWards(_item ? _item.wards : []);
    }
  }, [state.district, optionsDistrict]);

  const onSubmit = async (data) => {
    try {
      const req = { ...data, ...state };
      const formData = new FormData();
      if (file) {
        formData.append("images", file);
        const res = await axiosRes().post(API_UPLOAD_URL, formData);
        req.avatar = res.items[0].path;
      }
      await axiosToken(token?.accessToken, dispatch, navigate).put(
        `${API_USER_URL}/${currentUser.id}`,
        req
      );
      if (file && currentUser.avatar) {
        await axiosRes().delete(API_UPLOAD_URL, {
          data: [{ path: currentUser.avatar }],
        });
      }
      dispatch(setCurrentUser({ ...currentUser, ...req }));
      dispatch(
        showToast({
          isOpen: true,
          text: "Sửa thông tin tài khoản thành công",
          type: "success",
        })
      );
    } catch (error) {}
  };

  if (!currentUser) return "";

  return (
    <Box>
      <div
        style={{
          backgroundImage: `url('${pageHeaderImg}')`,
          width: "100%",
          height: 260,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          paddingInline: 32,
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 8 }}>Sửa thông tin</div>
        <Box pl={2}>
          <Breadcrumbs
            sx={{ fontSize: 10 }}
            items={[
              {
                text: "TRANG CHỦ",
                to: config.routes.home,
              },
              {
                text: "SỬA THÔNG TIN",
              },
            ]}
          />
        </Box>
      </div>
      <Box
        py={6}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Box fontSize={26} mb={3}>
          Sửa thông tin tài khoản cá nhân
        </Box>
        <Box
          width={540}
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <Box
            display="flex"
            alignItems="center"
            borderBottom="1px solid #222"
            pb={1}
            mb={1}
          >
            <Box sx={{ flex: 1 }}>Địa chỉ email</Box>
            <Box sx={{ flex: 2 }}>{currentUser?.email}</Box>
          </Box>

          <Box
            display="flex"
            alignItems="center"
            borderBottom="1px solid #222"
            pb={1}
            mb={1}
          >
            <Box sx={{ flex: 1 }}>Họ tên</Box>
            <Box sx={{ flex: 2 }}>
              <input
                {...register("fullName", {
                  required: "Trường này không được để trống",
                })}
                type="text"
                style={{
                  width: "100%",
                  padding: "8px 4px",
                  borderRadius: "5px",
                  outline: "none",
                  border: "1px solid #000",
                }}
              />
            </Box>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            borderBottom="1px solid #222"
            pb={1}
            mb={1}
          >
            <Box sx={{ flex: 1 }}>Số điện thoại</Box>
            <Box sx={{ flex: 2 }}>
              <input
                {...register("telephone", {
                  required: "Trường này không được để trống",
                })}
                type="text"
                style={{
                  width: "100%",
                  padding: "8px 4px",
                  borderRadius: "5px",
                  outline: "none",
                  border: "1px solid #000",
                }}
              />
            </Box>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            borderBottom="1px solid #222"
            pb={1}
            mb={1}
          >
            <Box sx={{ flex: 1 }}>Tỉnh / Thành phố</Box>
            <Box sx={{ flex: 2 }}>
              <select
                style={{
                  width: "100%",
                  padding: "8px 4px",
                  borderRadius: "5px",
                  outline: "none",
                  border: "1px solid #000",
                }}
                value={state.city}
                onChange={(e) => setState({ ...state, city: e.target.value })}
              >
                <option value="">Chọn Tỉnh / Thành phố</option>
                {optionsCity.map((item, index) => (
                  <option key={index} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Box>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            borderBottom="1px solid #222"
            pb={1}
            mb={1}
          >
            <Box sx={{ flex: 1 }}>Quận / Huyện</Box>
            <Box sx={{ flex: 2 }}>
              <select
                style={{
                  width: "100%",
                  padding: "8px 4px",
                  borderRadius: "5px",
                  outline: "none",
                  border: "1px solid #000",
                }}
                value={state.district}
                onChange={(e) =>
                  setState({ ...state, district: e.target.value })
                }
              >
                <option value="">Chọn Quận / Huyện</option>
                {optionsDistrict.map((item, index) => (
                  <option key={index} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Box>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            borderBottom="1px solid #222"
            pb={1}
            mb={1}
          >
            <Box sx={{ flex: 1 }}>Phường / Xã</Box>
            <Box sx={{ flex: 2 }}>
              <select
                style={{
                  width: "100%",
                  padding: "8px 4px",
                  borderRadius: "5px",
                  outline: "none",
                  border: "1px solid #000",
                }}
                value={state.ward}
                onChange={(e) => setState({ ...state, ward: e.target.value })}
              >
                <option value="">Chọn Phường / Xã</option>
                {optionsWards.map((item, index) => (
                  <option key={index} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Box>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            borderBottom="1px solid #222"
            pb={1}
            mb={1}
          >
            <Box sx={{ flex: 1 }}>Địa chỉ</Box>
            <Box sx={{ flex: 2 }}>
              <input
                type="text"
                style={{
                  width: "100%",
                  padding: "8px 4px",
                  borderRadius: "5px",
                  outline: "none",
                  border: "1px solid #000",
                }}
                value={state.address}
                onChange={(e) =>
                  setState({ ...state, address: e.target.value })
                }
              />
            </Box>
          </Box>
          <Box
            display="flex"
            alignItems="start"
            borderBottom="1px solid #222"
            pb={1}
            mb={1}
          >
            <Box sx={{ flex: 1 }}>Hình đại diện</Box>
            <Box sx={{ flex: 2 }}>
              <label
                htmlFor="avatar"
                style={{
                  width: 64,
                  height: 64,
                  border: "1px solid #000",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  fontSize: 12,
                  backgroundImage: `url('${
                    file ? URL.createObjectURL(file) : getURL(state?.avatar)
                  }')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {(!file || (!state.avatar && !file)) && "Chọn ảnh"}
              </label>
              <input
                type="file"
                id="avatar"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Box>
          </Box>
          <Box display="flex" alignItems="center" pb={1} mb={1}>
            <Box sx={{ flex: 1 }}></Box>
            <Box sx={{ flex: 2 }}>
              <Button
                type="submit"
                sx={{
                  bgcolor: "var(--main-color)",
                  textTransform: "initial",
                  color: "#fff",
                  opacity: "0.9",
                  borderRadius: "0",
                  px: 4,
                  py: 1,
                  fontSize: 16,
                  "&:hover": {
                    bgcolor: "var(--main-color) !important",
                    color: "#fff !important",
                    opacity: 1,
                  },
                }}
              >
                Xác nhận
              </Button>
              <Button
                sx={{
                  bgcolor: "gray",
                  textTransform: "initial",
                  color: "#fff",
                  borderRadius: "0",
                  px: 4,
                  py: 1,
                  ml: 1,
                  fontSize: 16,
                  "&:hover": {
                    bgcolor: "gray !important",
                    color: "#fff !important",
                  },
                }}
                onClick={() => navigate(-1)}
              >
                Huỷ
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileEdit;
