import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Avatar, ClickAwayListener, Paper, Tooltip } from "@mui/material";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { configAxiosAll } from "../../../config/configAxios";
import { API_NOTIFICATION_URL } from "../../../constants";
import { SocketContext } from "../../../context";
import {
  deleteNotification,
  getNotification,
  newNotification,
  readAll,
  updateNotification,
} from "../../../redux/notificationSlice";
import { fromNow } from "../../../utils";
const NotificationIcon = () => {
  const [showNotifications, setShowNotifications] = React.useState(false);

  const notification = useSelector((state) => state.notification.notification);
  const user = useSelector((state) => state.auth.currentUser);

  const dispatch = useDispatch();

  const socket = React.useContext(SocketContext);

  const getCount = React.useMemo(() => {
    try {
      if (notification) {
        return [...notification.items].filter((item) => !item.isRead).length;
      }
    } catch (error) {
      console.log("error", notification.items);
    }
    return 0;
  }, [notification]);

  React.useEffect(() => {
    (async function () {
      const data = await configAxiosAll(user, dispatch).get(
        `${API_NOTIFICATION_URL}`
      );
      dispatch(getNotification(data));
    })();
  }, [user, dispatch]);

  React.useEffect(() => {
    if (getCount !== 0) {
      document.title = `(${getCount}) ${document.title}`;
    } else {
      if (document.title.includes(") ")) {
        document.title = `${document.title.split(") ")[1]}`;
      }
    }
  }, [getCount]);

  React.useEffect(() => {
    const handler = (item) => {
      if (user.role.role === "admin") {
        dispatch(newNotification(item));
      }
    };
    socket.on("receive-notify", handler);
    return () => socket.off("receive-notify", handler);
  }, [socket, dispatch, user]);

  async function handleDelete(id) {
    try {
      await configAxiosAll(user, dispatch).delete(
        `${API_NOTIFICATION_URL}/${id}`
      );
      dispatch(deleteNotification(id));
    } catch (error) {}
  }

  return (
    <div style={{ position: "relative" }}>
      <IconButton
        color="inherit"
        onClick={() => {
          if (!showNotifications && getCount !== 0) {
            (async function () {
              try {
                await configAxiosAll(user, dispatch).put(
                  `${API_NOTIFICATION_URL}?readAll=true`
                );
                dispatch(readAll());
              } catch (error) {}
            })();
          }
          setShowNotifications(!showNotifications);
        }}
      >
        <Badge badgeContent={getCount} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      {showNotifications && (
        <ClickAwayListener
          onClickAway={() => {
            setShowNotifications(false);
          }}
        >
          <Paper className="custom-scrollbar notification-wrapper">
            {notification &&
              notification.items.map((item, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <Link
                    to={item.href}
                    onClick={() => {
                      setShowNotifications(false);
                      dispatch(updateNotification({ ...item, isRead: true }));
                    }}
                    className="notification-link"
                    style={{
                      backgroundColor: item.isRead ? "#fff" : "#eee",
                    }}
                  >
                    <div className="notification-avatar-wrapper">
                      <Avatar
                        src={item.sender.avatar}
                        alt=""
                        sx={{ width: 60, height: 60 }}
                      />
                    </div>
                    <div className="notification-text-wrapper">
                      <div className="notification-title three-dot three-dot-3">
                        {item.title}
                      </div>
                      <div className="notification-from-now">
                        {fromNow(item.createdAt)}
                      </div>
                    </div>
                  </Link>
                  <div className="notification-actions">
                    <Tooltip title="Xoá thông báo">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(item.id)}
                      >
                        <DeleteOutlineOutlinedIcon
                          sx={{ fontSize: 20, cursor: "pointer" }}
                        />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              ))}
          </Paper>
        </ClickAwayListener>
      )}
    </div>
  );
};

export default React.memo(NotificationIcon);
