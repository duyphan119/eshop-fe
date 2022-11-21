import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Slider.css";

const BannerSlider = ({ banners, settings }) => {
  const _settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: true,
    autoplay: true,
    arrows: false,
    ...settings,
  };
  return (
    <Slider {..._settings}>
      {banners.map((item, index) => {
        return (
          <Link to={`${item.href}`} key={index}>
            <img
              src={item.url}
              alt=""
              style={{
                objectFit: "cover",
                width: "100%",
                position: "relative",
              }}
            />
          </Link>
        );
      })}
    </Slider>
  );
};

export default BannerSlider;
