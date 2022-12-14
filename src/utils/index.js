import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { SERVER_URL } from "../constants";
import jwtDecode from "jwt-decode";

export const calculateProductSale = (price, sale) => {
  return (price / 1000 - Math.floor(((price / 1000) * sale) / 100)) * 1000;
};

export const getCouponPrice = (price, percent) => {
  return (((price / 1000) * percent) / 100) * 1000;
};

export const getThumbnailProduct = (product) => {
  try {
    if (product && product.colors && product.colors.length > 0) {
      if (product.colors[0].images && product.colors[0].images.length > 0) {
        return product.colors[0].images[0].url;
      }
    }
  } catch (error) {}
  return "";
};
export const getThumbnailCartItem = (item) => {
  try {
    const image = item.detail.product.images.find(
      (el) => el.color_id === item.detail.color.id
    );
    if (image) {
      return image.url;
    }
  } catch (error) {}
  return "";
};
export const formatThousandDigits = (price) => {
  try {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  } catch (error) {
    return 0;
  }
};
export const formatInputDate = (input) => {
  if (!input) return "";
  const dt = new Date(input.toString());
  let date = dt.getDate();
  let month = dt.getMonth() + 1;
  return `${dt.getFullYear()}-${month < 10 ? "0" + month : month}-${
    date < 10 ? "0" + date : date
  }`;
};
export const formatDateVN = (input) => {
  if (!input) return "";
  const dt = new Date(input.toString());
  let date = dt.getDate();
  let month = dt.getMonth() + 1;
  return `${date < 10 ? "0" + date : date}/${
    month < 10 ? "0" + month : month
  }/${dt.getFullYear()}`;
};
export const formatTimeVN = (input) => {
  if (!input) return "";
  const dt = new Date(input.toString());

  let hour = dt.getHours();
  let minute = dt.getMinutes();
  let second = dt.getSeconds();

  return `${hour < 10 ? "0" + hour : hour}:${
    minute < 10 ? "0" + minute : minute
  }:${second < 10 ? "0" + second : second}`;
};
export const formatDateTimeVN = (input) => {
  return `${formatDateVN(input)} ${formatTimeVN(input)}`;
};
export const ignoreTimezone = (date) => {
  let tzoffset = new Date().getTimezoneOffset() * 60000;
  let localISOTime = new Date(Date.now() - tzoffset).toISOString().slice(0, -1);
  return localISOTime;
};

export const fromNow = (date) => {
  const created = new Date(date).getTime();
  let periods = {
    n??m: 12 * 30 * 24 * 60 * 60 * 1000,
    th??ng: 30 * 24 * 60 * 60 * 1000,
    tu???n: 7 * 24 * 60 * 60 * 1000,
    ng??y: 24 * 60 * 60 * 1000,
    gi???: 60 * 60 * 1000,
    ph??t: 60 * 1000,
    gi??y: 1000,
  };
  let diff = Date.now() - created;

  for (const key in periods) {
    if (diff >= periods[key]) {
      let result = Math.floor(diff / periods[key]);
      return `${result} ${key} tr?????c`;
    }
  }

  return "V??i gi??y tr?????c";
};

export const getTotalPrice = (cart) => {
  let result = 0;
  if (cart) {
    cart.items.forEach((item) => {
      if (item?.detail?.product?.groupProduct?.discounts[0]?.percent) {
        result +=
          getFinalPrice(
            item.detail.product.initPrice,
            item.detail.product.groupProduct.discounts[0]
          ) * item.quantity;
      } else {
        result += item.quantity * item.detail.product.initPrice;
      }
    });
  }
  return result;
};

export const getTotalDaysOfMonth = () => {
  let dt = new Date();
  let month = dt.getMonth();
  let year = dt.getFullYear();
  return new Date(year, month, 0).getDate();
};

