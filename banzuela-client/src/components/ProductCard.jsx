import Button from "./Button";
import ProductImage from "./ProductImage.jsx";


const ProductCard = ({ product, index }) => {

  const categoryName =
    typeof product.category === "object"
      ? product.category?.categoryName
      : product.category;


  return (

    <article className="flex h-full flex-col rounded-3xl border-2 border-yellow-600 bg-zinc-100 p-4">


      {/* IMAGE */}

      <div className="flex aspect-4/3 items-center justify-center rounded-[1.25rem] border-2 border-yellow-400 bg-zinc-200">
        <ProductImage
          src={product.image}
          alt={product.productName}
          width="100%"
          height="100%"
           className="h-full w-full rounded-[1.25rem] object-cover"
        />

      </div>


      {/* CATEGORY */}

      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-700">

        {categoryName}{" "}

        {String(index + 1).padStart(2, "0")}

      </p>


      {/* NAME */}

      <h3 className="mt-2 text-lg font-semibold text-zinc-900">

        {product.productName}

      </h3>


      {/* PRICE */}

      <p className="mt-2 text-base font-bold text-zinc-900">

        PHP {Number(product.price).toLocaleString()}

      </p>


      {/* DESCRIPTION */}

      <p className="mt-3 text-sm leading-6 text-yellow-600">

        {product.description?.substring(0, 120)}

        {product.description?.length > 120
          ? "..."
          : ""}

      </p>


      {/* BUTTON */}

      <div className="mt-auto pt-4">

        <Button
          to={`/products/${product._id}`}
          className="w-full"
        >
          View Product
        </Button>

      </div>


    </article>

  );

};


export default ProductCard;