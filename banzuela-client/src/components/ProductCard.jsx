import Button from './Button';

const ProductCard = ({ product, index }) => {
  return (
    <article className="flex h-full flex-col rounded-3xl border-2 border-yellow-600 bg-zinc-100 p-4">

      <div className="flex aspect-4/3 items-center justify-center rounded-[1.25rem] border-2 border-yellow-400 bg-zinc-200">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover rounded-[1.25rem]"
        />
      </div>

      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-700">
        {product.category} {String(index + 1).padStart(2, '0')}
      </p>

      <h3 className="mt-2 text-lg font-semibold text-zinc-900">
        {product.title}
      </h3>

      <p className="mt-2 text-base font-bold text-zinc-900">
        {product.price}
      </p>

      <p className="mt-3 text-sm leading-6 text-yellow-600">
        {product.content[0].substring(0, 120)}...
      </p>

      {/* 👇 KEY FIX */}
      <div className="mt-auto pt-4">
        <Button to={`/products/${product.name}`} className="w-full">
          View Product
        </Button>
      </div>

    </article>
  );
};

export default ProductCard;