export const calHeightDataGrid = (
  rowCount,
  rowHeight = 52,
  rowHeaderHeight = 56,
  paginationHeight = 54
) => {
  return rowCount * rowHeight + rowHeaderHeight + paginationHeight + 1;
};
export const getSku = (groupProduct, product, color, size) => {
  if (!groupProduct || !product || !color || !size) return "";
  return `${groupProduct.shortName}${`000${product.id}`.slice(-4)}-${
    color.shortValue
  }${!size.shortValue ? "" : `-${size.shortValue}`}`;
};
export const getFinalPrice = (totalPrice, coupon) => {
  let divide1000 = totalPrice / 1000;
  if (!coupon) return 0;
  return (divide1000 - Math.floor((divide1000 * coupon.percent) / 100)) * 1000;
};
export const exportComponentToPDF = (id) => {
  const input = document.getElementById(id);

  input.style.transform = `scale(${896 / input.getBoundingClientRect().width})`;
  html2canvas(input).then((canvas) => {
    const imgData = canvas.toDataURL("img/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
    });

    pdf.addImage(imgData, "PNG", 1, 1);
    pdf.save("File.pdf");
  });
  input.style.transform = `scale(1)`;
};

export const getNewPrice = (price, percent) => {
  let result;

  let divide1000 = price / 1000;

  result = Math.floor(divide1000 - (divide1000 * percent) / 100) * 1000;

  return result;
};
export const validateTelephone = (telephone) => {
  try {
    if (/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(telephone)) {
      return true;
    }
  } catch (error) {}
  return false;
};
export const formatHeightGuide = (min, max) => {
  let minFirst = Math.floor(min / 100);
  let maxFirst = Math.floor(max / 100);
  let minLast = min % 100;
  let maxLast = max % 100;

  if (min === 0) {
    return `D?????i ${maxFirst}m${maxLast}`;
  } else if (max === 0) {
    return `Tr??n ${minFirst}m${minLast}`;
  } else {
    return `${minFirst}m${minLast} - ${maxFirst}m${maxLast}`;
  }
};
export const formatWeightGuide = (min, max) => {
  if (min === 0) {
    return `D?????i ${max}kg`;
  } else if (max === 0) {
    return `Tr??n ${min}kg`;
  } else {
    return `${min}kg - ${max}kg`;
  }
};
export const checkIsAdmin = (user) => {
  try {
    const decoded = jwtDecode(user.access_token);
    if (decoded && decoded.role && decoded.role === "admin") {
      return true;
    }
  } catch (error) {}
  return false;
};

export const decodeToken = (token) => {
  if (!token) {
    return null;
  }
  return jwtDecode(token);
};
export const validateNumber = (input) => {
  try {
    let parseInput = parseInt(input);
    if (!isNaN(parseInput)) {
      return true;
    }
  } catch (error) {}
  return false;
};
export const toSlug = (str) => {
  // Chuy???n h???t sang ch??? th?????ng
  str = str.toLowerCase();

  // x??a d???u
  str = str.replace(/(??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???)/g, "a");
  str = str.replace(/(??|??|???|???|???|??|???|???|???|???|???)/g, "e");
  str = str.replace(/(??|??|???|???|??)/g, "i");
  str = str.replace(/(??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???)/g, "o");
  str = str.replace(/(??|??|???|???|??|??|???|???|???|???|???)/g, "u");
  str = str.replace(/(???|??|???|???|???)/g, "y");
  str = str.replace(/(??)/g, "d");

  str = str.replace(/(\s+-\s+)/g, "-");

  // X??a k?? t??? ?????c bi???t
  str = str.replace(/([^0-9a-z-\s])/g, "");

  // X??a kho???ng tr???ng thay b???ng k?? t??? -
  str = str.replace(/(\s+)/g, "-");

  // x??a ph???n d??? - ??? ?????u
  str = str.replace(/^-+/g, "");

  // x??a ph???n d?? - ??? cu???i
  str = str.replace(/-+$/g, "");

  // return
  return str;
};
export const getURL = (input) => {
  try {
    if (input) {
      return `${SERVER_URL}${input}`;
    }
  } catch (error) {}
  return "";
};
