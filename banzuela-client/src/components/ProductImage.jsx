import React from "react";
import productImages from "../assets/ProductImages.js";

const fallback =
  "https://placehold.co/200x200?text=No+Image";

export default function ProductImage({
  src,
  alt = "Product",
  width = 200,
  height = 200,
  className = "",
}) {
  const getImageSource = () => {
    if (!src) {
      return fallback;
    }

    // If the database value matches a local image
    if (productImages[src]) {
      return productImages[src];
    }

    return src;
  };

  return (
    <img
      src={getImageSource()}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{
        width,
        height,
        objectFit: "cover",
        borderRadius: "8px",
      }}
      onError={(event) => {
        if (event.currentTarget.src !== fallback) {
          event.currentTarget.src = fallback;
        }
      }}
    />
  );
}