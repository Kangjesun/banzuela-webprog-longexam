import { useParams } from 'react-router-dom';
import Button from '../../components/Button.jsx';
import products from '../../assets/product-content.js'

function ProductPage() {
  const { name } = useParams();
  const product = products.find(product => product.name === name);

  if (!product) {
    return (
      <div className="flex w-full flex-col gap-6">
        <section className="border-y-2 border-yellow-400 bg-blue-950/95 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold text-zinc-900">Product not found</h1>
            <Button to="/products" className="mt-6">Back to Products</Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      
      <section className="border-y-2 border-yellow-400 bg-blue-950/95 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-4">
            <Button to="/products" variant="primary">Back to Products</Button>
          </div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-100">
            {product.category}
          </p>
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
            {product.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-yellow-600">
            <span className="font-bold text-yellow-100">{product.price}</span>
            <span>{product.stock}</span>
          </div>
        </div>
      </section>

      <section className="border-y-2 border-yellow-400 bg-blue-950/95 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex aspect-4/3 items-center justify-center rounded-[1.25rem] border-2 border-yellow-400 bg-white">
         <img
                src={product.image}
                alt={product.title}
                className="h-flex w-flex object-cover rounded-[1.25rem] bg-zinc-200"
              />
          </div>

          <div className="prose prose-sm max-w-none space-y-4 text-yellow-400">
            {product.content.map((paragraph, index) => (
              <p key={index} className="text-base leading-7 text-yellow-400 whitespace-pre-wrap">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-8 border-t-2 border-yellow-400 pt-6">
            <Button variant="primary" className="mr-3">Add to Cart</Button>
            <Button to="/products">Back to Products</Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductPage;
