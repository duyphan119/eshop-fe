import {
  Box,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import MailIcon from "@mui/icons-material/Mail";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import GitHubIcon from "@mui/icons-material/GitHub";
import "./Footer.css";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <Box
      bgcolor="#000"
      sx={{
        p: 4,
        color: "#fff",
        fontSize: 14,
      }}
    >
      <Grid container>
        <Grid item xs={12} sm={3}>
          <div>MUA HÀNG TRỰC TUYẾN</div>
          <div className="footer-phone-contact">0938.803.633</div>
          <div className="footer-phone-contact">1900.633.501</div>
          <div className="footer-email-contact">sales.online@totoday.vn</div>
        </Grid>
        <Grid item xs={12} sm={3}>
          <div>HOTLINE GÓP Ý</div>
          <div className="footer-phone-contact">0908.18.12.89</div>
          <div className="footer-email-contact">cskh@totoday.vn</div>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid container>
            <Grid item xs={12} sm={4}>
              <div className="footer-about-title">Thông tin</div>
              <div>
                <Link
                  className="footer-about-link"
                  to="https://totoshop.vn/gioi-thieu-ve-totoshop-n54492.html"
                >
                  Giới thiệu
                </Link>
                <Link
                  className="footer-about-link"
                  to="https://totoshop.vn/gioi-thieu-ve-totoshop-n54492.html"
                >
                  Liên hệ công ty
                </Link>
                <Link
                  className="footer-about-link"
                  to="https://totoshop.vn/gioi-thieu-ve-totoshop-n54492.html"
                >
                  Đối tác
                </Link>
                <Link
                  className="footer-about-link focus"
                  to="https://totoshop.vn/gioi-thieu-ve-totoshop-n54492.html"
                >
                  Tuyển dụng
                </Link>
              </div>
            </Grid>
            <Grid item xs={12} sm={4}>
              <div className="footer-about-title">Chính sách</div>
              <div>
                <Link
                  className="footer-about-link"
                  to="https://totoshop.vn/gioi-thieu-ve-totoshop-n54492.html"
                >
                  Chính sách đổi hàng
                </Link>
                <Link
                  className="footer-about-link"
                  to="https://totoshop.vn/gioi-thieu-ve-totoshop-n54492.html"
                >
                  Chính sách bảo hành
                </Link>
                <Link
                  className="footer-about-link"
                  to="https://totoshop.vn/gioi-thieu-ve-totoshop-n54492.html"
                >
                  Chính sách bảo mật
                </Link>
                <Link
                  className="footer-about-link"
                  to="https://totoshop.vn/gioi-thieu-ve-totoshop-n54492.html"
                >
                  Chính sách hoàn tiền
                </Link>
              </div>
            </Grid>
            <Grid item xs={12} sm={4}>
              <div className="footer-about-title">FAG</div>
              <div>
                <Link
                  className="footer-about-link"
                  to="https://totoshop.vn/gioi-thieu-ve-totoshop-n54492.html"
                >
                  Thanh toán và vận chuyển
                </Link>
                <Link
                  className="footer-about-link"
                  to="https://totoshop.vn/gioi-thieu-ve-totoshop-n54492.html"
                >
                  Hướng dẫn chọn size
                </Link>
                <Link
                  className="footer-about-link"
                  to="https://totoshop.vn/gioi-thieu-ve-totoshop-n54492.html"
                >
                  Kiểm tra thông tin đơn hàng
                </Link>
                <Link
                  className="footer-about-link"
                  to="https://totoshop.vn/gioi-thieu-ve-totoshop-n54492.html"
                >
                  Câu hỏi thường gặp
                </Link>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
