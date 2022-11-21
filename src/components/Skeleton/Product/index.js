import { Skeleton } from "@mui/material";
import { useRef } from "react";

const ProductSkeleton = () => {
  const ref = useRef();
  return (
    <div ref={ref}>
      <Skeleton
        variant="rectangular"
        height={
          ref.current ? ref.current.getBoundingClientRect().width * 1.5 : 300
        }
      />
      <Skeleton variant="text" />
      <Skeleton variant="text" />
    </div>
  );
};

export default ProductSkeleton;
