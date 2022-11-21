import { Box, Grid } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { useSelector } from "react-redux";
import { getURL, toSlug } from "../../../utils";
import { MyModal } from "../../Modal";
import "../ModalAddUpdate.css";

const ModalCategory = (props) => {
  const { handleOk, ...others } = props;

  const current = useSelector((state) => state.groupCategory.current);

  const [name, setName] = useState(current ? current.name : "");
  const [shortName, setShortName] = useState(current ? current.shortName : "");
  const [slug, setSlug] = useState(current ? current.slug : "");
  const [fileBanner, setFileBanner] = useState();
  const [fileAvatar, setFileAvatar] = useState();
  const [isHot, setIsHot] = useState(current ? current.isHot : false);
  const [description, setDescription] = useState(
    current ? (current.description ? current.description : "") : ""
  );

  return (
    <MyModal
      {...others}
      handleOk={() => {
        handleOk({
          name,
          slug,
          shortName,
          description,
          avatar: fileAvatar
            ? URL.createObjectURL(fileAvatar)
            : !current
            ? null
            : current.avatar,
          banner: fileBanner
            ? URL.createObjectURL(fileBanner)
            : !current
            ? null
            : current.banner,
          fileAvatar,
          fileBanner,
          isHot,
        });
      }}
    >
      <Box p={1}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <div className="form-group">
              <label htmlFor="name">Tên nhóm danh mục</label>
              <input
                required
                placeholder="Nhập tên nhóm danh mục"
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSlug(toSlug(e.target.value));
                }}
              />
            </div>
            <div className="form-group mt-1">
              <label htmlFor="shortName">Tên viết tắt</label>
              <input
                required
                placeholder="Nhập tên viết tắt"
                id="shortName"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
              />
            </div>
            <div className="form-group mt-1">
              <label htmlFor="slug">Slug</label>
              <input
                required
                placeholder="Nhập slug"
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <div className="form-group mt-1">
              <label htmlFor="is-hot">Đang hot</label>
              <select
                id="is-hot"
                value={isHot}
                onChange={(e) => setIsHot(e.target.value)}
              >
                <option value={false}>Không</option>
                <option value={true}>Hot</option>
              </select>
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className="form-group">
              <label htmlFor="description">Mô tả</label>
              <textarea
                placeholder="Nhập mô tả"
                id="description"
                value={description}
                rows={5}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="form-group mt-1">
              <label htmlFor="label">Hình đại diện</label>
              <input
                type="file"
                id="file"
                hidden
                onChange={(e) => setFileAvatar(e.target.files[0])}
              />
              <label className="avatar-group-product" htmlFor="file">
                {fileAvatar ? (
                  <img alt="" src={URL.createObjectURL(fileAvatar)} />
                ) : current && current.avatar ? (
                  <img alt="" src={getURL(current.avatar)} />
                ) : (
                  "Chọn hình ảnh đại diện"
                )}
              </label>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className="form-group">
              <label htmlFor="label">Hình ảnh quảng cáo</label>
              <input
                type="file"
                id="file"
                hidden
                onChange={(e) => setFileBanner(e.target.files[0])}
              />
              <label className="banner-group-product" htmlFor="file">
                {fileBanner ? (
                  <img alt="" src={URL.createObjectURL(fileBanner)} />
                ) : current && current.banner ? (
                  <img alt="" src={getURL(current.banner)} />
                ) : (
                  "Chọn hình ảnh quảng cáo"
                )}
              </label>
            </div>
          </Grid>
        </Grid>
      </Box>
    </MyModal>
  );
};

ModalCategory.propTypes = {
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

export default ModalCategory;
