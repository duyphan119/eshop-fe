import SlickSlider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PropTypes from "prop-types";
const Slider = (props) => {
  const { settings, children } = props;
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
  return <SlickSlider {..._settings}>{children}</SlickSlider>;
};
Slider.propTypes = {
  settings: PropTypes.object,
  children: PropTypes.node,
};

export default Slider;
