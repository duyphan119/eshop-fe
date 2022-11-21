import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import Paper from "@mui/material/Paper";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConfirmDialog from "../../components/ConfirmDialog";
import Pagination from "../../components/Pagination";
import { configAxiosAll, axiosRes } from "../../config/configAxios";
import {
  API_BANNER_URL,
  API_UPLOAD_URL,
  LIMIT_ROW_BANNER,
} from "../../constants";
import {
  changeLimit,
  changePage,
  deleteBanner,
  getCurrentBanner,
  newBanner,
  updateBanner,
} from "../../redux/bannerSlice";
import { calHeightDataGrid } from "../../utils";

const BannerTabPanel = () => {
  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      sortable: true,
      filter: true,
    },
    {
      field: "url",
      headerName: "Hình ảnh",
      flex: 2,
      cellRenderer: (params) => (
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <img src={params.data.url} height="30" alt="" />
        </div>
      ),
    },
    {
      field: "page",
      headerName: "Trang",
      flex: 1,
    },
    {
      field: "href",
      headerName: "Liên kết tới",
      flex: 2,
      sortable: true,
      filter: true,
    },
    {
      field: "position",
      headerName: "Vị trí",
      flex: 2,
      sortable: true,
      filter: true,
    },
    {
      field: "isShow",
      headerName: "Hiển thỉ",
      flex: 1,
      sortable: true,
      cellRenderer: (params) =>
        params.data.isShow ? (
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <CheckBoxIcon sx={{ color: "var(--success-color)" }} />
          </div>
        ) : (
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <CancelIcon sx={{ color: "var(--error-color)" }} />
          </div>
        ),
    },
    {
      field: "actions",
      headerName: "",
      pinned: "right",
      width: 120,
      cellRenderer: (params) => (
        <>
          <Tooltip title="Sửa banner">
            <IconButton
              color="secondary"
              onClick={() => {
                dispatch(getCurrentBanner(params.data));
                setOpen(true);
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xoá banner">
            <IconButton
              color="error"
              onClick={() => {
                dispatch(getCurrentBanner(params.data));
                setOpenDialog(true);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];
  const user = useSelector((state) => state.auth.currentUser);
  const banner = useSelector((state) => state.banner.banner);
  const current = useSelector((state) => state.banner.current);
  const page = useSelector((state) => state.banner.page);
  const limit = useSelector((state) => state.banner.limit);

  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  async function getData(data) {
    const { file, position, href, isShow, page } = data;
    let urlList;
    try {
      if (file) {
        let formData = new FormData();
        formData.append("images", file);
        urlList = await axiosRes().post(`${API_UPLOAD_URL}`, formData);
      }
      if (current) {
        const req = {
          id: current.id,
          position,
          href,
          isShow,
          page,
          url: urlList && urlList.length > 0 ? urlList[0].path : current.url,
        };
        await configAxiosAll(user, dispatch).put(`${API_BANNER_URL}`, req);
        dispatch(updateBanner({ ...current, ...req }));
      } else {
        const created = await configAxiosAll(user, dispatch).post(
          `${API_BANNER_URL}`,
          {
            position,
            href,
            isShow,
            page,
            url: urlList && urlList.length > 0 ? urlList[0].path : null,
          }
        );
        dispatch(newBanner(created));
      }
    } catch (error) {}
  }

  async function onConfirm() {
    try {
      if (current) {
        await configAxiosAll(user, dispatch).delete(
          `${API_BANNER_URL}/${current.id}`
        );
        await axiosRes().get(
          `${API_BANNER_URL}?limit=${LIMIT_ROW_BANNER}&p=${page}`
        );
        dispatch(deleteBanner(current.id));
      }
    } catch (error) {}
  }

  return (
    <>
      <Box p={1} bgcolor="#fff">
        <Button
          variant="contained"
          sx={{ mb: 2 }}
          onClick={() => {
            dispatch(getCurrentBanner(null));
            setOpen(true);
          }}
          startIcon={<AddIcon />}
        >
          Thêm banner
        </Button>
        {banner && (
          <div
            style={{
              width: "100%",
              overflow: "hidden",
              height: calHeightDataGrid(LIMIT_ROW_BANNER),
            }}
          >
            <div
              className="ag-theme-alpine"
              style={{ width: "100%", height: "100%" }}
            >
              <AgGridReact
                rowData={banner.items}
                columnDefs={columns}
              ></AgGridReact>
            </div>
          </div>
        )}
        {banner && banner.total_page && banner.total_page > 1 && (
          <Box display="flex" justifyContent="center" mt={1}>
            <Pagination
              showRowsPerPage={true}
              listRowPerPage={[LIMIT_ROW_BANNER, 50, 100, 200, 500]}
              rowsPerPage={limit}
              onChangeRowsPerPage={(l) => dispatch(changeLimit(l))}
              page={page}
              totalPage={banner.total_page}
              onChange={(e, value) => dispatch(changePage(value))}
            />
          </Box>
        )}
      </Box>
      {openDialog && (
        <ConfirmDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onConfirm={onConfirm}
          text="Bạn có chắc chắn muốn xoá banner này ?"
        />
      )}
    </>
  );
};

export default BannerTabPanel;
